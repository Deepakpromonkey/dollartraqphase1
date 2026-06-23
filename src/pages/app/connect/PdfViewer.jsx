import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import Assignment from '@mui/icons-material/Assignment'
import ZoomIn from '@mui/icons-material/ZoomIn'
import ZoomOut from '@mui/icons-material/ZoomOut'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

export default function PdfViewer({ pdfUrl }) {
  
    const [numPages, setNumPages] = useState();

    const [scale, setScale] = useState(.7);

    function onDocumentLoadSuccess({ numPages }) {
    
        setNumPages(numPages);
    }

    return (
        <div>
            <div className="bg-[#F5F7FB] p-2 rounded-lg flex items-center justify-between">
                <div>
                    <Assignment style={{fontSize: 18}} className="text-[#006C49]" />
                    <span className="text-xs text-gray-600 ml-2">Agreement.pdf</span>
                </div>

                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setScale(prev => Math.max(0.5, prev - 0.2))}
                    >
                        <ZoomOut style={{fontSize: 16}} className="text-[#191C1E]" />
                    </button>

                    <span className="text-gray-500 text-xs">{Math.round(scale * 100)}%</span>

                    <button
                        onClick={() => setScale(prev => Math.min(3, prev + 0.2))}
                    >
                        <ZoomIn style={{fontSize: 16}} className="text-[#191C1E]" />
                    </button>
                </div>
            </div>

            <div className="border-8 border-[#F5F7FB] rounded-lg mt-3">
                <div className="w-full h-[500px] overflow-scroll">
                    <Document
                        file={'/sample-doc.pdf'}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(error) => console.error(error)}
                    >
                        {Array.from(
                            
                            new Array(numPages), (_, index) => (
                                
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    scale={scale}
                                />
                            )
                        )}
                    </Document>
                </div>
            </div>
        </div>
    );
}