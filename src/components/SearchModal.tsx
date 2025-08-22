import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Eye, Search } from 'lucide-react';
import axiosInstance from '@/utils/axios';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: {
    id: number;
    name: string;
  };
  publishDate: string;
  publishTime: string;
  views: number;
  matchScore: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, searchQuery }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const modalRef = useRef<HTMLDivElement>(null);

  const calculateMatchScore = (article: any, query: string): number => {
    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 0);
    let score = 0;
    
    const title = article.title.toLowerCase();
    const category = article.category.name.toLowerCase();
    const excerpt = article.excerpt?.toLowerCase() || '';
    
    queryWords.forEach(word => {
      // Title matches get highest score
      if (title.includes(word)) {
        score += title.split(word).length - 1; // Count occurrences
        score += 10; // Bonus for title match
      }
      
      // Category matches get medium score
      if (category.includes(word)) {
        score += category.split(word).length - 1;
        score += 5; // Bonus for category match
      }
      
      // Excerpt matches get lower score
      if (excerpt.includes(word)) {
        score += excerpt.split(word).length - 1;
        score += 1; // Small bonus for excerpt match
      }
    });
    
    return score;
  };

  const searchArticles = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`articles/?page=1&page_size=100`);
      // Handle both array response and paginated response
      const articles = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      // Filter and score articles
      const scoredResults = articles
        .map((article: any) => ({
          ...article,
          matchScore: calculateMatchScore(article, query)
        }))
        .filter((article: any) => article.matchScore > 0)
        .sort((a: any, b: any) => b.matchScore - a.matchScore)
        .slice(0, 10); // Limit to top 10 results
      
      setResults(scoredResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && searchQuery) {
      searchArticles(searchQuery);
      setSelectedIndex(-1);
    }
  }, [isOpen, searchQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleResultClick = (article: SearchResult) => {
    navigate(`/news/${article.id}`);
    onClose();
  };

  const formatTime = (publishDate: string, publishTime: string) => {
    try {
      const publishDateTime = new Date(`${publishDate}T${publishTime}`);
      const now = new Date();
      const hoursDiff = Math.floor((now.getTime() - publishDateTime.getTime()) / (1000 * 60 * 60));
      
      if (hoursDiff < 1) {
        return 'अहिले';
      } else if (hoursDiff < 24) {
        return `${hoursDiff} घण्टा अगाडि`;
      } else {
        const daysDiff = Math.floor(hoursDiff / 24);
        return `${daysDiff} दिन अगाडि`;
      }
    } catch (error) {
      return 'समय उपलब्ध छैन';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden focus:outline-none"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold">खोज परिणामहरू</h2>
            {searchQuery && (
              <span className="text-sm text-gray-500">"{searchQuery}" को लागि</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">खोजिदै...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 space-y-4">
              {results.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleResultClick(article)}
                  className={`flex items-start space-x-4 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedIndex === results.indexOf(article)
                      ? 'bg-red-50 border-l-4 border-red-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={article.featuredImage || '/placeholder-news.jpg'}
                    alt={article.title}
                    className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-news.jpg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">
                        {article.category.name}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(article.publishDate, article.publishTime)}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="w-3 h-3 mr-1" />
                        {article.views}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">"{searchQuery}" को लागि कुनै परिणाम फेला परेन</p>
              <p className="text-sm text-gray-400 mt-2">
                फरक शब्दहरू प्रयोग गरेर पुनः खोज्नुहोस्
              </p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">समाचार खोज्न सुरु गर्नुहोस्</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;