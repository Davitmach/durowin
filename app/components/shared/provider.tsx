'use client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useLanguageStore } from '@/app/store';
import { useEffect, useState } from 'react';

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const manifestUrl = language === 'eng'
    ? 'https://durowin.xyz/eng/'
    : 'https://durowin.xyz/ru/';

  if (!mounted) return null; // дождись клиента


  return (
    <TonConnectUIProvider manifestUrl={'https://durowin.vercel.app/tonconnect-manifest.json'}>
      {children}
    </TonConnectUIProvider>
  );
};
