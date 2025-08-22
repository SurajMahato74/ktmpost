import React, { useState, useEffect } from 'react';
import { Search, Menu, Bell, User } from 'lucide-react';
import axiosInstance from '@/utils/axios';
import { useNavigate } from 'react-router-dom';
import SearchModal from './SearchModal';
import logoimage from '../asstes/logo.png';

// Define TypeScript interface for Category
interface Category {
  id: number;
  name: string;
  nameEnglish: string;
  description: string;
  color: string;
  icon: string;
  subcategories: string[];
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  articlesCount: number;
  order: number;
  createdAt: string;
}

const Header = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Category[]>('categories/');
      // Filter only active categories and sort by order
      const activeCategories = response.data
        .filter((category) => category.isActive)
        .sort((a, b) => a.order - b.order);
      setCategories(activeCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle category click to navigate to category page
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      setIsSearchModalOpen(true);
    } else {
      setIsSearchModalOpen(false);
    }
  };

  // Handle search focus
  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setIsSearchModalOpen(true);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchModalOpen(true);
    }
  };

  // Close search modal
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 sm:static">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white py-2">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <span className="text-xs sm:text-sm">शुक्रबार, माघ २८, २०८०</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm">काठमाडौं, नेपाल</span>
          </div>
          <div className="flex flex-wrap items-center justify-center space-x-2 sm:space-x-4">
            <a href="#" className="hover:text-yellow-300 transition-colors text-xs sm:text-sm">सम्पर्क</a>
            <a href="#" className="hover:text-yellow-300 transition-colors text-xs sm:text-sm">हाम्रो बारे</a>
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-auto max-w-[150px] sm:max-w-none">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="समाचार खोज्नुहोस्..."
                className="w-full sm:w-auto pl-10 pr-4 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-300 text-gray-800"
                autoComplete="off"
              />
              <Search className="w-4 h-4 absolute left-3 top-1.5 text-gray-400" />
            </form>
            <Bell className="w-4 h-4 cursor-pointer hover:text-yellow-300 transition-colors" />
            <User className="w-4 h-4 cursor-pointer hover:text-yellow-300 transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center">
          {/* Centered Logo */}
          <div className="text-center mb-4">
            <img 
              src={logoimage} 
              alt="KTM Post Logo" 
              className="h-14 w-auto mx-auto"
            />
            <span className="text-sm text-gray-600 font-medium tracking-wide">काठमाडौंको आवाज</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-3 sm:gap-4 lg:gap-6 overflow-x-auto w-full py-2 scrollbar-thin sm:scrollbar-hide scrollbar-thumb-red-600 scrollbar-track-gray-100">
            <a
              href="/"
              className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
            >
              गृहपृष्ठ
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            {loading ? (
              <span className="text-gray-700 text-sm sm:text-base">Loading...</span>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
                >
                  {category.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="sm:hidden absolute right-4 top-6">
            <button>
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        searchQuery={debouncedQuery}
      />
    </header>
  );
};

export default Header;