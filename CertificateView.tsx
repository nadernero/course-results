
import React, { useState, useRef } from 'react';
import type { StudentResult } from './types';
import { Certificate } from './Certificate';
import CertificateCustomizer from './CertificateCustomizer';
import type { CertificateTexts } from './App';


// Add types for html2canvas and jspdf to the global window object
declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
    jspdf: {
      jsPDF: new (options?: any) => any;
    };
  }
}

interface CertificateViewProps {
  result: StudentResult;
  onBackToResult: () => void;
  certificateTexts: CertificateTexts;
}

const CertificateView: React.FC<CertificateViewProps> = ({ result, onBackToResult, certificateTexts }) => {
  const [fontFamily, setFontFamily] = useState<string>("'Noto Naskh Arabic', serif");
  const [colorScheme, setColorScheme] = useState<string>('blue');
  const [certificateDesign, setCertificateDesign] = useState<string>('vintage');
  const [fontColor, setFontColor] = useState<string>('default');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false);


  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    const certificateElement = certificateRef.current;
    if (!certificateElement || !window.html2canvas || !window.jspdf) {
      alert("لا يمكن تحميل الشهادة الآن، يرجى المحاولة مرة أخرى.");
      return;
    }

    setIsDownloading(true);
    const { jsPDF } = window.jspdf;

    window.html2canvas(certificateElement, {
      scale: 3, // Capture at 3x resolution for high quality
      useCORS: true,
      backgroundColor: null,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`شهادة-${result.name}.pdf`);
    }).catch(err => {
      console.error("Error generating PDF:", err);
      alert("حدث خطأ أثناء إنشاء ملف PDF.");
    }).finally(() => {
      setIsDownloading(false);
    });
  };

  const handleDownloadImage = () => {
    const certificateElement = certificateRef.current;
    if (!certificateElement || !window.html2canvas) {
      alert("لا يمكن حفظ الشهادة كصورة الآن، يرجى المحاولة مرة أخرى.");
      return;
    }
    setIsDownloadingImage(true);

    window.html2canvas(certificateElement, {
      scale: 3, // Capture at 3x resolution for high quality
      useCORS: true,
      backgroundColor: null,
    }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `شهادة-${result.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(err => {
      console.error("Error generating image:", err);
      alert("حدث خطأ أثناء إنشاء الصورة.");
    }).finally(() => {
      setIsDownloadingImage(false);
    });
  };


  return (
    <div className="flex flex-col items-center w-full">
      <div className="no-print w-full">
        <CertificateCustomizer
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          colorScheme={colorScheme}
          setColorScheme={setColorScheme}
          certificateDesign={certificateDesign}
          setCertificateDesign={setCertificateDesign}
          fontColor={fontColor}
          setFontColor={setFontColor}
        />
      </div>

      <div id="certificate-print-area" className="w-full mt-4 sm:mt-6">
        <Certificate
          result={result}
          fontFamily={fontFamily}
          colorScheme={colorScheme}
          certificateDesign={certificateDesign}
          fontColor={fontColor}
          certificateRef={certificateRef}
          certificateTexts={certificateTexts}
        />
      </div>


      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 sm:mt-6 w-full max-w-5xl no-print">
         <button
            onClick={handleDownloadPdf}
            disabled={isDownloading || isDownloadingImage}
            className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:bg-green-300 disabled:cursor-wait"
        >
            {isDownloading ? 'جاري التحميل...' : 'حفظ الشهادة PDF'}
        </button>
        <button
            onClick={handleDownloadImage}
            disabled={isDownloading || isDownloadingImage}
            className="w-full sm:w-auto bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:bg-sky-300 disabled:cursor-wait"
        >
            {isDownloadingImage ? 'جاري الحفظ...' : 'حفظ الشهادة كصورة'}
        </button>
        <button
            onClick={onBackToResult}
            className="w-full sm:w-auto bg-gray-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
            العودة للنتيجة
        </button>
      </div>
    </div>
  );
};

export default CertificateView;
