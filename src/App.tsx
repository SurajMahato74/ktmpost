import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BreakingNews from './components/BreakingNews';
import FeaturedNews from './components/FeaturedNews';
import NewsTab from './components/NewsTab';
import VideoTab from './components/VideoTab';
import Footer from './components/Footer';
import NewsDetail from './components/NewsDetail';
import CategoryNews from './components/CategoryNews';
import Index from './pages/Index';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import News from './pages/admin/News';
import NewsCreate from './pages/admin/NewsCreate';
import NewsFeatured from './pages/admin/NewsFeatured';
import Videos from './pages/admin/Videos';
import VideosLive from './pages/admin/VideosLive';
import VideosUpload from './pages/admin/VideosUpload';
import Analytics from './pages/admin/Analytics';
import Categories from './pages/admin/Categories';
import Writers from './pages/admin/Writers';
import Login from './pages/Login';
import NewsEditor from '@/components/admin/NewsEditor';
import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
            <Header />
            <BreakingNews />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <FeaturedNews />
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
                    <div className="min-h-screen w-full">
                      {activeTab === 'news' ? <NewsTab /> : <VideoTab />}
                    </div>
                  </>
                }
              />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/category/:categoryName" element={<CategoryNews />} />
            </Routes>
            <Footer />
          </div>
        }
      />
      {/* Login Route */}
      <Route path="/login" element={<Login />} />
      {/* Admin Routes */}
      <Route path="/admin_panel" element={<AdminLayout />}>
        <Route index element={<Index />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="news" element={<News />} />
        <Route path="news/create" element={<NewsCreate />} />
        <Route path="news/edit/:id" element={<NewsCreate />} />
        <Route path="news/featured" element={<NewsFeatured />} />
        <Route path="videos" element={<Videos />} />
        <Route path="videos/live" element={<VideosLive />} />
        <Route path="videos/upload" element={<VideosUpload />} />
        <Route path="categories" element={<Categories />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="analytics/visitors" element={<div className="p-6"><h1 className="text-2xl font-bold">Visitor Analytics</h1><p>Visitor analytics will be implemented here.</p></div>} />
        <Route path="analytics/popular" element={<div className="p-6"><h1 className="text-2xl font-bold">Popular Content</h1><p>Popular content analytics will be implemented here.</p></div>} />
        <Route path="writers" element={<Writers />} />
        <Route path="schedule" element={<div className="p-6"><h1 className="text-2xl font-bold">Content Schedule</h1><p>Content scheduling will be implemented here.</p></div>} />
        <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Admin settings will be implemented here.</p></div>} />
      </Route>
    </Routes>
  );
}

export default App;