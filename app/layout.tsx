import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "측정 기준봉 정비소 | 같은 단위칸으로 바르게 재어요";
const description = "초등 1~2학년을 위한 시작점, 단위칸, 눈금 사이 길이 측정 학습 앱입니다.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: "측정 기준봉 정비소",
      locale: "ko_KR",
      type: "website",
      images: [{ url: "/og.png", width: 1734, height: 907, alt: "따뜻한 목공 작업대에서 기준봉을 정비하는 측정 기준봉 정비소" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
