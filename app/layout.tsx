import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yujunsun-blog.vercel.app'),
  title: {
    default: "Yujunsun's Blog",
    template: "%s | Yujunsun's Blog",
  },
  description: "기술 학습 및 실무 경험 + 여행 사진을 기록하는 공간입니다.",
  keywords: ["기술 블로그", "개발", "프로그래밍", "TECH", "트러블슈팅", "프로젝트", "여행", "사진"],
  authors: [{ name: "yujunsun0" }],
  creator: "yujunsun0",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://yujunsun-blog.vercel.app",
    siteName: "Yujunsun's Blog",
    title: "Yujunsun's Blog",
    description: "기술 학습 및 실무 경험 + 여행 사진을 기록하는 공간입니다.",
    images: [
      {
        url: "/images/blog_banner.png",
        width: 1200,
        height: 630,
        alt: "기술 블로그", 
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yujunsun's Blog",
    description: "기술 학습 및 실무 경험 + 여행 사진을 기록하는 공간입니다.",
    images: ["/images/blog_banner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console 등록 시 추가
    // google: "your-google-verification-code",
  },
  icons: {
    icon: '/images/blog_logo-light.png',
    shortcut: '/images/blog_logo-light.png',
    apple: '/images/blog_logo-light.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

