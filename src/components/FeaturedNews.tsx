import { Clock, Eye, Play, ArrowRight, Pencil, Pen } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedNews = () => {
  const navigate = useNavigate();
  const [featuredStory, setFeaturedStory] = useState([]);
  const [topSideNews, setTopSideNews] = useState([]);
  const [mainHighlights, setMainHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/articles/`);
        const data = await response.json();

        // Fetch featured articles for the first two columns
        const featuredArticles = data
          .filter(article => article.isFeatured && article.status === 'published')
          .sort((a, b) => {
            const dateA = new Date(`${a.publishDate}T${a.publishTime}`);
            const dateB = new Date(`${b.publishDate}T${b.publishTime}`);
            return dateB - dateA; // Latest first
          });
        const mappedFeaturedStories = featuredArticles.map(article => {
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
            content: article.content,
            reporter: article.author.name,
          };
        });

        // Fetch latest 10 articles for "शीर्ष समाचार"
        const sortedArticles = data.sort((a, b) => {
          const dateA = new Date(`${a.publishDate}T${a.publishTime}`);
          const dateB = new Date(`${b.publishDate}T${b.publishTime}`);
          return dateB - dateA; // Latest first
        });
        const mappedTopSideNews = sortedArticles.slice(0, 10).map(article => {
          const publishDateTime = new Date(`${article.publishDate}T${article.publishTime}`);
          const now = new Date();
          const hoursDiff = Math.floor((now - publishDateTime) / (1000 * 60 * 60));
          const timeString = `${hoursDiff} घण्टा अगाडि`;

          return {
            id: article.id.toString(),
            title: article.title,
            category: article.category.name,
            time: timeString,
          };
        });

        // Fetch latest 3 trending articles for "ट्रेन्डिङ समाचार"
        const trendingArticles = data
          .filter(article => article.isTrending)
          .sort((a, b) => {
            const dateA = new Date(`${a.publishDate}T${a.publishTime}`);
            const dateB = new Date(`${b.publishDate}T${b.publishTime}`);
            return dateB - dateA; // Latest first
          })
          .slice(0, 3);
        const mappedTrendingArticles = trendingArticles.map(article => {
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
          };
        });

        setFeaturedStory(mappedFeaturedStories.slice(0, 3));
        setTopSideNews(mappedTopSideNews);
        setMainHighlights(mappedTrendingArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const videos = [
    {
      id: '10',
      title: "आजको मुख्य समाचार",
      thumbnail: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
      type: "लाइभ",
      viewers: "१२३"
    },
    {
      id: '11',
      title: "राजनीतिक विश्लेषण",
      thumbnail: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
      type: "भिडियो",
      time: "२ घण्टा अगाडि"
    }
  ];

  const handleNewsClick = (story) => {
    navigate(`/news/${story.id}`, { state: { news: story } });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Layout */}
      <div className="lg:hidden mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">विशेष समाचार</h3>
          <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
            थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        <div className="space-y-6">
          {featuredStory.slice(0, 3).map((story, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-4 group cursor-pointer"
              onClick={() => handleNewsClick(story)}
            >
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium rounded">
                    {story.category}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2 mt-2">
                    {story.title}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {story.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {story.time}
                  </div>
                  <div className="flex items-center">
                    <Pencil className="w-3 h-3 mr-1" />
                    {story.views}
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded border border-gray-200">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">शीर्ष समाचार</h3>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
              थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4">
            {topSideNews.slice(0, 10).map((news, index) => (
              <div
                key={index}
                className="group cursor-pointer pb-3 border-b border-gray-100 last:border-0"
                onClick={() => handleNewsClick(news)}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {news.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {news.time}
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-900 leading-tight group-hover:text-red-600 transition-colors mt-1">
                  {news.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout: Three Columns */}
      <div className="hidden lg:grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">विशेष समाचार</h3>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
              थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-12 flex-grow">
            {featuredStory.slice(0, 3).map((story, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => handleNewsClick(story)}
              >
                <div className="space-y-2 h-50 flex flex-col justify-between border-b border-gray-200 pb-4">
                  <div>
                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium rounded">
                      {story.category}
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2 mt-2">
                      {story.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-5">
                    {story.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5 space-y-4 flex flex-col">
          {featuredStory.slice(0, 3).map((story, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => handleNewsClick(story)}
            >
              <div className="relative h-60 overflow-hidden rounded border border-gray-200">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-3 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">शीर्ष समाचार</h3>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
              थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-4 flex-grow">
            {topSideNews.slice(0, 8).map((news, index) => (
              <div
                key={index}
                className="group cursor-pointer pb-3 border-b border-gray-100 last:border-0"
                onClick={() => handleNewsClick(news)}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {news.category}
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {news.time}
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-gray-900 leading-tight group-hover:text-red-600 transition-colors mt-1">
                  {news.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">ट्रेन्डिङ समाचार</h3>
                <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                  थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainHighlights.slice(0, 3).map((news, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer"
                    onClick={() => handleNewsClick(news)}
                  >
                    <div className="relative overflow-hidden mb-4 rounded-lg">
                      {news.image && (
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
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
                          <Pencil className="w-3 h-3 mr-1" />
                          {news.views}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="p-4 border-l-4 border-red-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">लाइव प्रसारण</h3>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                    थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
                <div className="space-y-4">
                  {videos.slice(0, 6).map((video, index) => (
                    <div key={index} className="relative aspect-video bg-black rounded overflow-hidden group">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-red-600 transition-colors">
                          <Play className="w-5 h-5 text-white fill-current" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            video.type === 'लाइव' ? 'bg-red-600' : 'bg-gray-600'
                          } text-white`}
                        >
                          {video.type}
                        </span>
                        <h4 className="text-white font-medium mt-1 line-clamp-1">
                          {video.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-300 mt-1">
                          {video.viewers ? (
                            <>
                              <Pencil className="w-3 h-3 mr-1" />
                              {video.viewers} संपादक
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              {video.time}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNews;