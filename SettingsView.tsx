
import React, { useState } from 'react';
import type { CertificateTexts } from './App';

// --- SVG Icons ---
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563.097-1.159.162-1.77.162a9 9 0 115.912-8.95.75.75 0 011.112.465z" /></svg>;
const SecurityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.602-.39-3.124-1.098-4.445A11.951 11.951 0 0012 3c-2.236 0-4.34-.74-6.042-2.036z" /></svg>;
const ActionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>;
const VariableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;


interface SettingsViewProps {
    onBack: () => void;
    certificateTexts: CertificateTexts;
    setCertificateTexts: React.Dispatch<React.SetStateAction<CertificateTexts>>;
}

const textLabels: Record<keyof CertificateTexts, string> = {
    mainTitle: 'العنوان الرئيسي للشهادة',
    subTitle: 'العنوان الفرعي (اسم الجهة)',
    introLine: 'جملة التقديم الأولية',
    bodyLine1: 'النص قبل اسم الخدمة',
    bodyLine2: 'النص قبل اسم الكورس',
    bodyLine3: 'اسم الكورس',
    bodyLine4: 'النص بعد اسم الكورس وقبل التقدير',
    patronageTitle: 'عنوان الراعي',
    patronName: 'اسم الراعي وتفاصيله',
    responsiblePriestTitle: 'لقب الكاهن المسؤول',
};


const SettingsView: React.FC<SettingsViewProps> = ({ onBack, certificateTexts, setCertificateTexts }) => {
    const [activeTab, setActiveTab] = useState('variables');

     const handleTextChange = (key: keyof CertificateTexts, value: string) => {
        setCertificateTexts(prev => ({ ...prev, [key]: value }));
    };

    return (
    <div className="w-full max-w-6xl mx-auto flex flex-col animate-fade-in-up">
        <div className="w-full flex flex-row-reverse md:flex-row gap-8">
            {/* --- Main Content --- */}
            <main className="w-full md:w-3/4">
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">إدارة المفاتيح والمتغيرات</h1>
                <p className="mt-2 text-slate-600">
                    المفاتيح (Secrets) هي بيانات حساسة مشفرة مثل مفاتيح API. المتغيرات (Variables) تستخدم لتخزين بيانات الإعدادات غير الحساسة.
                </p>

                <div className="mt-6 border-b border-gray-300">
                    <div className="flex gap-x-4">
                        <button onClick={() => setActiveTab('secrets')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'secrets' ? 'border-b-2 border-orange-500 text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
                            المفاتيح
                        </button>
                        <button onClick={() => setActiveTab('variables')} className={`px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'variables' ? 'border-b-2 border-orange-500 text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
                            المتغيرات
                        </button>
                    </div>
                </div>

                {activeTab === 'secrets' && (
                    <div className="mt-6 space-y-6">
                        <div className="border border-gray-300 rounded-lg">
                            <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-gray-300">مفاتيح واجهة برمجة التطبيقات (API Keys)</h2>
                            <div className="p-6 text-center text-slate-600 bg-gray-50">
                                <p>لم يتم تكوين أي مفاتيح API بعد.</p>
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                                    <strong>تحذير أمني:</strong> يجب عدم تخزين أو استخدام مفاتيح Gemini API مباشرة في تطبيق الواجهة الأمامية. يجب أن تتم جميع الطلبات عبر خادم خلفي آمن لحماية مفتاحك من السرقة.
                                </div>
                                <button className="mt-4 px-4 py-2 bg-gray-200 text-slate-800 font-semibold text-sm rounded-md border border-gray-300 hover:bg-gray-300 transition-colors">
                                    إدارة المفاتيح
                                </button>
                            </div>
                        </div>
                         <div className="border border-gray-300 rounded-lg">
                            <h2 className="text-lg font-semibold text-slate-800 p-4 border-b border-gray-300">مفاتيح التطبيق</h2>
                            <div className="p-6 text-center text-slate-600 bg-gray-50">
                                <p>لا يوجد مفاتيح محفوظة للتطبيق.</p>
                                <button className="mt-4 px-5 py-2 bg-green-600 text-white font-semibold text-sm rounded-md hover:bg-green-700 transition-colors">
                                    إضافة مفتاح جديد
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'variables' && (
                    <div className="mt-6 border border-gray-300 rounded-lg">
                        <div className="p-4 border-b border-gray-300">
                             <h2 className="text-lg font-semibold text-slate-800">متغيرات نصوص الشهادة</h2>
                             <p className="text-sm text-slate-500 mt-1">
                                قم بتعديل النصوص التي تظهر في شهادة التقدير. التغييرات ستُطبق فوراً.
                             </p>
                        </div>
                        <div className="p-6 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                           {Object.keys(certificateTexts).map((key) => (
                                <div key={key}>
                                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {textLabels[key as keyof CertificateTexts]}
                                    </label>
                                    <textarea
                                        id={key}
                                        rows={key === 'patronName' ? 3 : 2}
                                        value={certificateTexts[key as keyof CertificateTexts]}
                                        onChange={(e) => handleTextChange(key as keyof CertificateTexts, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* --- Sidebar --- */}
            <aside className="hidden md:block w-1/4">
                <nav className="space-y-4">
                    <div>
                        <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">عام</h3>
                        <ul className="space-y-1">
                             <li><a href="#" className="flex items-center gap-x-3 px-3 py-1.5 text-slate-700 rounded-md hover:bg-gray-200 transition-colors text-sm"><SettingsIcon /><span>الإعدادات العامة</span></a></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">الوصول</h3>
                        <ul className="space-y-1">
                             <li><a href="#" className="flex items-center gap-x-3 px-3 py-1.5 text-slate-700 rounded-md hover:bg-gray-200 transition-colors text-sm"><VariableIcon /><span>المتعاونون</span></a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">الأمان</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="flex items-center gap-x-3 px-3 py-1.5 text-slate-700 rounded-md hover:bg-gray-200 transition-colors text-sm"><SecurityIcon/><span>أمان متقدم</span></a></li>
                             <li><a href="#" className="flex items-center gap-x-3 px-3 py-1.5 text-slate-700 rounded-md hover:bg-gray-200 transition-colors text-sm"><KeyIcon/><span>مفاتيح النشر</span></a></li>
                            <li>
                                <a href="#" className="flex items-center gap-x-3 px-3 py-1.5 text-slate-900 bg-gray-200 rounded-md transition-colors text-sm font-semibold border-l-2 border-blue-600">
                                    <ActionIcon/>
                                    <span>المفاتيح والمتغيرات</span>
                                </a>
                                <ul className="mt-1 ml-6 space-y-1">
                                    <li><a href="#" className="flex items-center gap-x-2 px-3 py-1 text-blue-600 rounded-md text-sm font-semibold"><span>الإجراءات</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>
        </div>
         <button
            onClick={onBack}
            className="mt-10 mx-auto px-6 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
            العودة للتطبيق
        </button>
    </div>
    );
};

export default SettingsView;
