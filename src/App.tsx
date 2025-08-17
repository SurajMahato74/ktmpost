import React, { useState } from 'react';
import Header from './components/Header';
import BreakingNews from './components/BreakingNews';
import FeaturedNews from './components/FeaturedNews';
import NewsTab from './components/NewsTab';
import VideoTab from './components/VideoTab';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <Header />
      <BreakingNews />
      <FeaturedNews />
      
      {/* Tab Navigation */}
      <div className="bg-white shadow-lg sticky top-0 z-40 border-t-4 border-gradient-to-r from-red-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-12">
            <button
              onClick={() => setActiveTab('news')}
              className={`py-3 px-4 md:px-8 font-bold text-base md:text-lg transition-all relative ${
                activeTab === 'news'
                  ? 'text-red-600 border-b-4 border-red-600'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              समाचार र लेखहरू
              {activeTab === 'news' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-700"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-3 px-4 md:px-8 font-bold text-base md:text-lg transition-all relative ${
                activeTab === 'videos'
                  ? 'text-blue-600 border-b-4 border-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              भिडियो र प्रत्यक्ष प्रसारण
              {activeTab === 'videos' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-700"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen w-full">
        {activeTab === 'news' ? <NewsTab /> : <VideoTab />}
      </div>

      <Footer />
    </div>
  );
}

export default App;