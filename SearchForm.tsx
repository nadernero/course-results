
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SearchFormProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  error: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ query, setQuery, onSearch, isLoading, error }) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-slate-700 mb-4">ابحث عن نتيجتك</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        أدخل الكود الخاص بك أو رقم الموبايل المسجل لدينا للاستعلام عن نتيجتك في الكورس وطباعة شهادة التقدير.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ادخل الكود أو رقم الموبايل هنا..."
            className="flex-grow w-full px-4 py-3 text-lg text-center text-gray-700 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : 'بحث'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}
      </form>
    </div>
  );
};

export default SearchForm;
