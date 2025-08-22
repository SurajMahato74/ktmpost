import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Hash,
  Eye,
  MoreHorizontal,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axios';

// Define TypeScript interfaces
interface Category {
  id: number;
  name: string;
  nameEnglish: string;
  description: string;
  color: string;
  icon: string;
  subcategories: string[];
  seoTitle: string;
  seoDescription: string;
  isActive: boolean;
  articlesCount: number;
  order: number;
  createdAt: string;
}

const statusOptions = ['सबै', 'सक्रिय', 'निष्क्रिय'];

const CategoryForm: React.FC<{
  category: Category;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
  onSave: () => void;
  onCancel: () => void;
}> = React.memo(({ category, setCategory, onSave, onCancel }) => {
  const [currentSubcategory, setCurrentSubcategory] = useState<string>('');

  const handleInputChange = useCallback(
    (field: keyof Category, value: any) => {
      setCategory((prev) => ({ ...prev, [field]: value }));
    },
    [setCategory]
  );

  const addSubcategory = useCallback(() => {
    if (currentSubcategory.trim() && !category.subcategories.includes(currentSubcategory.trim())) {
      setCategory((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, currentSubcategory.trim()],
      }));
      setCurrentSubcategory('');
    }
  }, [category.subcategories, currentSubcategory, setCategory]);

  const removeSubcategory = useCallback(
    (subcategoryToRemove: string) => {
      setCategory((prev) => ({
        ...prev,
        subcategories: prev.subcategories.filter((sub) => sub !== subcategoryToRemove),
      }));
    },
    [setCategory]
  );

  return (
    <div className="space-y-4" key={category.id || 'new-category'}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">नेपाली नाम *</Label>
          <Input
            id="name"
            value={category.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="राजनीति"
          />
        </div>
        <div>
          <Label htmlFor="nameEnglish">अंग्रेजी नाम *</Label>
          <Input
            id="nameEnglish"
            value={category.nameEnglish}
            onChange={(e) => handleInputChange('nameEnglish', e.target.value)}
            placeholder="Politics"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">विवरण *</Label>
        <Textarea
          id="description"
          value={category.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="श्रेणीको विवरण लेख्नुहोस्"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="color">रङ</Label>
          <Input
            id="color"
            type="color"
            value={category.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="icon">आइकन (Emoji)</Label>
          <Input
            id="icon"
            value={category.icon}
            onChange={(e) => handleInputChange('icon', e.target.value)}
            placeholder="🏛️"
          />
        </div>
      </div>
      <div>
        <Label>उप-श्रेणीहरू</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={currentSubcategory}
            onChange={(e) => setCurrentSubcategory(e.target.value)}
            placeholder="उप-श्रेणी नाम..."
            onKeyPress={(e) => e.key === 'Enter' && addSubcategory()}
          />
          <Button type="button" onClick={addSubcategory} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {category.subcategories.map((sub, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {sub}
              <button
                onClick={() => removeSubcategory(sub)}
                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-1"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="seoTitle">SEO शीर्षक</Label>
          <Input
            id="seoTitle"
            value={category.seoTitle}
            onChange={(e) => handleInputChange('seoTitle', e.target.value)}
            placeholder="राजनीति समाचार - KTMPost"
          />
        </div>
        <div>
          <Label htmlFor="seoDescription">SEO विवरण</Label>
          <Textarea
            id="seoDescription"
            value={category.seoDescription}
            onChange={(e) => handleInputChange('seoDescription', e.target.value)}
            placeholder="SEO को लागि विवरण"
            rows={2}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label>सक्रिय छ</Label>
        <Switch
          checked={category.isActive}
          onCheckedChange={(checked) => handleInputChange('isActive', checked)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          रद्द गर्नुहोस्
        </Button>
        <Button onClick={onSave} className="bg-gradient-news">
          {category.id ? 'अपडेट गर्नुहोस्' : 'थप्नुहोस्'}
        </Button>
      </div>
    </div>
  );
});

const CategoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('सबै');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [newCategory, setNewCategory] = useState<Category>({
    id: 0,
    name: '',
    nameEnglish: '',
    description: '',
    color: '#3B82F6',
    icon: '',
    subcategories: [],
    seoTitle: '',
    seoDescription: '',
    isActive: true,
    articlesCount: 0,
    order: 0,
    createdAt: '',
  });

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get('check-auth/');
      if (!response.data.isAuthenticated) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Auth check failed:', error.response?.data || error.message);
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      await checkAuth();
      const response = await axiosInstance.get<Category[]>('categories/');
      setCategories(response.data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Access denied or session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Failed to fetch categories: ' + (error.response?.data?.detail || 'Unknown error'));
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'सबै' ||
      (selectedStatus === 'सक्रिय' && category.isActive) ||
      (selectedStatus === 'निष्क्रिय' && !category.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.nameEnglish || !newCategory.description) {
      toast.error('कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्।');
      return;
    }
    try {
      await checkAuth();
      const response = await axiosInstance.post<Category>('categories/', newCategory);
      setCategories([...categories, response.data]);
      setNewCategory({
        id: 0,
        name: '',
        nameEnglish: '',
        description: '',
        color: '#3B82F6',
        icon: '',
        subcategories: [],
        seoTitle: '',
        seoDescription: '',
        isActive: true,
        articlesCount: 0,
        order: 0,
        createdAt: '',
      });
      setIsAddDialogOpen(false);
      setIsCollapsibleOpen(false);
      toast.success('नयाँ श्रेणी सफलतापूर्वक थप गरियो!');
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Access denied or session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Failed to add category: ' + (error.response?.data?.detail || 'Unknown error'));
      }
      console.error(error);
    }
  };

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory({
      ...category,
      subcategories: Array.isArray(category.subcategories) ? category.subcategories : [],
    });
  }, []);

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try {
      await checkAuth();
      const response = await axiosInstance.put<Category>(`categories/${editingCategory.id}/`, editingCategory);
      setCategories(categories.map((c) => (c.id === editingCategory.id ? response.data : c)));
      setEditingCategory(null);
      toast.success('श्रेणीको जानकारी अपडेट गरियो!');
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Access denied or session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error('Failed to update category: ' + (error.response?.data?.detail || 'Unknown error'));
      }
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await checkAuth();
      await axiosInstance.delete(`categories/${id}/`);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success('श्रेणी हटाइयो!');
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Access denied or session expired. Please log in again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to delete category: Unknown error');
      }
      console.error(error);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-success text-success-foreground">सक्रिय</Badge>
    ) : (
      <Badge variant="secondary">निष्क्रिय</Badge>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">श्रेणी व्यवस्थापन</h1>
          <p className="text-muted-foreground">समाचारका श्रेणीहरूको व्यवस्थापन गर्नुहोस्</p>
        </div>
        <Collapsible
          open={isCollapsibleOpen}
          onOpenChange={(open) => {
            setIsCollapsibleOpen(open);
            setIsAddDialogOpen(open);
          }}
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {isCollapsibleOpen ? 'श्रेणी थप्ने फारम बन्द गर्नुहोस्' : 'श्रेणी थप्ने फारम खोल्नुहोस्'}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-news mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  नयाँ श्रेणी थप्नुहोस्
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>नयाँ श्रेणी थप्नुहोस्</DialogTitle>
                  <DialogDescription>नयाँ समाचार श्रेणीको विवरण भर्नुहोस्</DialogDescription>
                </DialogHeader>
                <CategoryForm
                  category={newCategory}
                  setCategory={setNewCategory}
                  onSave={handleAddCategory}
                  onCancel={() => {
                    setIsAddDialogOpen(false);
                    setIsCollapsibleOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </CollapsibleContent>
        </Collapsible>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">कुल श्रेणीहरू</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Tag className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">सक्रिय श्रेणीहरू</p>
                <p className="text-2xl font-bold">{categories.filter((c) => c.isActive).length}</p>
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
                <p className="text-sm text-muted-foreground">कुल लेखहरू</p>
                <p className="text-2xl font-bold">{categories.reduce((sum, c) => sum + c.articlesCount, 0)}</p>
              </div>
              <div className="p-2 bg-news-red/10 rounded-lg">
                <Edit className="w-5 h-5 text-news-red" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">उप-श्रेणीहरू</p>
                <p className="text-2xl font-bold">{categories.reduce((sum, c) => sum + c.subcategories.length, 0)}</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-lg">
                <Hash className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="श्रेणी खोज्नुहोस्..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="स्थिति" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>श्रेणीहरूको सूची ({filteredCategories.length})</CardTitle>
          <CardDescription>तपाईंका सबै समाचार श्रेणीहरूको विवरण</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>श्रेणी</TableHead>
                <TableHead>विवरण</TableHead>
                <TableHead>उप-श्रेणीहरू</TableHead>
                <TableHead>लेखहरू</TableHead>
                <TableHead>स्थिति</TableHead>
                <TableHead>कार्यहरू</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-sm text-muted-foreground">{category.nameEnglish}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm line-clamp-2">{category.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 2).map((sub, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                      {category.subcategories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.subcategories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Edit className="w-4 h-4 mr-1 text-muted-foreground" />
                      {category.articlesCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(category.isActive)}
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={async () => {
                          try {
                            await checkAuth();
                            const updatedCategory = { ...category, isActive: !category.isActive };
                            await axiosInstance.put(`categories/${category.id}/`, updatedCategory);
                            setCategories(categories.map((c) => (c.id === category.id ? updatedCategory : c)));
                            toast.success('श्रेणीको स्थिति परिवर्तन गरियो!');
                          } catch (error: any) {
                            toast.error('Failed to update status: ' + (error.response?.data?.detail || 'Unknown error'));
                          }
                        }}
                      />
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
                        <DropdownMenuItem onClick={() => console.log('View category')}>
                          <Eye className="w-4 h-4 mr-2" />
                          विवरण हेर्नुहोस्
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Edit className="w-4 h-4 mr-2" />
                          सम्पादन गर्नुहोस्
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          हटाउनुहोस्
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
      {/* Edit Category Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>श्रेणी सम्पादन गर्नुहोस्</DialogTitle>
              <DialogDescription>श्रेणीको जानकारी अपडेट गर्नुहोस्</DialogDescription>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              setCategory={setEditingCategory}
              onSave={handleUpdateCategory}
              onCancel={() => setEditingCategory(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CategoryManagement;