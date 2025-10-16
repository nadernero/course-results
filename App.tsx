
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from './firebaseConfig';
import type { StudentResult } from './types';
import SearchForm from './SearchForm';
import CertificateView from './CertificateView';
import ResultDisplay from './ResultDisplay';
import Logo from './Logo';
import SettingsView from './SettingsView';


// --- Helper function for handling Gemini API errors ---
const handleGenerationError = (error: unknown, setter: React.Dispatch<React.SetStateAction<string>>) => {
    console.error("Error during content generation:", error);
    // More informative user-facing error message for all API-related issues.
    const userErrorMessage = "عفواً، خدمة الرسائل الذكية غير متاحة حالياً بسبب مشكلة في الإعدادات. يرجى التواصل مع مسؤول الخدمة.";
    setter(userErrorMessage);
};
// ----------------------------------------------------

export interface CertificateTexts {
  mainTitle: string;
  subTitle: string;
  introLine: string;
  bodyLine1: string;
  bodyLine2: string;
  bodyLine3: string;
  bodyLine4: string;
  patronageTitle: string;
  patronName: string;
  responsiblePriestTitle: string;
}


const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [foundResults, setFoundResults] = useState<StudentResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [selectedResultForCert, setSelectedResultForCert] = useState<StudentResult | null>(null);
  
  const [motivationalMessage, setMotivationalMessage] = useState<string>('');
  const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);

  const [spiritualAdvice, setSpiritualAdvice] = useState<string>('');
  const [isAdviceLoading, setIsAdviceLoading] = useState<boolean>(false);
  
  const [specialMessage, setSpecialMessage] = useState<string>('');
  const [isSpecialMessageLoading, setIsSpecialMessageLoading] = useState<boolean>(false);
  
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const [certificateTexts, setCertificateTexts] = useState<CertificateTexts>({
    mainTitle: 'شهادة تقدير',
    subTitle: 'الأمانة العامة لكنيسة القديس بولس بالعبور  إجتماع الخدام العام',
    introLine: 'بكل الحب والتقدير تتشرف الأمانة العامة للخدمة بمنح هذه الشهادة الي',
    bodyLine1: 'الخادم في',
    bodyLine2: 'وذلك لاجتيازه بنجاح',
    bodyLine3: 'كورس مجتمع يسوع',
    bodyLine4: 'لخدام وخادمات الكنيسة، بتقدير عام',
    patronageTitle: 'تحت رعاية',
    patronName: 'القمص روفائيل الأنبا بيشوي\nالنائب البابوي لمدينة العبور',
    responsiblePriestTitle: 'الأب الكاهن المسئول',
  });

  // --- Gemini AI Initialization using useMemo for efficiency ---
  const { ai, apiKeyError } = useMemo(() => {
    const apiKey = process.env.API_KEY;
    const userFacingError = "عفواً، خدمة الرسائل الذكية غير متاحة حالياً بسبب مشكلة في الإعدادات. يرجى التواصل مع مسؤول الخدمة.";

    if (!apiKey || apiKey === "undefined") {
      // Log a detailed error for the developer in the console.
      console.error("Gemini API Key is missing. Please ensure the GEMINI_API_KEY is set in your environment variables for the production build.");
      // Return a generic error for the user.
      return { ai: null, apiKeyError: userFacingError };
    }
    try {
      const genAI = new GoogleGenAI({ apiKey });
      return { ai: genAI, apiKeyError: '' };
    } catch (error) {
      console.error("Error initializing GoogleGenAI (likely an invalid key format):", error);
       // Return a generic error for the user.
      return { ai: null, apiKeyError: userFacingError };
    }
  }, []); // Empty dependency array ensures this runs only once per component mount.
  // -----------------------------------------------------------

  // Function to normalize mobile numbers by removing the leading '0'
  const normalizeMobile = (num: string | number): string => {
    const str = String(num || '').trim();
    return str.startsWith('0') ? str.substring(1) : str;
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setError('يرجى إدخال الكود أو رقم الموبايل');
      setFoundResults(null);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setFoundResults(null);

    try {
      const queryTrimmed = searchQuery.trim();
      const normalizedQuery = normalizeMobile(queryTrimmed);
      
      const studentsRef = collection(db, "students");

      // Firestore doesn't support OR queries on different fields, so we run two separate queries
      const queryByCode = query(studentsRef, where("code", "==", queryTrimmed));
      const queryByMobile = query(studentsRef, where("mobileNumber", "==", normalizedQuery));

      const [codeSnapshot, mobileSnapshot] = await Promise.all([
        getDocs(queryByCode),
        getDocs(queryByMobile)
      ]);

      // Use a Map to store results and automatically handle duplicates
      const resultsMap = new Map<string, StudentResult>();
      
      codeSnapshot.forEach((doc) => {
        resultsMap.set(doc.id, doc.data() as StudentResult);
      });
      
      mobileSnapshot.forEach((doc) => {
        resultsMap.set(doc.id, doc.data() as StudentResult);
      });

      const results = Array.from(resultsMap.values());
      
      if (results.length > 0) {
        setFoundResults(results);
      } else {
        setFoundResults(null);
        setError('لم يتم العثور على نتائج. يرجى التأكد من الكود أو رقم الموبايل.');
      }
    } catch (err) {
      console.error("Error searching Firestore:", err);
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);
  
  const resetSearch = () => {
    setSearchQuery('');
    setFoundResults(null);
    setSelectedResultForCert(null);
    setError('');
    setMotivationalMessage('');
    setSpiritualAdvice('');
    setSpecialMessage('');
  };

  const handleShowCertificate = (result: StudentResult) => {
    setSelectedResultForCert(result);
  };
  
  const handleGenerateMessage = async () => {
    if (!foundResults || foundResults.length === 0) return;
    
    setIsMessageLoading(true);
    setMotivationalMessage('');
    setSpiritualAdvice('');
    setSpecialMessage('');

    if (apiKeyError || !ai) {
        setMotivationalMessage(apiKeyError);
        setIsMessageLoading(false);
        return;
    }

    const representativeResult = foundResults[0]; // Message is for the person, so we take the first result's data
    const successfulResult = foundResults.find(r => r.score !== 'غائب');

    try {
        const prompt = `اكتب رسالة تشجيعية وملهمة قصيرة (سطرين أو ثلاثة) ذات طابع مسيحي لـ "${representativeResult.name}" الذي أكمل كورس "مجتمع يسوع". ${successfulResult && successfulResult.score !== 'غائب' ? `وكانت إحدى درجاته ${successfulResult.score} من 100.` : ''}`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        setMotivationalMessage(response.text);
    } catch (error) {
        handleGenerationError(error, setMotivationalMessage);
    } finally {
        setIsMessageLoading(false);
    }
  };
  
  const handleGenerateAdvice = async () => {
    if (!foundResults || foundResults.length === 0) return;
    
    setIsAdviceLoading(true);
    setSpiritualAdvice('');
    setMotivationalMessage('');
    setSpecialMessage('');

    if (apiKeyError || !ai) {
        setSpiritualAdvice(apiKeyError);
        setIsAdviceLoading(false);
        return;
    }

    const representativeResult = foundResults[0];

    try {
        const prompt = `اكتب نصيحة روحية قصيرة (من 3 إلى 5 أسطر) للخادم الروحي "${representativeResult.name}"، مستوحاة من تعاليم وكتابات قداسة البابا شنودة الثالث عن الخدمة والخدام.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        setSpiritualAdvice(response.text);
    } catch (error) {
        handleGenerationError(error, setSpiritualAdvice);
    } finally {
        setIsAdviceLoading(false);
    }
  };
  
  const handleGenerateSpecialMessage = async () => {
    if (!foundResults || foundResults.length === 0) return;
    
    setIsSpecialMessageLoading(true);
    setSpecialMessage('');
    setMotivationalMessage('');
    setSpiritualAdvice('');

    if (apiKeyError || !ai) {
        setSpecialMessage(apiKeyError);
        setIsSpecialMessageLoading(false);
        return;
    }

    const representativeResult = foundResults[0];

    try {
        const fullName = representativeResult.name;
        const firstName = fullName.split(' ')[0];
        
        const prompt = `اكتب رسالة شخصية ذات طابع مسيحي روحي إلى ${fullName}.
        يجب أن تبدأ الرسالة بمخاطبة ${fullName} مباشرة.
        يجب أن تذكر اسمه الأول، "${firstName}"، مرتين في متن الرسالة.
        الرسالة يجب أن تحثه بلطف ومحبة على أهمية الحضور والمشاركة في اجتماعات الكورس القادمة، وتؤكد على أن وجوده ومشاركته يضيفان قيمة كبيرة للمجموعة وأن الجميع يفتقده.
        الرسالة يجب ألا تزيد عن 12 سطراً.
        مهم جداً: لا تقم بإضافة أي خاتمة أو توقيع في نهاية الرسالة، فقط محتوى الرسالة نفسها.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const finalMessage = response.text.trim() + "\n\nراعي الامانة العامة / أبونا يوسيف سيدهم";
        setSpecialMessage(finalMessage);
    } catch (error) {
        handleGenerationError(error, setSpecialMessage);
    } finally {
        setIsSpecialMessageLoading(false);
    }
  };

  const renderContent = () => {
    if (selectedResultForCert) {
      return (
        <CertificateView 
          result={selectedResultForCert}
          onBackToResult={() => setSelectedResultForCert(null)}
          certificateTexts={certificateTexts}
        />
      );
    }
    if (foundResults) {
      return (
        <ResultDisplay
          results={foundResults}
          onShowCertificate={handleShowCertificate}
          onGenerateMessage={handleGenerateMessage}
          motivationalMessage={motivationalMessage}
          isMessageLoading={isMessageLoading}
          onGenerateAdvice={handleGenerateAdvice}
          spiritualAdvice={spiritualAdvice}
          isAdviceLoading={isAdviceLoading}
          onGenerateSpecialMessage={handleGenerateSpecialMessage}
          specialMessage={specialMessage}
          isSpecialMessageLoading={isSpecialMessageLoading}
          onNewSearch={resetSearch}
        />
      );
    }
    return (
      <SearchForm
        query={searchQuery}
        setQuery={setSearchQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
        error={error}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <header className="w-full max-w-4xl mx-auto text-center py-8 no-print">
        <Logo className="w-40 h-40 object-contain mx-auto" alt="شعار كنيسة القديس بولس الرسول بالعبور" />
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mt-4">كنيسة القديس بولس الرسول بالعبور</h1>
        <p className="text-2xl text-slate-700 mt-1">كورس مجتمع يسوع</p>
        <p className="text-xl text-slate-600 mt-2">استعلام عن النتائج وإصدار شهادات التقدير</p>
      </header>

      {showSettings ? (
          <SettingsView 
            onBack={() => setShowSettings(false)}
            certificateTexts={certificateTexts}
            setCertificateTexts={setCertificateTexts}
          />
      ) : (
        <main className="w-full max-w-4xl mx-auto flex-grow">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 transition-all duration-500 printable-content-wrapper">
              {renderContent()}
          </div>
        </main>
      )}
      
      <footer className="w-full text-center p-4 text-slate-500 mt-8 no-print">
        <p>&copy; {new Date().getFullYear()} كنيسة القديس بولس الرسول بالعبور. كل الحقوق محفوظة.</p>
        {!showSettings && (
             <button onClick={() => setShowSettings(true)} className="mt-2 text-slate-500 hover:text-slate-700 underline text-sm">
                الإعدادات
            </button>
        )}
      </footer>
    </div>
  );
};

export default App;
