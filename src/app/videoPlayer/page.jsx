"use client";

import Header from "@/src/components/Header";
import Link from "next/link";
import VideoPlayerSection from "@/src/components/VideoPlayer";
import ImageContainer from "@/src/components/ImageContainer";
import PDFViewerSection from "@/src/components/PdfViewer";

export default function VideoPlayerPage() {
  return (
    <div>
      <Header />
      <div className="w-full px-[20px] md:px-[200px] p-6 bg-gradient-to-br from-[#667eea] to-[#764ba2] min-h-screen text-gray-800">
        <Link href="/">
          <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl">
            ⬅ Back Home
          </button>
        </Link>

        <VideoPlayerSection />

        <ImageContainer />

        <PDFViewerSection />
      </div>
    </div>
  );
}
