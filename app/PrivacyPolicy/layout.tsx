import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import Script from "next/script";

const interTight = Inter_Tight({
  variable: "--font-geist-sans",
  subsets: ["latin","cyrillic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policyn",
  icons:'/logo.jpg'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <>
{children}
        <Script src="https://telegram.org/js/telegram-web-app.js"/>
</>
  );
}
