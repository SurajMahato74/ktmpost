import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  TrendingUp,
  MoreHorizontal,
  Users,
  Tag
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsEditor from './NewsEditor';
import WriterManagement from './WriterManagement';
import CategoryManagement from './CategoryManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axios';

interface News {
  id: string;
  title: string;
  category: string;
  author: string;
  status: 'published' | 'draft' | 'scheduled';
  views: string;
  date: string;
  featured: boolean;
  image: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: string[];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const statuses = ['सबै', 'published', 'draft', 'scheduled'];

export function NewsManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('सबै');
  const [selectedStatus, setSelectedStatus] = useState('सबै');
  const [currentView, setCurrentView] = useState('list');
  const [editingNews, setEditingNews] = useState(null);
  const [newsData, setNewsData] = useState<News[]>([]);
  const [categories, setCategories] = useState<string[]>(['सबै']);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    scheduled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchArticles = async () => {
    try {
      const response = await axiosInstance.get('/articles/');
      const articles = response.data.map(article => {
        let imageUrl = '';
        if (article.featuredImage) {
          imageUrl = article.featuredImage.startsWith('http://') || article.featuredImage.startsWith('https://')
            ? article.featuredImage
            : `${BASE_URL}${article.featuredImage}`;
        } else if (article.gallery && article.gallery.length > 0) {
          const firstGallery = article.gallery[0].url;
          imageUrl = firstGallery.startsWith('http://') || firstGallery.startsWith('https://')
            ? firstGallery
            : `${BASE_URL}${firstGallery}`;
        } else {
          imageUrl = 'https://placehold.co/150';
        }

        return {
          id: article.id.toString(),
          title: article.title,
          category: article.category.name,
          author: article.author.name,
          status: article.status,
          views: article.views.toString(),
          date: article.publishDate,
          featured: article.isFeatured,
          image: imageUrl,
        };
      });
      setNewsData(articles);
    } catch (error) {
      console.error('Failed to fetch articles:', error.response?.data || error.message);
      toast.error('Failed to load articles: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories/');
      const activeCategories = response.data
        .filter(cat => cat.isActive)
        .map(cat => cat.name);
      setCategories(['सबै', ...activeCategories]);
    } catch (error) {
      console.error('Failed to fetch categories:', error.response?.data || error.message);
      toast.error('Failed to load categories: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/article-stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error.response?.data || error.message);
      toast.error('Failed to load stats: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const fetchArticleDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/articles/${id}/`);
      const article = response.data;
      console.log('Fetched article details:', article);
      return {
        id: article.id,
        title: article.title || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        category: article.category?.id?.toString() || '',
        subcategory: article.subcategory || '',
        author: article.author?.id?.toString() || '',
        featuredImage: article.featuredImage ? article.featuredImage : null,
        gallery: article.gallery || [],
        tags: article.tags || [],
        status: article.status || 'draft',
        isFeatured: article.isFeatured || false,
        isHot: article.isHot || false,
        isTrending: article.isTrending || false,
        isBreaking: article.isBreaking || false,
        publishDate: article.publishDate || new Date().toISOString().split('T')[0],
        publishTime: article.publishTime || new Date().toTimeString().split(' ')[0].slice(0, 5),
        seoTitle: article.seoTitle || '',
        seoDescription: article.seoDescription || '',
        seoKeywords: article.seoKeywords || '',
        readTime: article.readTime || 0,
      };
    } catch (error) {
      console.error('Failed to fetch article details:', error.response?.data || error.message);
      toast.error('Failed to load article details: ' + (error.response?.data?.detail || 'Unknown error'));
      return null;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([fetchArticles(), fetchCategories(), fetchStats()]);
      setLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    const handleEditNavigation = async () => {
      if (location.pathname.includes('/edit/')) {
        const id = location.pathname.split('/edit/')[1];
        if (id && !editingNews) { // Only fetch if editingNews is not already set
          setIsEditing(true);
          const article = await fetchArticleDetails(id);
          if (article) {
            console.log('Setting editingNews:', article); // Debug log
            setEditingNews(article);
            setCurrentView('edit');
          } else {
            setEditingNews(null);
            navigate('/admin/news');
          }
          setIsEditing(false);
        } else if (editingNews) {
          setCurrentView('edit');
        }
      } else if (location.pathname.includes('/create')) {
        setCurrentView('create');
        setEditingNews(null);
        setIsEditing(false);
      } else if (location.pathname.includes('/writers')) {
        setCurrentView('writers');
        setEditingNews(null);
        setIsEditing(false);
      } else if (location.pathname.includes('/categories')) {
        setCurrentView('categories');
        setEditingNews(null);
        setIsEditing(false);
      } else {
        setCurrentView('list');
        setEditingNews(null);
        setIsEditing(false);
      }
    };
    handleEditNavigation();
  }, [location.pathname, navigate, editingNews]);

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'सबै' || news.category === selectedCategory;
    const matchesStatus = selectedStatus === 'सबै' || news.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-success text-success-foreground">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCreateNews = () => {
    navigate('/admin/news/create');
  };

  const handleEditNews = async (news) => {
    setIsEditing(true);
    const article = await fetchArticleDetails(news.id);
    if (article) {
      console.log('Setting editingNews in handleEditNews:', article); // Debug log
      setEditingNews(article);
      navigate(`/admin/news/edit/${news.id}`);
    } else {
      toast.error('Failed to load article for editing');
    }
    setIsEditing(false);
  };

  const handleDeleteNews = async (id) => {
    try {
      await axiosInstance.delete(`/articles/${id}/`);
      setNewsData(prev => prev.filter(news => news.id !== id));
      await fetchStats();
      toast.success('Article deleted successfully');
    } catch (error) {
      console.error('Failed to delete article:', error.response?.data || error.message);
      toast.error('Failed to delete article: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const handleSaveNews = async (newsData) => {
    try {
      const dataToSend = {
        title: newsData.title,
        excerpt: newsData.excerpt,
        content: newsData.content,
        category: Number(newsData.category),
        subcategory: newsData.subcategory || '',
        author: Number(newsData.author),
        featuredImage: newsData.featuredImage,
        gallery: newsData.gallery,
        tags: newsData.tags,
        status: newsData.status,
        isFeatured: newsData.isFeatured,
        isHot: newsData.isHot,
        isTrending: newsData.isTrending,
        isBreaking: newsData.isBreaking,
        publishDate: newsData.publishDate,
        publishTime: newsData.publishTime,
        seoTitle: newsData.seoTitle,
        seoDescription: newsData.seoDescription,
        seoKeywords: newsData.seoKeywords,
        readTime: newsData.readTime,
      };
      let response;
      if (newsData.id) {
        response = await axiosInstance.put(`/articles/${newsData.id}/`, dataToSend);
      } else {
        response = await axiosInstance.post('/articles/', dataToSend);
      }
      toast.success(`News article ${newsData.status === 'published' ? 'published' : 'saved'} successfully!`);
      await Promise.all([fetchArticles(), fetchStats()]);
      navigate('/admin/news');
    } catch (error) {
      console.error('Article save error:', error.response?.data || error.message);
      toast.error('Failed to save article: ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || 'Unknown error'));
    }
  };

  const handleCancelEdit = () => {
    setEditingNews(null);
    setIsEditing(false);
    navigate('/admin/news');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    switch (view) {
      case 'create':
        navigate('/admin/news/create');
        break;
      case 'writers':
        navigate('/admin/writers');
        break;
      case 'categories':
        navigate('/admin/categories');
        break;
      default:
        navigate('/admin/news');
    }
  };

  if (loading || isEditing) {
    return <div>Loading...</div>;
  }

  if (currentView === 'create') {
    return (
      <NewsEditor 
        onSave={handleSaveNews}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (currentView === 'edit') {
    console.log('Rendering NewsEditor with editingNews:', editingNews); // Debug log
    return (
      <NewsEditor 
        newsData={editingNews || {}}
        onSave={handleSaveNews}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (currentView === 'writers') {
    return <WriterManagement />;
  }

  if (currentView === 'categories') {
    return <CategoryManagement />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News Management</h1>
          <p className="text-muted-foreground">Manage your news articles and content</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleViewChange('writers')} variant="outline">
            <Users className="w-4 h-4 mr-2" />
            लेखकहरू
          </Button>
          <Button onClick={() => handleViewChange('categories')} variant="outline">
            <Tag className="w-4 h-4 mr-2" />
            श्रेणीहरू
          </Button>
          <Button onClick={handleCreateNews} className="bg-gradient-news">
            <Plus className="w-4 h-4 mr-2" />
            नयाँ समाचार थप्नुहोस्
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{stats.drafts}</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg">
                <Edit className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
              <div className="p-2 bg-news-red/10 rounded-lg">
                <Calendar className="w-5 h-5 text-news-red" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles, authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredNews.length})</CardTitle>
          <CardDescription>
            Manage and edit your news articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNews.map((news) => (
                <TableRow key={news.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/150'; }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium line-clamp-1 max-w-[300px]">
                            {news.title}
                          </h4>
                          {news.featured && (
                            <Badge variant="outline" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{news.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      {news.author}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(news.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1 text-muted-foreground" />
                      {news.views}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                      {news.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditNews(news)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteNews(news.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}