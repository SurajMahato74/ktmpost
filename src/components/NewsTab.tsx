import React, { useState, useEffect, useRef } from 'react'; // Add useRef to imports
import { Clock, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import verticalad from '../asstes/img/verticalad.mp4';

const NewsTab = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const relatedNewsRef = useRef(null); // Define the ref

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories/`);
        const categoriesData = await categoriesResponse.json();
        setCategories([{ id: 0, name: 'All', active: true }, ...categoriesData.map(cat => ({ ...cat, active: false }))]);

        // Fetch articles
        const articlesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/articles/?page=1&page_size=50`);
        const articlesData = await articlesResponse.json();
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update active category
  const handleCategoryClick = (categoryName) => {
    setCategories(categories.map(cat => ({
      ...cat,
      active: cat.name === categoryName
    })));
    setSelectedCategory(categoryName);
  };

  // Map article data to the required format
  const mapArticle = (article) => {
    if (!article) return null;
    const publishDateTime = new Date(`${article.publishDate}T${article.publishTime}`);
    const now = new Date();
    const hoursDiff = Math.floor((now - publishDateTime) / (1000 * 60 * 60));
    const timeString = `${hoursDiff} घण्टा अगाडि`;

    return {
      id: article.id.toString(),
      title: article.title,
      excerpt: article.excerpt,
      image: article.featuredImage,
      category: article.category.name,
      time: timeString,
      views: article.author.name,
      content: article.content.split('\n').filter(p => p.trim()),
      reporter: article.author.name,
    };
  };

  // Get featured article (most recent overall or by selected category)
  const getFeaturedArticle = () => {
    if (!articles.length) return null;
    const sortedArticles = articles.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    if (selectedCategory === 'All') {
      return sortedArticles[0];
    }
    return sortedArticles.find(article => article.category.name === selectedCategory) || null;
  };

  // Get related articles (same category as featured article, up to 20)
  const getRelatedArticles = (featuredArticle) => {
    if (!featuredArticle) return [];
    return articles
      .filter(article => article.category.name === featuredArticle.category.name && article.id !== featuredArticle.id)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 20);
  };

  // Get main news articles (all or by selected category, up to 15 for 5 rows)
  const getMainNewsArticles = () => {
    let filteredArticles = articles;
    if (selectedCategory !== 'All') {
      filteredArticles = articles.filter(article => article.category.name === selectedCategory);
    }
    return filteredArticles
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 15);
  };

  // Get latest news articles (all or by selected category, up to 21)
  const getLatestNewsArticles = () => {
    let filteredArticles = articles;
    if (selectedCategory !== 'All') {
      filteredArticles = articles.filter(article => article.category.name === selectedCategory);
    }
    return filteredArticles
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 21);
  };

  const featuredArticle = mapArticle(getFeaturedArticle());
  const relatedArticles = getRelatedArticles(getFeaturedArticle()).map(mapArticle);
  const mainNewsArticles = getMainNewsArticles().map(mapArticle);
  const latestNewsArticles = getLatestNewsArticles().map(mapArticle);

  // Logic to determine whether to show the ad (example: show if there are enough related articles)
  const showRelatedAd = relatedArticles.length > 10; // Adjust this condition as needed

  const handleNewsClick = (story) => {
    navigate(`/news/${story.id}`, { state: { news: story } });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                className={`px-4 py-2 font-medium transition-all ${
                  category.active
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Page Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Main News and Vertical Ad Banner */}
          <div className="lg:col-span-2">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main News Section (70% width) */}
              {featuredArticle && (
                <div className="bg-white p-6 lg:w-[70%]">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuredArticle.title}
                  </h2>
                  <div className="relative mb-4">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-80 aspect-square object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed line-clamp-7 text-justify">
                    {featuredArticle.content}
                  </p>
                  <p className="text-sm text-red-600 mt-2">रिपोर्टर: {featuredArticle.reporter}</p>
                </div>
              )}
              {/* Vertical Ad Banner (30% width) */}
              <div className="hidden lg:block lg:w-[30%] mt-12">
                {/* Hidden on small screens, visible on large screens */}
                {mainNewsArticles.length > 9 && (
                  <div className="mt-6">
                    <video
                      src={verticalad}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-100 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Additional News Section (मुख्य समाचार) */}
            {mainNewsArticles.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">मुख्य समाचार</h3>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                    थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mainNewsArticles.slice(0, 9).map((news, index) => (
                    <div key={index} className="group cursor-pointer" onClick={() => handleNewsClick(news)}>
                      <div className="relative overflow-hidden mb-4 rounded-lg">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium rounded">
                            {news.category}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {news.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {news.time}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {news.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Horizontal Ad Banner after 3rd column (9 articles) */}
                {mainNewsArticles.length > 9 && (
                  <div className="mt-6">
                    <img
                      src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
                      alt="Horizontal Ad"
                      className="w-full h-32 object-cover border-none rounded-lg"
                    />
                  </div>
                )}
                {/* Continue with remaining articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {mainNewsArticles.slice(9).map((news, index) => (
                    <div key={index} className="group cursor-pointer" onClick={() => handleNewsClick(news)}>
                      <div className="relative overflow-hidden mb-4 rounded-lg">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium rounded">
                            {news.category}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {news.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {news.time}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {news.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Related News (सम्बन्धित समाचार) */}
          {relatedArticles.length > 0 && (
            <div className="bg-white p-6" ref={relatedNewsRef}>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  सम्बन्धित समाचार
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent ml-4"></div>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {relatedArticles.map((update, index) => (
                  <div key={index} className="flex flex-col cursor-pointer group" onClick={() => handleNewsClick(update)}>
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2">
                      <img
                        src={update.image}
                        alt={update.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                      {update.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {update.time}
                    </div>
                  </div>
                ))}
              </div>
              {/* Conditional Ad Box based on height */}
              {showRelatedAd && (
                <div className="mt-6">
                  <video
                    src={verticalad}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-100 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* News List (ताजा समाचार) */}
        {latestNewsArticles.length > 0 && (
          <div className="bg-white border-t-4 border-red-600 p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                ताजा समाचार
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent ml-4"></div>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestNewsArticles.map((news, index) => (
                <div
                  key={index}
                  className="group cursor-pointer py-3 border-b border-gray-100 hover:border-red-200 transition-colors"
                  onClick={() => handleNewsClick(news)}
                >
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors leading-relaxed">
                        {news.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {news.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-md">
                थप समाचार हेर्नुहोस्
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsTab;