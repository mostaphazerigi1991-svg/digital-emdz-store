import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  Trash2, 
  RefreshCw,
  Star,
  ArrowRight,
  ArrowLeft,
  Plus,
  AlertCircle,
  Eye,
  Maximize2
} from 'lucide-react';
import { compressImageFile, saveImageToStorage } from '../utils/imageStorage';

const PRESET_IMAGES = [
  { name: 'Canva Pro', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
  { name: 'ChatGPT / AI', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80' },
  { name: 'Windows 11 Pro', url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80' },
  { name: 'Office 365', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80' },
  { name: 'بطاقة RedotPay', url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80' },
  { name: 'Binance / محفظة', url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=80' },
  { name: 'خدمة رقمية', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' }
];

export interface ProductImageUploaderProps {
  value?: string; // main image url / dataUri
  additionalImages?: string[];
  onChange?: (mainImage: string) => void;
  onImagesChange?: (mainImage: string, additionalImages: string[]) => void;
  label?: string;
  required?: boolean;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  value = '',
  additionalImages = [],
  onChange,
  onImagesChange,
  label = 'صور المنتج (رفع مباشر من الجهاز)',
  required = true,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const addMoreInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  // All images array: index 0 is always main image
  const allImages = [
    ...(value ? [value] : []),
    ...(additionalImages || [])
  ];

  // Helper to trigger parent callbacks
  const notifyChanges = (newAllImages: string[]) => {
    const newMain = newAllImages[0] || '';
    const newAdditional = newAllImages.slice(1);

    if (onChange) {
      onChange(newMain);
    }
    if (onImagesChange) {
      onImagesChange(newMain, newAdditional);
    }
  };

  // Handle files selection from computer or mobile
  const handleFilesSelected = async (files: FileList | null, isAddingMore = false) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProcessingStatus(`جارٍ معالجة وضغط ${files.length} صورة بأعلى دقة...`);

    try {
      const processedDataUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        setProcessingStatus(`جارٍ رفع وضغط: ${file.name} (${i + 1}/${files.length})...`);
        const { dataUrl, width, height, compressedSize } = await compressImageFile(file, 1200, 0.85);

        // Store permanently in IndexedDB
        const imageId = `img-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`;
        await saveImageToStorage(imageId, dataUrl, file.name, file.size, width, height);

        processedDataUrls.push(dataUrl);
      }

      if (processedDataUrls.length > 0) {
        let updatedList: string[];
        if (isAddingMore) {
          updatedList = [...allImages, ...processedDataUrls];
        } else {
          // If fresh upload: replace or append
          updatedList = allImages.length === 0 
            ? processedDataUrls 
            : [...allImages, ...processedDataUrls];
        }
        notifyChanges(updatedList);
        setProcessingStatus(`تم رفع وحفظ ${processedDataUrls.length} صورة بنجاح في التخزين!`);
        setTimeout(() => setProcessingStatus(null), 3500);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('حدث خطأ أثناء قراءة وضغط الصورة. يرجى تجربة ملف آخر بصيغة JPG أو PNG أو WEBP.');
      setProcessingStatus(null);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (addMoreInputRef.current) addMoreInputRef.current.value = '';
    }
  };

  // Replace a specific image
  const handleReplaceFile = async (files: FileList | null) => {
    if (!files || files.length === 0 || replacingIndex === null) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    setIsProcessing(true);
    setProcessingStatus(`جارٍ استبدال الصورة بـ ${file.name}...`);

    try {
      const { dataUrl, width, height } = await compressImageFile(file, 1200, 0.85);
      const imageId = `img-rep-${Date.now()}`;
      await saveImageToStorage(imageId, dataUrl, file.name, file.size, width, height);

      const updated = [...allImages];
      updated[replacingIndex] = dataUrl;
      notifyChanges(updated);
      setProcessingStatus('تم استبدال الصورة بنجاح!');
      setTimeout(() => setProcessingStatus(null), 3000);
    } catch (err) {
      console.error('Replace error:', err);
      alert('فشل استبدال الصورة.');
    } finally {
      setIsProcessing(false);
      setReplacingIndex(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  // Set an image as primary (move to index 0)
  const handleSetMain = (index: number) => {
    if (index === 0 || index >= allImages.length) return;
    const copy = [...allImages];
    const [selected] = copy.splice(index, 1);
    copy.unshift(selected);
    notifyChanges(copy);
  };

  // Reorder: move left or right
  const handleMove = (index: number, direction: 'prev' | 'next') => {
    const target = direction === 'prev' ? index - 1 : index + 1;
    if (target < 0 || target >= allImages.length) return;
    const copy = [...allImages];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    notifyChanges(copy);
  };

  // Delete an image
  const handleDelete = (index: number) => {
    const copy = allImages.filter((_, i) => i !== index);
    notifyChanges(copy);
  };

  // Clear all images
  const handleClearAll = () => {
    if (window.confirm('هل أنت متأكد من حذف كافة صور هذا المنتج؟')) {
      notifyChanges([]);
    }
  };

  const mainImage = allImages[0] || '';

  return (
    <div className="space-y-4 text-right w-full">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFilesSelected(e.target.files, false)}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={addMoreInputRef}
        onChange={(e) => handleFilesSelected(e.target.files, true)}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={(e) => handleReplaceFile(e.target.files)}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          <span>{label} {required && <span className="text-rose-400">*</span>}</span>
        </label>

        {allImages.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{allImages.length} صور محددة</span>
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
            >
              حذف الكل
            </button>
          </div>
        )}
      </div>

      {/* Processing Status Banner */}
      {isProcessing && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/50 flex items-center gap-3 animate-pulse text-xs text-cyan-300 font-medium">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
          <span>{processingStatus || 'جارٍ معالجة وضغط الصور...'}</span>
        </div>
      )}

      {/* Success Notification */}
      {!isProcessing && processingStatus && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{processingStatus}</span>
        </div>
      )}

      {/* 1. If NO images uploaded yet: Large Primary Upload Dropzone */}
      {allImages.length === 0 ? (
        <div 
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-500/40 hover:border-cyan-400 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/90 to-indigo-950/30 text-center cursor-pointer transition-all hover:bg-slate-900 group shadow-lg"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Camera className="w-8 h-8" />
          </div>

          <button
            type="button"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-600/30 group-hover:from-indigo-500 group-hover:to-cyan-500 inline-flex items-center gap-2 pointer-events-none"
          >
            <Upload className="w-4 h-4" />
            <span>[ + رفع صورة المنتج من جهازك ]</span>
          </button>

          <p className="text-xs text-slate-300 font-medium mt-3">
            انقر هنا لاختيار صورة من هاتفك أو حاسوبك (يدعم JPG, JPEG, PNG, WEBP)
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            يمكنك تحديد أكثر من صورة دفعة واحدة لمعاينة صور إضافية للمنتج
          </p>

          {/* Quick preset selector inside dropzone */}
          <div className="mt-5 pt-4 border-t border-slate-800/80" onClick={(e) => e.stopPropagation()}>
            <span className="block text-[11px] font-bold text-slate-400 mb-2">أو اختر صورة جاهزة عالية الجودة بنقرة واحدة:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => notifyChanges([preset.url])}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600/30 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <img src={preset.url} alt={preset.name} className="w-4 h-4 rounded object-cover" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 2. When images ARE uploaded: Main Preview + Gallery management */
        <div className="space-y-4">
          
          {/* Main Image Spotlight Card */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-indigo-500/40 shadow-xl">
            <div className="relative aspect-video max-h-72 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={mainImage}
                alt="الصورة الرئيسية للمنتج"
                className="w-full h-full object-contain"
              />

              {/* Badges Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>الصورة الرئيسية (الغلاف)</span>
                </span>
              </div>

              {/* Action Buttons Overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewModalImg(mainImage)}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-md"
                  title="تكبير ومعاينة"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplacingIndex(0);
                    replaceInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                  title="تغيير الصورة الرئيسية"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تغيير الصورة</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(0)}
                  className="p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/60 shadow-md cursor-pointer"
                  title="حذف هذه الصورة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Additional Images Grid & Reordering */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>معرض صور المنتج ({allImages.length} صور) - يمكنك الترتيب وتعيين الرئيسية:</span>
              </span>

              {/* Add More Images Button */}
              <button
                type="button"
                onClick={() => addMoreInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>[ + إضافة صور إضافية ]</span>
              </button>
            </div>

            {/* Thumbnail cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
              {allImages.map((imgUrl, index) => {
                const isMain = index === 0;

                return (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden border p-1 bg-slate-900 transition-all ${
                      isMain ? 'border-amber-400/80 ring-2 ring-amber-400/30' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-950">
                      <img
                        src={imgUrl}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isMain && (
                        <div className="absolute top-1 right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                          الرئيسية ⭐
                        </div>
                      )}
                    </div>

                    {/* Actions under thumbnail */}
                    <div className="pt-2 pb-1 px-1 flex flex-col gap-1.5">
                      {!isMain && (
                        <button
                          type="button"
                          onClick={() => handleSetMain(index)}
                          className="w-full py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Star className="w-3 h-3" />
                          <span>تعيين كرئيسية</span>
                        </button>
                      )}

                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        {/* Reorder Arrows */}
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMove(index, 'prev')}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                            title="تقديم الصورة"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === allImages.length - 1}
                            onClick={() => handleMove(index, 'next')}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                            title="تأخير الصورة"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Replace & Delete */}
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setReplacingIndex(index);
                              replaceInputRef.current?.click();
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-indigo-900 text-cyan-300 cursor-pointer"
                            title="استبدال"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className="p-1 rounded bg-slate-800 hover:bg-rose-900 text-rose-300 cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add more slot card */}
              <button
                type="button"
                onClick={() => addMoreInputRef.current?.click()}
                className="aspect-square rounded-xl border border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/60 hover:bg-slate-900 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-cyan-300 transition-all cursor-pointer p-3"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-cyan-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-center">رفع صورة إضافية</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewModalImg && (
        <div 
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] p-2 bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={previewModalImg} 
              alt="معاينة كاملة" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl mx-auto" 
            />
            <p className="text-center text-xs text-slate-400 mt-2 font-sans">
              انقر في أي مكان للإغلاق
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
