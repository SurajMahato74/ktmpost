import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Eye, ArrowRight, Share2, Heart, MessageSquare, Star } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [sidebarUpdates, setSidebarUpdates] = useState([]);
  const [relatedNewsCards, setRelatedNewsCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [rating, setRating] = useState(0);
  const [likes, setLikes] = useState(0);

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
      views: article.views.toString(),
      content: article.content,
      reporter: article.author.name,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the main article
        const articleResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/articles/${id}/`);
        if (!articleResponse.ok) {
          throw new Error('Article not found');
        }
        const articleData = await articleResponse.json();
        setNews(mapArticle(articleData));

        // Fetch articles for sidebar and related news
        const articlesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/articles/?page=1&page_size=50`);
        const articlesData = await articlesResponse.json();

        // Sidebar updates: Top 10 most recent articles
        const sortedArticles = articlesData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setSidebarUpdates(sortedArticles.slice(0, 10).map(mapArticle));

        // Related news: Up to 4 articles from the same category, excluding the current article
        const relatedArticles = articlesData
          .filter(article => article.category.name === articleData.category.name && article.id !== articleData.id)
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 4);
        setRelatedNewsCards(relatedArticles.map(mapArticle));
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to a default message or redirect if needed
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleShare = async () => {
    if (!news) return;
    const shareData = {
      title: news.title,
      text: news.excerpt || news.content[0],
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      const encodedUrl = encodeURIComponent(window.location.href);
      const encodedTitle = encodeURIComponent(news.title);
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
      window.open(facebookUrl, '_blank');
      window.open(whatsappUrl, '_blank');
      alert('Instagram sharing is not fully supported on web. Please copy the link: ' + window.location.href);
    }
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment,
      replies: [],
      timestamp: new Date().toLocaleTimeString(),
    };

    if (replyTo) {
      setComments(comments.map(c => 
        c.id === replyTo.id 
          ? { ...c, replies: [...c.replies, { ...comment, isReply: true }] } 
          : c
      ));
      setReplyTo(null);
    } else {
      setComments([...comments, comment]);
    }
    setNewComment('');
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
  };

  const handleRate = (star) => {
    setRating(star);
  };

  const handleNewsClick = (story) => {
    navigate(`/news/${story.id}`, { state: { news: story } });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Article not found</h1>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {news.title}
            </h1>
            <div className="relative mb-4">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {news.time}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {news.views} views
              </div>
              <span className="bg-red-600 text-white px-3 py-1 text-xs font-medium rounded">
                {news.category}
              </span>
            </div>
            <div 
              className="text-gray-700 leading-relaxed mb-4 text-justify break-words prose max-w-none"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
            <p className="text-sm text-red-600 mt-4">रिपोर्टर: {news.reporter}</p>
            <div className="flex items-center space-x-4 mt-6">
              <button
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <Share2 className="w-5 h-5 mr-2" />
                सेयर
              </button>
              <button
                onClick={handleLike}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <Heart className={`w-5 h-5 mr-2 ${likes > 0 ? 'fill-red-600 text-red-600' : ''}`} />
                लाइक ({likes})
              </button>
              <button
                onClick={() => document.getElementById('comment-section').scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                कमेन्ट ({comments.length})
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">रेटिंग र रिभ्यू</h3>
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => handleRate(star)}
                  />
                ))}
              </div>
              <div id="comment-section" className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">कमेन्टहरू</h3>
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={replyTo ? `Reply to ${replyTo.text.slice(0, 20)}...` : 'तपाईंको कमेन्ट लेख्नुहोस्...'}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    rows="4"
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    {replyTo && (
                      <button
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className="text-sm text-gray-600 hover:text-red-600"
                      >
                        रद्द गर्नुहोस्
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {replyTo ? 'रिप्लाई पठाउनुहोस्' : 'कमेन्ट पठाउनुहोस्'}
                    </button>
                  </div>
                </form>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-start space-x-2">
                        <div className="flex-1">
                          <p className="text-gray-700">{comment.text}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                            <span>{comment.timestamp}</span>
                            <button
                              onClick={() => handleReply(comment)}
                              className="text-red-600 hover:underline"
                            >
                              रिप्लाई
                            </button>
                          </div>
                          {comment.replies.length > 0 && (
                            <div className="ml-6 mt-2 space-y-2">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="border-l-2 border-gray-300 pl-4">
                                  <p className="text-gray-600">{reply.text}</p>
                                  <div className="text-xs text-gray-500 mt-1">{reply.timestamp}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">शीर्ष समाचार</h3>
              <a href="/" className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="space-y-4 flex-grow">
              {sidebarUpdates.map((news) => (
                <div
                  key={news.id}
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

        <div className="mt-6 bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">अन्य सम्बन्धित समाचार</h3>
            <a href={`/category/${encodeURIComponent(news.category)}`} className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
              थप हेर्नुहोस् <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedNewsCards.map((news) => (
              <div key={news.id} className="group cursor-pointer" onClick={() => handleNewsClick(news)}>
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
      </div>
    </div>
  );
};

export default NewsDetail;