import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Clock,
  FileText,
  ImageIcon,
  Calendar,
  Edit,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axios';

interface NewsData {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  category: number | string;
  subcategory: string;
  author: number | string;
  featuredImage: string | null;
  gallery: Array<{ id: number; url: string; alt: string }>;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  isFeatured: boolean;
  isHot: boolean;
  isTrending: boolean;
  isBreaking: boolean;
  publishDate: string;
  publishTime: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  readTime: number;
}

interface Category {
  id: number;
  name: string;
  subcategories: string[];
}

interface Writer {
  id: number;
  name: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NewsEditor = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const featuredImageInputRef = useRef(null);
  const contentImageInputRef = useRef(null);
  const initialFormData = {
    id: undefined,
    title: '',
    excerpt: '',
    content: '',
    category: '',
    subcategory: '',
    author: '',
    featuredImage: null,
    gallery: [],
    tags: [],
    status: 'draft',
    isFeatured: false,
    isHot: false,
    isTrending: false,
    isBreaking: false,
    publishDate: new Date().toISOString().split('T')[0],
    publishTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    readTime: 0,
  };
  const [formData, setFormData] = useState<NewsData>(initialFormData);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [writers, setWriters] = useState<Writer[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<NewsData | null>(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: {
        image: () => {
          if (contentImageInputRef.current) {
            contentImageInputRef.current.click();
          }
        },
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'background',
    'align',
    'script',
  ];

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('check-auth/');
      if (!response.data.isAuthenticated) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error.response?.data || error.message);
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('categories/');
      setCategories(response.data.filter((cat) => cat.isActive));
    } catch (error) {
      toast.error('Failed to fetch categories: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const fetchWriters = async () => {
    try {
      const response = await axiosInstance.get('writers/');
      setWriters(response.data.filter((writer) => writer.status === 'active'));
    } catch (error) {
      toast.error('Failed to fetch writers: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axiosInstance.get('articles/', {
        params: {
          page: currentPage,
          page_size: itemsPerPage,
        },
      });
      setArticles(response.data.results || response.data); // Adjust based on API response structure
    } catch (error) {
      toast.error('Failed to fetch articles: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await checkAuth();
      await Promise.all([fetchCategories(), fetchWriters(), fetchArticles()]);
      setLoading(false);
    };
    initialize();
  }, [currentPage]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (field === 'content' && value) {
      const wordCount = value.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
      const readTime = Math.ceil(wordCount / 200);
      setFormData((prev) => ({ ...prev, readTime: readTime || 1 }));
    }
    if (field === 'category') {
      setFormData((prev) => ({ ...prev, subcategory: '' }));
    }
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axiosInstance.post('upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const relativeUrl = response.data.url;
      const absoluteUrl = encodeURI(`${BASE_URL}${relativeUrl}`);
      if (type === 'featured') {
        setImagePreview(absoluteUrl);
        setFormData((prev) => ({ ...prev, featuredImage: absoluteUrl }));
      } else if (type === 'gallery') {
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, { id: Date.now(), url: absoluteUrl, alt: file.name }],
        }));
      } else if (type === 'content' && editorRef.current) {
        const quill = editorRef.current.getEditor();
        const range = quill.getSelection();
        if (range) {
          quill.insertEmbed(range.index, 'image', absoluteUrl);
        }
      }
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      toast.error('Failed to upload image: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const triggerFileInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeImage = (type, id) => {
    if (type === 'featured') {
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, featuredImage: null }));
    } else {
      setFormData((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((img) => img.id !== id),
      }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (formData.subcategory && formData.category) {
      const selectedCategory = categories.find((cat) => cat.id.toString() === formData.category);
      if (selectedCategory && !selectedCategory.subcategories.includes(formData.subcategory)) {
        newErrors.subcategory = `Subcategory '${formData.subcategory}' is not valid for category '${selectedCategory.name}'`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status) => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await checkAuth();
      const dataToSend = {
        ...formData,
        status,
        category: Number(formData.category),
        author: Number(formData.author),
        featuredImage: formData.featuredImage ? encodeURI(formData.featuredImage) : null,
        gallery: formData.gallery.map((img) => ({ ...img, url: encodeURI(img.url) })),
      };
      let response;
      if (formData?.id) {
        response = await axiosInstance.put(`articles/${formData.id}/`, dataToSend);
      } else {
        response = await axiosInstance.post('articles/', dataToSend);
      }
      toast.success(`News article ${status === 'published' ? 'published' : status === 'scheduled' ? 'scheduled' : 'saved'} successfully!`);
      handleCancel();
      fetchArticles();
    } catch (error) {
      console.error('Article save error:', error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Access denied or session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error(
          'Failed to save article: ' +
            (error.response?.data?.detail || JSON.stringify(error.response?.data) || 'Unknown error')
        );
      }
    }
  };

  const handlePreview = (article) => {
    setPreviewArticle(article || formData);
    setPreviewOpen(true);
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setCurrentTag('');
    setErrors({});
  };

  const handleEdit = (article) => {
    const updatedFormData = {
      id: article.id,
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category.id.toString() || '',
      subcategory: article.subcategory || '',
      author: article.author.id.toString() || '',
      featuredImage: article.featuredImage || null,
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
    setFormData(updatedFormData);
    setImagePreview(article.featuredImage || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePublish = async (articleId) => {
    try {
      const articleResponse = await axiosInstance.get(`articles/${articleId}/`);
      const articleData = articleResponse.data;

      const patchData = {
        status: 'published',
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        category: articleData.category.id,
        author: articleData.author.id,
        subcategory: articleData.subcategory || '',
        featuredImage: articleData.featuredImage || null,
        gallery: articleData.gallery || [],
        tags: articleData.tags || [],
        isFeatured: articleData.isFeatured || false,
        isHot: articleData.isHot || false,
        isTrending: articleData.isTrending || false,
        isBreaking: articleData.isBreaking || false,
        publishDate: articleData.publishDate || new Date().toISOString().split('T')[0],
        publishTime: articleData.publishTime || new Date().toTimeString().split(' ')[0].slice(0, 5),
        seoTitle: articleData.seoTitle || '',
        seoDescription: articleData.seoDescription || '',
        seoKeywords: articleData.seoKeywords || '',
        readTime: articleData.readTime || 0,
      };

      await axiosInstance.patch(`articles/${articleId}/`, patchData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Article published successfully!');
      fetchArticles();
    } catch (error) {
      console.error('Publish error:', error.response?.data || error.message);
      if (error.response?.status === 400) {
        toast.error(
          'Failed to publish article: ' +
            (error.response?.data?.detail || JSON.stringify(error.response?.data) || 'Invalid data')
        );
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Access denied or session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Failed to publish article: ' + (error.response?.data?.detail || 'Unknown error'));
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-background">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-card p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {formData?.id ? 'Edit News Article' : 'Create News Article'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formData?.id ? 'Update your news article' : 'Write and publish a new news article'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => handlePreview(formData)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => handleSave('draft')}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => handleSave('scheduled')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <FileText className="w-4 h-4 mr-2" />
            Publish
          </Button>
          <Button variant="ghost" className="text-muted-foreground" onClick={handleCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Article Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter article title"
                  className={`mt-1 ${errors.title ? 'border-destructive' : ''}`}
                />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
              </div>
              <div>
                <Label htmlFor="excerpt" className="text-sm font-medium">
                  Excerpt *
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief summary of the article"
                  rows={3}
                  className={`mt-1 ${errors.excerpt ? 'border-destructive' : ''}`}
                />
                {errors.excerpt && <p className="text-sm text-destructive mt-1">{errors.excerpt}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Article Content *
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactQuill
                ref={editorRef}
                value={formData.content}
                onChange={(content) => handleInputChange('content', content)}
                placeholder="Write your article content here..."
                theme="snow"
                modules={modules}
                formats={formats}
                className="bg-background"
              />
              {errors.content && <p className="text-sm text-destructive mt-2">{errors.content}</p>}
              {formData.readTime > 0 && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  Estimated read time: {formData.readTime} minutes
                </div>
              )}
              <div className="mt-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'content')}
                  className="hidden"
                  id="content-image-upload"
                  ref={contentImageInputRef}
                />
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => triggerFileInput(contentImageInputRef)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Insert Image in Content
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Featured Image</Label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Featured"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage('featured')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Upload featured image</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'featured')}
                      className="hidden"
                      id="featured-upload"
                      ref={featuredImageInputRef}
                    />
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                      onClick={() => triggerFileInput(featuredImageInputRef)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium">Gallery Images</Label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {formData.gallery.map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0"
                        onClick={() => removeImage('gallery', img.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center h-32">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'gallery')}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <Label htmlFor="gallery-upload" className="cursor-pointer">
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Article Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Featured Article</Label>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Hot News</Label>
                <Switch
                  checked={formData.isHot}
                  onCheckedChange={(checked) => handleInputChange('isHot', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Trending</Label>
                <Switch
                  checked={formData.isTrending}
                  onCheckedChange={(checked) => handleInputChange('isTrending', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Breaking News</Label>
                <Switch
                  checked={formData.isBreaking}
                  onCheckedChange={(checked) => handleInputChange('isBreaking', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.category ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
              </div>
              {formData.category && (
                <div>
                  <Label className="text-sm font-medium">Subcategory</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => handleInputChange('subcategory', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .find((cat) => cat.id.toString() === formData.category)
                        ?.subcategories.map((subcat) => (
                          <SelectItem key={subcat} value={subcat}>
                            {subcat}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Author *</Label>
                <Select
                  value={formData.author}
                  onValueChange={(value) => handleInputChange('author', value)}
                >
                  <SelectTrigger className={`mt-1 ${errors.author ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {writers.map((author) => (
                      <SelectItem key={author.id} value={author.id.toString()}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.author && <p className="text-sm text-destructive mt-1">{errors.author}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="mt-1"
                />
                <Button
                  onClick={addTag}
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Publishing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Publish Date</Label>
                <Input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => handleInputChange('publishDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Publish Time</Label>
                <Input
                  type="time"
                  value={formData.publishTime}
                  onChange={(e) => handleInputChange('publishTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">SEO Title</Label>
                <Input
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="SEO optimized title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Meta Description</Label>
                <Textarea
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="SEO meta description"
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Keywords</Label>
                <Input
                  value={formData.seoKeywords}
                  onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                  placeholder="Comma separated keywords"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Article List with DataTable */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            Existing Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArticles.map((article) => (
                <TableRow key={article.id} className="hover:bg-muted/50">
                  <TableCell>
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        article.status === 'published'
                          ? 'success'
                          : article.status === 'draft'
                          ? 'secondary'
                          : 'warning'
                      }
                    >
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.category.name}</TableCell>
                  <TableCell>{article.author.name}</TableCell>
                  <TableCell>
                    {article.publishDate} {article.publishTime}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary text-primary hover:bg-primary/10"
                        onClick={() => handleEdit(article)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                       
                      </Button>
                      <Dialog open={previewOpen && previewArticle?.id === article.id} onOpenChange={setPreviewOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary text-primary hover:bg-primary/10"
                            onClick={() => handlePreview(article)}
                          >
                            <Eye className="w-4 h-4 mr-2" />

                          </Button>
                        </DialogTrigger>
                        <div className="py-6">
                        <DialogContent className="max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                          <DialogHeader className="pb-4">
                            <DialogTitle className="text-xl font-bold">{previewArticle?.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {previewArticle?.featuredImage && (
                              <img
                                src={previewArticle.featuredImage}
                                alt={previewArticle.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                              />
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Excerpt</h3>
                                <p className="text-sm text-foreground">{previewArticle?.excerpt}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Category</h3>
                                <p className="text-sm text-foreground">
                                  {previewArticle?.category?.name || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Subcategory</h3>
                                <p className="text-sm text-foreground">{previewArticle?.subcategory || 'N/A'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Author</h3>
                                <p className="text-sm text-foreground">
                                  {previewArticle?.author?.name || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Publish Date & Time</h3>
                                <p className="text-sm text-foreground">
                                  {previewArticle?.publishDate} {previewArticle?.publishTime}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Status</h3>
                                <Badge
                                  variant={
                                    previewArticle?.status === 'published'
                                      ? 'success'
                                      : previewArticle?.status === 'draft'
                                      ? 'secondary'
                                      : 'warning'
                                  }
                                >
                                  {previewArticle?.status}
                                </Badge>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Flags</h3>
                                <div className="flex gap-2">
                                  {previewArticle?.isFeatured && <Badge variant="secondary">Featured</Badge>}
                                  {previewArticle?.isHot && <Badge variant="secondary">Hot</Badge>}
                                  {previewArticle?.isTrending && <Badge variant="secondary">Trending</Badge>}
                                  {previewArticle?.isBreaking && <Badge variant="secondary">Breaking</Badge>}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Read Time</h3>
                                <p className="text-sm text-foreground">{previewArticle?.readTime} minutes</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">SEO Title</h3>
                                <p className="text-sm text-foreground">{previewArticle?.seoTitle || 'N/A'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">SEO Description</h3>
                                <p className="text-sm text-foreground">{previewArticle?.seoDescription || 'N/A'}</p>
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">SEO Keywords</h3>
                                <p className="text-sm text-foreground">{previewArticle?.seoKeywords || 'N/A'}</p>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-muted-foreground">Content</h3>
                              <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: previewArticle?.content || '' }}
                              />
                            </div>
                            {previewArticle?.gallery.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold text-muted-foreground">Gallery</h3>
                                <div className="grid grid-cols-4 gap-4 mt-2">
                                  {previewArticle?.gallery.map((img) => (
                                    <img
                                      key={img.id}
                                      src={img.url}
                                      alt={img.alt}
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            <div>
                              <h3 className="text-sm font-semibold text-muted-foreground">Tags</h3>
                              <div className="flex flex-wrap gap-2">
                                {previewArticle?.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                        </div>
                      </Dialog>
                      {article.status !== 'published' && (
                        <Button
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => handlePublish(article.id)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, articles.length)} of {articles.length} articles
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsEditor;