import { useState } from "react";
import {
  Download,
  ZoomIn,
  ZoomOut,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function PDFViewerSection() {
  const [zoom, setZoom] = useState(100);

  const pdfUrl =
    "https://docs.google.com/gview?embedded=true&url=https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";

  //   const pdfUrl =
  //     "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf";

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "sample-document.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInNewTab = () => window.open(pdfUrl, "_blank");

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-6xl bg-white rounded-3xl  shadow-2xl border border-gray-200 flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg">
              📄
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PDF Viewer
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                sample-local-pdf.pdf
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="px-3 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all hover:scale-105 shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ZoomOut size={18} />
              <span className="text-sm">Out</span>
            </button>

            <div className="px-3 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold min-w-[70px] text-center text-sm">
              {zoom}%
            </div>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="px-3 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all hover:scale-105 shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ZoomIn size={18} />
              <span className="text-sm">In</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={openInNewTab}
              className="px-3 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all hover:scale-105 shadow flex items-center gap-2 flex-1 sm:flex-initial justify-center"
            >
              <ExternalLink size={18} />
              <span className="text-sm">Open</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all hover:scale-105 shadow-lg flex items-center gap-2 flex-1 sm:flex-initial justify-center"
            >
              <Download size={18} />
              <span className="text-sm">Download</span>
            </button>
          </div>
        </div>

        <div
          className="overflow-auto bg-gray-100 p-2 sm:p-4"
          style={{ height: "600px" }}
        >
          <div className="flex justify-center min-h-full">
            <div
              className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300 w-full max-w-4xl"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                className="border-0 w-full"
                style={{ height: "800px" }}
                title="PDF Document"
                allow="fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className="sm:hidden p-4 bg-blue-50 border-t border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            💡 For better viewing on mobile, use the "Open" button to view in a
            new tab
          </p>
        </div>

        <div className="p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  PDF Document
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              Loaded
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
