import React from 'react';
import type { StudentResult } from './types';
import LoadingSpinner from './LoadingSpinner';

interface ResultDisplayProps {
  results: StudentResult[];
  onShowCertificate: (result: StudentResult) => void;
  onGenerateMessage: () => void;
  motivationalMessage: string;
  isMessageLoading: boolean;
  onGenerateAdvice: () => void;
  spiritualAdvice: string;
  isAdviceLoading: boolean;
  onNewSearch: () => void;
  onGenerateSpecialMessage: () => void;
  specialMessage: string;
  isSpecialMessageLoading: boolean;
}

const getScoreColorClass = (score: number | 'غائب'): string => {
  if (score === 'غائب') return 'text-red-600 font-bold';
  if (score >= 90) return 'text-green-600 font-bold';
  if (score >= 80) return 'text-sky-600 font-bold';
  if (score >= 70) return 'text-amber-600 font-bold';
  return 'text-red-500 font-bold';
};

const getAttendanceColorClass = (attendance: number): string => {
  if (attendance >= 90) return 'text-green-600 font-bold';
  if (attendance >= 75) return 'text-sky-600 font-bold';
  if (attendance >= 50) return 'text-amber-500 font-bold';
  return 'text-red-500 font-bold';
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  results,
  onShowCertificate, 
  onGenerateMessage,
  motivationalMessage,
  isMessageLoading,
  onGenerateAdvice,
  spiritualAdvice,
  isAdviceLoading,
  onNewSearch,
  onGenerateSpecialMessage,
  specialMessage,
  isSpecialMessageLoading,
}) => {
  const isLoading = isMessageLoading || isAdviceLoading || isSpecialMessageLoading;
  const messageToShow = specialMessage || spiritualAdvice || motivationalMessage;
  
  const representativeResult = results[0];
  const personName = representativeResult.name;
  const isAbsent = representativeResult.score === 'غائب';
  const hasZeroAttendance = representativeResult.attendance === 0;


  return (
    <div className="text-center">
      <div className="animate-fade-in-up text-center">
        <h2 className="text-3xl font-bold text-slate-700">أهلاً بك</h2>
        <p className="text-4xl font-bold text-indigo-600 mt-1" style={{ fontFamily: "'El Messiri', sans-serif" }}>{personName}</p>
        <p className="text-lg text-slate-500 mt-4 mb-8">نسعد بعرض نتيجتك في كورس مجتمع يسوع.</p>
      </div>

      <div className="animate-fade-in-up bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto mb-8">
        {/* New stats section */}
        <div className="flex flex-col sm:flex-row justify-around gap-6 text-center border-b border-gray-200 pb-6 mb-6">
            {/* Attendance Stat */}
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-sky-100 text-sky-600 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-md text-slate-500 font-semibold">نسبة الحضور</p>
                <p className={`text-3xl mt-1 ${getAttendanceColorClass(representativeResult.attendance)}`}>{representativeResult.attendance}%</p>
            </div>
            {/* Score Stat */}
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 text-amber-600 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.52 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.52-4.674a1 1 0 00-.363-1.118L2.98 9.11c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.52-4.674z" /></svg>
                </div>
                <p className="text-md text-slate-500 font-semibold">الدرجة النهائية</p>
                {isAbsent ? (
                   <p className={`text-2xl mt-1 ${getScoreColorClass(representativeResult.score)}`}>غائب</p>
                ) : (
                  <p className={`text-3xl mt-1 ${getScoreColorClass(representativeResult.score)}`}>
                    {representativeResult.score}
                    <span className="text-2xl text-slate-500 font-normal"> / 100</span>
                  </p>
                )}
            </div>
        </div>
        
        {/* Services and Certificate section */}
        <div>
          <h3 className="text-xl font-bold text-indigo-800 mb-4 text-center">الخدمات المسجل بها</h3>
            <ul className="space-y-3">
              {results.map((result, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-xl shadow-sm transition-colors duration-200">
                  <div className="flex items-center gap-3">
                      <span className="text-indigo-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </span>
                      <span className="font-semibold text-slate-700 text-lg">{result.service}</span>
                  </div>
                  <button
                    onClick={() => onShowCertificate(result)}
                    disabled={isAbsent}
                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    عرض الشهادة
                  </button>
                </li>
              ))}
            </ul>
          {isAbsent && <p className="text-slate-500 text-sm mt-3 text-center">لا يمكن إصدار شهادة لحالة الغياب.</p>}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
         <button
          onClick={onGenerateMessage}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-amber-500 text-white font-bold text-lg rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 disabled:bg-amber-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          {isMessageLoading ? <LoadingSpinner/> : 'رسالة تشجيع'}
        </button>
        <button
          onClick={onGenerateAdvice}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white font-bold text-lg rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 disabled:bg-teal-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          {isAdviceLoading ? <LoadingSpinner/> : 'نصيحة روحية'}
        </button>
        {hasZeroAttendance && (
            <button
                onClick={onGenerateSpecialMessage}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-rose-600 text-white font-bold text-lg rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-75 disabled:bg-rose-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
                {isSpecialMessageLoading ? <LoadingSpinner/> : 'رسالة شخصية'}
            </button>
        )}
      </div>
      
      {/* منطقة عرض الرسالة المحسنة */}
      <div className="mt-8 p-6 bg-yellow-50/80 rounded-lg min-h-[10rem] flex items-center justify-center text-center transition-all duration-500 max-w-2xl mx-auto shadow-md relative backdrop-blur-sm">
          {isLoading ? (
              <div className="flex items-center justify-center" role="status">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-500"></div>
              </div>
          ) : messageToShow ? (
              <blockquote className="relative w-full animate-fade-in-up border-r-4 border-yellow-400 pr-4">
                  <p className="text-lg md:text-xl text-slate-800 leading-loose whitespace-pre-wrap" style={{fontFamily: "'Amiri', serif"}}>
                      {messageToShow}
                  </p>
              </blockquote>
          ) : (
              <p className="text-slate-500">اكتشف رسالة ملهمة أو نصيحة روحية عبر الضغط على الأزرار أعلاه.</p>
          )}
      </div>

      <button
        onClick={onNewSearch}
        className="mt-10 px-6 py-3 bg-gray-100 text-slate-600 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>بحث جديد</span>
      </button>

    </div>
  );
};

export default ResultDisplay;