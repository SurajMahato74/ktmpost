import React from 'react';
import { Search, Menu, Bell, User } from 'lucide-react';

const Header = () => {
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
            <div className="relative w-full sm:w-auto max-w-[150px] sm:max-w-none">
              <input
                type="text"
                placeholder="समाचार खोज्नुहोस्..."
                className="w-full sm:w-auto pl-10 pr-4 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-300 text-gray-800"
              />
              <Search className="w-4 h-4 absolute left-3 top-1.5 text-gray-400" />
            </div>
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
            <div className="flex items-center justify-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">केटीएम</h1>
              <h1 className="text-4xl font-bold text-gray-900 ml-2">पोस्ट</h1>
            </div>
            <span className="text-sm text-gray-600 font-medium tracking-wide">काठमाडौंको आवाज</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-3 sm:gap-4 lg:gap-6 overflow-x-auto w-full py-2 scrollbar-thin sm:scrollbar-hide scrollbar-thumb-red-600 scrollbar-track-gray-100">
            <a
              href="#"
              className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
            >
              गृहपृष्ठ
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
            >
              राजनीति
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
            >
              अर्थतन्त्र
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
            >
              खेलकुद
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
            >
              मनोरञ्जन
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
            >
              विचार
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
            >
              स्वास्थ्य
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="relative text-gray-700 hover:text-red-600 font-bold transition-colors whitespace-nowrap group text-sm sm:text-base"
            >
              शिक्षा
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="sm:hidden absolute right-4 top-6">
            <button>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;