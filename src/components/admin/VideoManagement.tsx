import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Play,
  Upload,
  Users,
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Radio,
  Save,
  X,
  Calendar,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const videoTypes = ['सबै', 'news', 'broadcast', 'interview', 'documentary', 'other'];
const videoStatuses = ['सबै', 'draft', 'published', 'live', 'archived'];

export function VideoManagement() {
  const navigate = useNavigate();
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('सबै');
  const [selectedStatus, setSelectedStatus] = useState('सबै');
  const [videos, setVideos] = useState([]);
  const [videoCategories, setVideoCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCustomVideoOpen, setIsCustomVideoOpen] = useState(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);

  // Initial form data for custom videos
  const initialCustomFormData = {
    id: undefined,
    title: '',
    description: 'Default description',
    video_type: 'news',
    video_file: null,
    thumbnail: null,
    platform: 'custom',
    platform_url: '',
    status: 'draft',
    is_live: false,
    live_start_time: '',
    live_end_time: '',
    category: '',
  };

  // Initial form data for live streams
  const initialLiveFormData = {
    id: undefined,
    title: '',
    description: 'Live stream',
    video_type: 'live',
    video_file: null,
    thumbnail: null,
    platform: 'youtube',
    platform_url: '',
    status: 'live',
    is_live: true,
    live_start_time: new Date().toISOString().slice(0, 16),
    live_end_time: '',
    category: '',
  };

  const [formData, setFormData] = useState(initialCustomFormData);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [errors, setErrors] = useState({});

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
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const fetchVideoCategories = async () => {
    try {
      const response = await axiosInstance.get('video-categories/');
      const activeCategories = response.data.filter((cat) => cat.isActive);
      setVideoCategories(activeCategories);
      // Auto-fill category for custom videos if available
      if (activeCategories.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: activeCategories[0].id.toString() }));
      }
    } catch (error) {
      toast.error('Failed to fetch video categories: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axiosInstance.get('videos/');
      setVideos(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to fetch videos: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await checkAuth();
      await Promise.all([fetchVideoCategories(), fetchVideos()]);
      setLoading(false);
    };
    initialize();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }
    const maxSize = type === 'video_file' ? 500 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`${type === 'video_file' ? 'Video' : 'Thumbnail'} size should be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }
    // Auto-fill title from file name (remove extension)
    if (type === 'video_file' && !formData.title) {
      const fileName = file.name.split('.').slice(0, -1).join('.');
      setFormData((prev) => ({ ...prev, title: fileName }));
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const endpoint = type === 'video_file' ? 'video-upload/' : 'upload/';
      const response = await axiosInstance.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = encodeURI(`${BASE_URL}${response.data.url}`);
      if (type === 'thumbnail') {
        setThumbnailPreview(fileUrl);
        setFormData((prev) => ({ ...prev, thumbnail: fileUrl }));
      } else if (type === 'video_file') {
        setVideoPreview(fileUrl);
        setFormData((prev) => ({ ...prev, video_file: fileUrl }));
      }
      toast.success(`${type === 'video_file' ? 'Video' : 'Thumbnail'} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${type === 'video_file' ? 'video' : 'thumbnail'}: ` + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const triggerFileInput = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = (type) => {
    if (type === 'thumbnail') {
      setThumbnailPreview(null);
      setFormData((prev) => ({ ...prev, thumbnail: null }));
    } else if (type === 'video_file') {
      setVideoPreview(null);
      setFormData((prev) => ({ ...prev, video_file: null }));
    }
  };

  const validateCustomForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.video_file) newErrors.video_file = 'Video file is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLiveForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.platform_url) newErrors.platform_url = 'Platform URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status, isLiveStream = false) => {
    const validate = isLiveStream ? validateLiveForm : validateCustomForm;
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await checkAuth();
      const dataToSend = {
        ...formData,
        status,
        category: formData.category ? Number(formData.category) : null,
        video_file: formData.video_file ? encodeURI(formData.video_file) : null,
        thumbnail: formData.thumbnail ? encodeURI(formData.thumbnail) : null,
      };
      let response;
      if (formData?.id) {
        response = await axiosInstance.put(`videos/${formData.id}/`, dataToSend);
      } else {
        response = await axiosInstance.post('videos/', dataToSend);
      }
      toast.success(`Video ${status === 'published' ? 'published' : status === 'live' ? 'set live' : 'saved'} successfully!`);
      handleCancel(isLiveStream);
      fetchVideos();
      if (isLiveStream) {
        setIsLiveStreamOpen(false);
      } else {
        setIsCustomVideoOpen(false);
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Access denied or session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Failed to save video: ' + (error.response?.data?.detail || JSON.stringify(error.response?.data) || 'Unknown error'));
      }
    }
  };

  const handleLiveToggle = async (videoId, isLive) => {
    try {
      await checkAuth();
      const dataToSend = {
        is_live: !isLive,
        live_start_time: !isLive ? new Date().toISOString() : null,
        status: !isLive ? 'live' : 'archived',
      };
      const response = await axiosInstance.patch(`videos/${videoId}/live/`, dataToSend);
      toast.success(response.data.detail);
      fetchVideos();
    } catch (error) {
      toast.error('Failed to update live status: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await checkAuth();
      await axiosInstance.delete(`videos/${videoId}/`);
      toast.success('Video deleted successfully!');
      fetchVideos();
    } catch (error) {
      toast.error('Failed to delete video: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const handlePreview = (video) => {
    setPreviewVideo(video);
    setPreviewOpen(true);
  };

  const handleEdit = (video) => {
    const updatedFormData = {
      id: video.id,
      title: video.title || '',
      description: video.description || 'Default description',
      video_type: video.video_type || 'news',
      video_file: video.video_file || null,
      thumbnail: video.thumbnail || null,
      platform: video.platform || 'custom',
      platform_url: video.platform_url || '',
      status: video.status || 'draft',
      is_live: video.is_live || false,
      live_start_time: video.live_start_time || '',
      live_end_time: video.live_end_time || '',
      category: video.category?.id?.toString() || (videoCategories[0]?.id?.toString() || ''),
    };
    setFormData(updatedFormData);
    setThumbnailPreview(video.thumbnail || null);
    setVideoPreview(video.video_file || null);
    if (video.video_type === 'live') {
      setIsLiveStreamOpen(true);
    } else {
      setIsCustomVideoOpen(true);
    }
  };

  const handleCancel = (isLiveStream = false) => {
    setFormData(isLiveStream ? initialLiveFormData : initialCustomFormData);
    setThumbnailPreview(null);
    setVideoPreview(null);
    setErrors({});
    if (isLiveStream) {
      setIsLiveStreamOpen(false);
    } else {
      setIsCustomVideoOpen(false);
    }
  };

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'सबै' || video.video_type === selectedType;
    const matchesStatus = selectedStatus === 'सबै' || video.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status, type) => {
    if (type === 'live' && status === 'live') {
      return <Badge className="bg-gradient-news text-white animate-pulse">🔴 LIVE</Badge>;
    }
    switch (status) {
      case 'published':
        return <Badge className="bg-success text-success-foreground">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const liveVideos = filteredVideos.filter((v) => v.video_type === 'live' && v.status === 'live');
  const totalViewers = liveVideos.reduce((sum, video) => sum + (video.views || 0), 0);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Video Management</h1>
          <p className="text-muted-foreground">Manage live streams and recorded videos</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isCustomVideoOpen} onOpenChange={setIsCustomVideoOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Custom Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{formData?.id ? 'Edit Custom Video' : 'Upload Custom Video'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Video className="w-5 h-5 mr-2 text-primary" />
                      Video Details
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
                        placeholder="Enter video title"
                        className={`mt-1 ${errors.title ? 'border-destructive' : ''}`}
                      />
                      {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Brief description of the video"
                        rows={4}
                        className={`mt-1 ${errors.description ? 'border-destructive' : ''}`}
                      />
                      {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Video Type</Label>
                      <Select
                        value={formData.video_type}
                        onValueChange={(value) => handleInputChange('video_type', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select video type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="broadcast">Broadcast</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="documentary">Documentary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Video className="w-5 h-5 mr-2 text-primary" />
                      Video Media
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Video File *</Label>
                      {videoPreview ? (
                        <div className="relative">
                          <video
                            src={videoPreview}
                            controls
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeFile('video_file')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground mb-4">Upload video file</p>
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload(e, 'video_file')}
                            className="hidden"
                            id="video-upload"
                            ref={videoInputRef}
                          />
                          <Button
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary/10"
                            onClick={() => triggerFileInput(videoInputRef)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Video
                          </Button>
                        </div>
                      )}
                      {errors.video_file && <p className="text-sm text-destructive mt-1">{errors.video_file}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Thumbnail</Label>
                      {thumbnailPreview ? (
                        <div className="relative">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeFile('thumbnail')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground mb-4">Upload thumbnail image</p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'thumbnail')}
                            className="hidden"
                            id="thumbnail-upload"
                            ref={thumbnailInputRef}
                          />
                          <Button
                            variant="outline"
                            className="w-full border-primary text-primary hover:bg-primary/10"
                            onClick={() => triggerFileInput(thumbnailInputRef)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Thumbnail
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Video className="w-5 h-5 mr-2 text-primary" />
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
                          {videoCategories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={() => handleSave('draft')}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleSave('published')}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                  <Button variant="ghost" className="text-muted-foreground" onClick={() => handleCancel()}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isLiveStreamOpen} onOpenChange={setIsLiveStreamOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-news">
                <Radio className="w-4 h-4 mr-2" />
                Start Live Stream
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{formData?.id ? 'Edit Live Stream' : 'Start Live Stream'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Video className="w-5 h-5 mr-2 text-primary" />
                      Live Stream Details
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
                        placeholder="Enter live stream title"
                        className={`mt-1 ${errors.title ? 'border-destructive' : ''}`}
                      />
                      {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Platform *</Label>
                      <Select
                        value={formData.platform}
                        onValueChange={(value) => handleInputChange('platform', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Platform URL *</Label>
                      <Input
                        value={formData.platform_url}
                        onChange={(e) => handleInputChange('platform_url', e.target.value)}
                        placeholder="Enter platform URL"
                        className={`mt-1 ${errors.platform_url ? 'border-destructive' : ''}`}
                      />
                      {errors.platform_url && <p className="text-sm text-destructive mt-1">{errors.platform_url}</p>}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleSave('live', true)}
                  >
                    <Radio className="w-4 h-4 mr-2" />
                    Go Live
                  </Button>
                  <Button variant="ghost" className="text-muted-foreground" onClick={() => handleCancel(true)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Streams</p>
                <p className="text-2xl font-bold">{liveVideos.length}</p>
              </div>
              <div className="p-2 bg-news-red/10 rounded-lg">
                <Radio className="w-5 h-5 text-news-red" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Videos</p>
                <p className="text-2xl font-bold">{videos.length}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Video className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live Viewers</p>
                <p className="text-2xl font-bold">{totalViewers.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{videos.reduce((sum, video) => sum + (video.views || 0), 0).toLocaleString()}</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg">
                <Eye className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Streams Section */}
      {liveVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Radio className="w-5 h-5 mr-2 text-news-red" />
              Live Streams ({liveVideos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveVideos.map((video) => (
                <div key={video.id} className="relative group">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-gradient-news text-white animate-pulse">🔴 LIVE</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-white font-medium text-sm line-clamp-2">{video.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center text-white/80 text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {video.views} viewers
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handlePreview(video)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {videoTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {videoStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Videos Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Videos ({filteredVideos.length})</CardTitle>
          <CardDescription>Manage your video content and live streams</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Viewers</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-16 h-12 rounded object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white bg-black/50 rounded-full p-1" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-1 max-w-[300px]">{video.title}</h4>
                        <p className="text-sm text-muted-foreground">{video.category?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{video.video_type}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(video.status, video.video_type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                      {video.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{video.category?.name || 'N/A'}</TableCell>
                  <TableCell>{video.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(video)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Watch
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(video)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {video.video_type === 'live' && video.status === 'live' && (
                          <DropdownMenuItem
                            className="text-news-red"
                            onClick={() => handleLiveToggle(video.id, video.is_live)}
                          >
                            <Radio className="w-4 h-4 mr-2" />
                            End Stream
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(video.id)}>
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

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{previewVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {previewVideo?.thumbnail && (
              <img
                src={previewVideo.thumbnail}
                alt={previewVideo.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            {previewVideo?.video_file && previewVideo?.platform === 'custom' && (
              <video
                src={previewVideo.video_file}
                controls
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            {['youtube', 'facebook'].includes(previewVideo?.platform) && previewVideo?.platform_url && (
              <a
                href={previewVideo.platform_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View on {previewVideo.platform}
              </a>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
                <p className="text-sm text-foreground">{previewVideo?.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Category</h3>
                <p className="text-sm text-foreground">{previewVideo?.category?.name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Uploader</h3>
                <p className="text-sm text-foreground">{previewVideo?.uploader?.name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Video Type</h3>
                <p className="text-sm text-foreground">{previewVideo?.video_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Status</h3>
                <Badge
                  variant={
                    previewVideo?.status === 'published'
                      ? 'success'
                      : previewVideo?.status === 'draft'
                      ? 'secondary'
                      : previewVideo?.status === 'live'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {previewVideo?.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Platform</h3>
                <p className="text-sm text-foreground">{previewVideo?.platform}</p>
              </div>
              {previewVideo?.is_live && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">Live Start Time</h3>
                    <p className="text-sm text-foreground">{previewVideo?.live_start_time}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground">Live End Time</h3>
                    <p className="text-sm text-foreground">{previewVideo?.live_end_time || 'N/A'}</p>
                  </div>
                </>
              )}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground">Views</h3>
                <p className="text-sm text-foreground">{previewVideo?.views}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}