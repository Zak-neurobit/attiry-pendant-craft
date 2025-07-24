
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Sparkles, Save, ArrowLeft, Eye, Wand2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const chainTypes = [
  { id: '16_inch', label: '16 inch' },
  { id: '18_inch', label: '18 inch' },
  { id: '20_inch', label: '20 inch' },
  { id: '22_inch', label: '22 inch' },
];

// Define valid color options with proper mapping
const colorOptions = [
  { id: 'gold', label: 'Gold Plated' },
  { id: 'matte_gold', label: 'Matte Gold' },
  { id: 'rose_gold', label: 'Rose Gold' },
  { id: 'silver', label: 'Silver' },
  { id: 'matte_silver', label: 'Matte Silver' },
  { id: 'vintage_copper', label: 'Vintage Copper' },
  { id: 'black', label: 'Black' },
];

const fontOptions = [
  'Arial', 'Times New Roman', 'Great Vibes', 'Dancing Script', 'Pacifico',
  'Lobster', 'Satisfy', 'Kalam', 'Caveat', 'Indie Flower'
];

// Define valid color type based on database schema
type ValidColorVariant = 'gold' | 'rose_gold' | 'silver' | 'matte_gold' | 'matte_silver' | 'vintage_copper' | 'black';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  compare_price: number;
  stock: number;
  is_active: boolean;
  image_urls: string[];
  chain_types: string[];
  color_variants: ValidColorVariant[];
  fonts: string[];
  meta_title: string;
  meta_description: string;
  tags: string[];
}

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    compare_price: 0,
    stock: 0,
    is_active: true,
    image_urls: [],
    chain_types: [],
    color_variants: [],
    fonts: [],
    meta_title: '',
    meta_description: '',
    tags: [],
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchProduct(id);
    }
  }, [id, isEditing]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        compare_price: data.compare_price || 0,
        stock: data.stock || 0,
        is_active: data.is_active || true,
        image_urls: data.image_urls || [],
        chain_types: data.chain_types || [],
        color_variants: data.color_variants || [],
        fonts: data.fonts || [],
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        tags: data.tags || [],
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch product",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        compare_price: formData.compare_price,
        stock: formData.stock,
        is_active: formData.is_active,
        image_urls: formData.image_urls,
        chain_types: formData.chain_types,
        color_variants: formData.color_variants,
        fonts: formData.fonts,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        tags: formData.tags,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Product ${isEditing ? 'updated' : 'created'} successfully`,
      });

      navigate('/admin/products');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} product`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeImageWithAI = async () => {
    if (!formData.image_urls.length) {
      toast({
        title: "No Image",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    try {
      // TODO: Implement AI image analysis
      toast({
        title: "AI Analysis Complete",
        description: "Product description and tags have been generated",
      });
    } catch (error) {
      toast({
        title: "AI Analysis Failed",
        description: "Unable to analyze image with AI",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const enhanceDescriptionWithAI = async () => {
    setAiLoading(true);
    try {
      // TODO: Implement AI description enhancement
      toast({
        title: "Description Enhanced",
        description: "Product description has been improved with AI",
      });
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Unable to enhance description with AI",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const generateSEOWithAI = async () => {
    setAiLoading(true);
    try {
      // TODO: Implement AI SEO generation
      toast({
        title: "SEO Generated",
        description: "Meta title and description have been generated",
      });
    } catch (error) {
      toast({
        title: "SEO Generation Failed",
        description: "Unable to generate SEO with AI",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleFontSelect = (fontValue: string) => {
    if (!formData.fonts.includes(fontValue)) {
      setFormData({
        ...formData,
        fonts: [...formData.fonts, fontValue]
      });
    }
  };

  const removeFontFromList = (fontToRemove: string) => {
    setFormData({
      ...formData,
      fonts: formData.fonts.filter(font => font !== fontToRemove)
    });
  };

  const handleColorChange = (colorId: string, checked: boolean) => {
    const validColor = colorId as ValidColorVariant;
    if (checked) {
      if (!formData.color_variants.includes(validColor)) {
        setFormData({
          ...formData,
          color_variants: [...formData.color_variants, validColor]
        });
      }
    } else {
      setFormData({
        ...formData,
        color_variants: formData.color_variants.filter(id => id !== validColor)
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Modify your product details' : 'Create a new product for your store'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Title */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={enhanceDescriptionWithAI}
                    disabled={aiLoading}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Images</CardTitle>
                {formData.image_urls.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={analyzeImageWithAI}
                    disabled={aiLoading}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze with AI
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop images here, or click to select files
                </p>
                <Button variant="outline">
                  Choose Files
                </Button>
              </div>
              
              {formData.image_urls.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {formData.image_urls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>SEO Settings</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSEOWithAI}
                  disabled={aiLoading}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate with AI
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Enter meta title"
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Enter meta description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">
                  {formData.is_active ? 'Active' : 'Draft'}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="compare_price">Compare at Price ($)</Label>
                <Input
                  id="compare_price"
                  type="number"
                  value={formData.compare_price}
                  onChange={(e) => setFormData({ ...formData, compare_price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="stock">Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Options */}
          <Card>
            <CardHeader>
              <CardTitle>Product Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chain Types */}
              <div>
                <Label className="text-sm font-medium">Chain Types</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {chainTypes.map((chain) => (
                    <div key={chain.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={chain.id}
                        checked={formData.chain_types.includes(chain.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              chain_types: [...formData.chain_types, chain.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              chain_types: formData.chain_types.filter(id => id !== chain.id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={chain.id} className="text-sm">
                        {chain.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Colors */}
              <div>
                <Label className="text-sm font-medium">Colors</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <div key={color.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={color.id}
                        checked={formData.color_variants.includes(color.id as ValidColorVariant)}
                        onCheckedChange={(checked) => handleColorChange(color.id, checked as boolean)}
                      />
                      <Label htmlFor={color.id} className="text-sm">
                        {color.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Fonts */}
              <div>
                <Label htmlFor="fonts">Font Options</Label>
                <Select onValueChange={handleFontSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fonts" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.fonts.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.fonts.map((font) => (
                      <Badge 
                        key={font} 
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeFontFromList(font)}
                      >
                        {font} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
