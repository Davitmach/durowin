'use client'
import { useEffect } from 'react';

import { usePathname } from 'next/navigation';
import { useLanguageStore } from '@/app/store';

const LanguageInitializer = () => {
  const pathname = usePathname();
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  useEffect(() => {
    if (pathname.startsWith('/eng')) {
      setLanguage('eng');
    } else {
      // по умолчанию или если путь начинается с / или /ru
      setLanguage('ru');
    }
  }, [pathname, setLanguage]);

  return null; // не рендерит ничего
};

export default LanguageInitializer;
