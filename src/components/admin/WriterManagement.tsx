  import React, { useState, useEffect, useCallback } from 'react';
  import {
    Plus,
    Search,
    Edit,
    Trash2,
    Mail,
    Phone,
    User,
    Building,
    Award,
    Eye,
    MoreHorizontal,
  } from 'lucide-react';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import { Badge } from '@/components/ui/badge';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  import { toast } from 'sonner';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
  import { useNavigate } from 'react-router-dom';
  import axiosInstance from '@/utils/axios'; // Import shared axios instance

  // Define TypeScript interfaces
  interface SocialLinks {
    twitter: string;
    linkedin: string;
    instagram: string;
  }

  interface Writer {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    expertise: string[] | string;
    bio: string;
    location: string;
    social_links: SocialLinks;
    avatar: string;
    join_date: string;
    articles_count: number;
    status: 'active' | 'inactive';
  }

  const roles = ['सबै', 'वरिष्ठ संवाददाता', 'संवाददाता', 'फोटो पत्रकार', 'स्तम्भकार', 'संपादक'];
  const departments = ['राजनीति', 'अर्थतन्त्र', 'खेलकुद', 'मनोरञ्जन', 'प्रविधि', 'स्वास्थ्य', 'शिक्षा', 'फोटो जर्नलिज्म'];
  const expertiseOptions = [
    'राजनीति',
    'अर्थतन्त्र',
    'खेलकुद',
    'मनोरञ्जन',
    'प्रविधि',
    'स्वास्थ्य',
    'शिक्षा',
    'सामाजिक मुद्दा',
    'व्यापार',
    'बैंकिङ',
    'फोटोग्राफी',
    'भिडियो',
    'फुटबल',
    'क्रिकेट',
  ];

  const WriterForm: React.FC<{
    writer: Writer;
    setWriter: React.Dispatch<React.SetStateAction<Writer>>;
    onSave: () => void;
    onCancel: () => void;
  }> = React.memo(({ writer, setWriter, onSave, onCancel }) => {
    const handleInputChange = useCallback(
      (field: keyof Writer, value: string) => {
        setWriter((prev) => ({ ...prev, [field]: value }));
      },
      [setWriter]
    );

    const handleSocialLinkChange = useCallback(
      (platform: keyof SocialLinks, value: string) => {
        setWriter((prev) => ({
          ...prev,
          social_links: { ...prev.social_links, [platform]: value },
        }));
      },
      [setWriter]
    );

    const handleExpertiseChange = useCallback(
      (value: string | string[]) => {
        setWriter((prev) => ({ ...prev, expertise: Array.isArray(value) ? value : [value] }));
      },
      [setWriter]
    );

    return (
      <div className="space-y-4" key={writer.id || 'new-writer'}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">पूरा नाम *</Label>
            <Input
              id="name"
              value={writer.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="लेखकको पूरा नाम"
            />
          </div>
          <div>
            <Label htmlFor="email">इमेल *</Label>
            <Input
              id="email"
              type="email"
              value={writer.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">फोन नम्बर</Label>
            <Input
              id="phone"
              value={writer.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+977-9XXXXXXXXX"
            />
          </div>
          <div>
            <Label htmlFor="location">स्थान</Label>
            <Input
              id="location"
              value={writer.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="काठमाडौं"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>भूमिका *</Label>
            <Select value={writer.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="भूमिका छान्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                {roles
                  .filter((r) => r !== 'सबै')
                  .map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>विभाग *</Label>
            <Select value={writer.department} onValueChange={(value) => handleInputChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="विभाग छान्नुहोस्" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="expertise">विशेषज्ञता</Label>
          <Select
            value={Array.isArray(writer.expertise) ? writer.expertise : [writer.expertise]}
            onValueChange={handleExpertiseChange}
            // Note: Ensure your Select component supports multiple selections
          >
            <SelectTrigger>
              <SelectValue placeholder="विशेषज्ञता छान्नुहोस्" />
            </SelectTrigger>
            <SelectContent>
              {expertiseOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="bio">परिचय</Label>
          <Textarea
            id="bio"
            value={writer.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="लेखकको छोटो परिचय"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>सामाजिक सञ्जाल</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Twitter"
              value={writer.social_links.twitter || ''}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
            />
            <Input
              placeholder="LinkedIn"
              value={writer.social_links.linkedin || ''}
              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
            />
            <Input
              placeholder="Instagram"
              value={writer.social_links.instagram || ''}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            रद्द गर्नुहोस्
          </Button>
          <Button onClick={onSave} className="bg-gradient-news">
            {writer.id ? 'अपडेट गर्नुहोस्' : 'थप्नुहोस्'}
          </Button>
        </div>
      </div>
    );
  });

  const WriterManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('सबै');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
    const [editingWriter, setEditingWriter] = useState<Writer | null>(null);
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(false);
    const [writers, setWriters] = useState<Writer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [newWriter, setNewWriter] = useState<Writer>({
      id: 0,
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      expertise: [],
      bio: '',
      location: '',
      social_links: {
        twitter: '',
        linkedin: '',
        instagram: '',
      },
      avatar: '',
      join_date: '',
      articles_count: 0,
      status: 'active',
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

    const fetchWriters = async () => {
      try {
        setLoading(true);
        await checkAuth();
        const response = await axiosInstance.get<Writer[]>('writers/');
        setWriters(
          response.data.map((writer) => ({
            ...writer,
            expertise: Array.isArray(writer.expertise) ? writer.expertise : [writer.expertise],
          }))
        );
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Access denied or session expired. Please log in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          toast.error('Failed to fetch writers: ' + (error.response?.data?.detail || 'Unknown error'));
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchWriters();
    }, []);

    const filteredWriters = writers.filter((writer) => {
      const matchesSearch =
        writer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        writer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        writer.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'सबै' || writer.role === selectedRole;
      return matchesSearch && matchesRole;
    });

    const handleAddWriter = async () => {
      if (!newWriter.name || !newWriter.email || !newWriter.role || !newWriter.department) {
        toast.error('कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्।');
        return;
      }
      try {
        await checkAuth();
        const response = await axiosInstance.post<Writer>('writers/', newWriter);
        setWriters([
          ...writers,
          { ...response.data, expertise: Array.isArray(response.data.expertise) ? response.data.expertise : [response.data.expertise] },
        ]);
        setNewWriter({
          id: 0,
          name: '',
          email: '',
          phone: '',
          role: '',
          department: '',
          expertise: [],
          bio: '',
          location: '',
          social_links: { twitter: '', linkedin: '', instagram: '' },
          avatar: '',
          join_date: '',
          articles_count: 0,
          status: 'active',
        });
        setIsAddDialogOpen(false);
        toast.success('नयाँ लेखक सफलतापूर्वक थप गरियो!');
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Access denied or session expired. Please log in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          toast.error('Failed to add writer: ' + (error.response?.data?.detail || 'Unknown error'));
        }
        console.error(error);
      }
    };

    const handleEditWriter = useCallback((writer: Writer) => {
      setEditingWriter({
        ...writer,
        social_links: writer.social_links || { twitter: '', linkedin: '', instagram: '' },
        expertise: Array.isArray(writer.expertise) ? writer.expertise : [writer.expertise],
      });
    }, []);

    const handleUpdateWriter = async () => {
      if (!editingWriter) return;
      try {
        await checkAuth();
        const response = await axiosInstance.put<Writer>(`writers/${editingWriter.id}/`, editingWriter);
        setWriters(
          writers.map((w) =>
            w.id === editingWriter.id
              ? { ...response.data, expertise: Array.isArray(response.data.expertise) ? response.data.expertise : [response.data.expertise] }
              : w
          )
        );
        setEditingWriter(null);
        toast.success('लेखकको जानकारी अपडेट गरियो!');
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Access denied or session expired. Please log in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          toast.error('Failed to update writer: ' + (error.response?.data?.detail || 'Unknown error'));
        }
        console.error(error);
      }
    };

    const handleDeleteWriter = async (id: number) => {
      try {
        await checkAuth();
        await axiosInstance.delete(`writers/${id}/`);
        setWriters(writers.filter((w) => w.id !== id));
        toast.success('लेखक हटाइयो!');
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Access denied or session expired. Please log in again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          toast.error('Failed to delete writer: ' + (error.response?.data?.detail || 'Unknown error'));
        }
        console.error(error);
      }
    };

    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'active':
          return <Badge className="bg-success text-success-foreground">सक्रिय</Badge>;
        case 'inactive':
          return <Badge variant="secondary">निष्क्रिय</Badge>;
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">लेखक व्यवस्थापन</h1>
            <p className="text-muted-foreground">आफ्ना लेखकहरूको व्यवस्थापन गर्नुहोस्</p>
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
                {isCollapsibleOpen ? 'लेखक थप्ने फारम बन्द गर्नुहोस्' : 'लेखक थप्ने फारम खोल्नुहोस्'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-news mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    नयाँ लेखक थप्नुहोस्
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>नयाँ लेखक थप्नुहोस्</DialogTitle>
                    <DialogDescription>नयाँ लेखकको विवरण भर्नुहोस्</DialogDescription>
                  </DialogHeader>
                  <WriterForm
                    writer={newWriter}
                    setWriter={setNewWriter}
                    onSave={handleAddWriter}
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
                  <p className="text-sm text-muted-foreground">कुल लेखकहरू</p>
                  <p className="text-2xl font-bold">{writers.length}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">सक्रिय लेखकहरू</p>
                  <p className="text-2xl font-bold">{writers.filter((w) => w.status === 'active').length}</p>
                </div>
                <div className="p-2 bg-success/10 rounded-lg">
                  <Award className="w-5 h-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">कुल लेखहरू</p>
                  <p className="text-2xl font-bold">{writers.reduce((sum, w) => sum + w.articles_count, 0)}</p>
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
                  <p className="text-sm text-muted-foreground">विभागहरू</p>
                  <p className="text-2xl font-bold">{new Set(writers.map((w) => w.department)).size}</p>
                </div>
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Building className="w-5 h-5 text-warning" />
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
                    placeholder="लेखक, इमेल वा विभाग खोज्नुहोस्..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="भूमिका" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {/* Writers Table */}
        <Card>
          <CardHeader>
            <CardTitle>लेखकहरूको सूची ({filteredWriters.length})</CardTitle>
            <CardDescription>तपाईंका सबै लेखकहरूको विवरण</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>लेखक</TableHead>
                  <TableHead>भूमिका</TableHead>
                  <TableHead>विभाग</TableHead>
                  <TableHead>लेखहरू</TableHead>
                  <TableHead>स्थिति</TableHead>
                  <TableHead>कार्यहरू</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWriters.map((writer) => (
                  <TableRow key={writer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={writer.avatar} alt={writer.name} />
                          <AvatarFallback>{writer.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{writer.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {writer.email}
                          </div>
                          {writer.phone && (
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {writer.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{writer.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                        {writer.department}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Edit className="w-4 h-4 mr-1 text-muted-foreground" />
                        {writer.articles_count}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(writer.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => console.log('View profile')}>
                            <Eye className="w-4 h-4 mr-2" />
                            प्रोफाइल हेर्नुहोस्
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditWriter(writer)}>
                            <Edit className="w-4 h-4 mr-2" />
                            सम्पादन गर्नुहोस्
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteWriter(writer.id)}>
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
        {/* Edit Writer Dialog */}
        {editingWriter && (
          <Dialog open={!!editingWriter} onOpenChange={() => setEditingWriter(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>लेखक सम्पादन गर्नुहोस्</DialogTitle>
                <DialogDescription>लेखकको जानकारी अपडेट गर्नुहोस्</DialogDescription>
              </DialogHeader>
              <WriterForm
                writer={editingWriter}
                setWriter={setEditingWriter}
                onSave={handleUpdateWriter}
                onCancel={() => setEditingWriter(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  export default WriterManagement;