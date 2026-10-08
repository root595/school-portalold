import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Image as ImageIcon } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings } = useApp();
  const [imageError, setImageError] = useState(false);

  const imageUrl = settings.hero_image_url;
  const imageAlt = settings.hero_image_alt || settings.school_name || 'صورة المدرسة الرئيسية';

  return (
    <main className="w-full flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 bg-slate-100 aspect-16/10 sm:aspect-16/9 md:aspect-21/9">
          {!imageError && imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center transition-all duration-300 transform hover:scale-[1.01]"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <ImageIcon className="w-16 h-16 stroke-1 mb-3 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">
                {imageError ? 'تعذر تحميل الصورة، يرجى تحديث الرابط من لوحة التحكم' : 'لم يتم تحديد صورة المدرسة'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
