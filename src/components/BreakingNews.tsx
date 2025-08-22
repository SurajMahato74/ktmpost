import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BreakingNews = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/articles/?page=1&page_size=5`);
        const data = await response.json();
        // Sort by updatedAt to get the most recent articles
        const sortedArticles = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching breaking news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

  const handleArticleClick = (article) => {
    const mappedArticle = mapArticle(article);
    navigate(`/news/${mappedArticle.id}`, { state: { news: mappedArticle } });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="flex items-center transform -translate-y-1 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              <AlertCircle className="w-6 h-6 mr-2 text-yellow-300" />
              <span className="font-bold text-base text-yellow-300">ब्रेकिङ</span>
            </div>
            <div className="ml-4 text-sm font-medium">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center transform -translate-y-1 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <AlertCircle className="w-6 h-6 mr-2 text-yellow-300" />
            <span className="font-bold text-base text-yellow-300">ब्रेकिङ</span>
          </div>
          <div className="flex overflow-hidden ml-4">
            <div className="flex animate-marquee whitespace-nowrap">
              {articles.map((article, index) => (
                <button
                  key={index}
                  onClick={() => handleArticleClick(article)}
                  className="mx-8 text-sm font-medium hover:text-yellow-300 transition-colors"
                >
                  {article.title}
                </button>
              ))}
              {articles.map((article, index) => (
                <button
                  key={`duplicate-${index}`}
                  onClick={() => handleArticleClick(article)}
                  className="mx-8 text-sm font-medium hover:text-yellow-300 transition-colors"
                >
                  {article.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 80s linear infinite;
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default BreakingNews;