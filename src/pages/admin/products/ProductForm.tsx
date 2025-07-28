
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { ArrowLeft, Sparkles, Eye, Tag, Save, X, Star } from 'lucide-react';
import { defaultModel } from '@/services/openai';

type ColorVariant = 'gold' | 'silver' | 'black' | 'rose_gold' | 'matte_gold' | 'matte_silver' | 'vintage_copper';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  compare_price: number;
  stock: number;
  sku: string;
  is_active: boolean;
  is_featured: boolean;
  featured_order: number;
  image_urls: string[];
  color_variants: ColorVariant[];
  chain_types: string[];
  fonts: string[];
  meta_title: string;
  meta_description: string;
  keywords: string[];
  tags: string[];
  cogs: number;
}

const defaultFormData: ProductFormData = {
  title: '',
  description: '',
  price: 0,
  compare_price: 0,
  stock: 0,
  sku: '',
  is_active: true,
  is_featured: false,
  featured_order: 0,
  image_urls: [],
  color_variants: ['gold'],
  chain_types: [],
  fonts: ['Great Vibes'],
  meta_title: '',
  meta_description: '',
  keywords: [],
  tags: [],
  cogs: 0,
};

export const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [aiLoading, setAiLoading] = useState({ description: false, metadata: false, image: false, generateAll: false });
  const { toast } = useToast();
  const { refetch } = useProducts();

  useEffect(() => {
    if (isEditing && id) {
      loadProduct(id);
    }
  }, [isEditing, id]);

  const loadProduct = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || 0,
        compare_price: data.compare_price || 0,
        stock: data.stock || 0,
        sku: data.sku || '',
        is_active: data.is_active || true,
        is_featured: data.is_featured || false,
        featured_order: data.featured_order || 0,
        image_urls: data.image_urls || [],
        color_variants: (data.color_variants || ['gold']) as ColorVariant[],
        chain_types: data.chain_types || [],
        fonts: data.fonts || [],
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        keywords: data.keywords || [],
        tags: data.tags || [],
        cogs: data.cogs || 0,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        
        // Clear cache to show updated data immediately
        refetch();
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert(formData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product created successfully",
        });
        
        // Clear cache to show new product immediately
        refetch();
      }

      navigate('/admin/products');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageAnalysis = async () => {
    if (formData.image_urls.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload at least one image to analyze",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(prev => ({ ...prev, image: true }));
    try {
      const { data, error } = await supabase.functions.invoke('ai-analyze-image', {
        body: { 
          imageUrl: formData.image_urls[0],
          title: formData.title,
          colors: formData.color_variants,
          chainTypes: formData.chain_types,
          productContext: formData.description ? `Existing description: ${formData.description}` : ''
        }
      });

      if (error) throw error;

      // Update form with comprehensive AI suggestions
      setFormData(prev => ({
        ...prev,
        description: data.description || prev.description,
        meta_title: data.metaTitle || prev.meta_title,
        meta_description: data.metaDescription || prev.meta_description,
        tags: [...new Set([...prev.tags, ...(data.tags || [])])],
        keywords: [...new Set([...prev.keywords, ...(data.keywords || [])])],
        // Update title if AI suggests a better one and current title is generic
        title: (data.suggestedTitle && (!prev.title || prev.title.length < 10)) ? data.suggestedTitle : prev.title,
      }));

      toast({
        title: "Analysis Complete",
        description: "Product information updated with AI insights including SEO metadata",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setAiLoading(prev => ({ ...prev, image: false }));
    }
  };

  const enhanceDescription = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a product title first",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(prev => ({ ...prev, description: true }));
    try {
      const { data, error } = await supabase.functions.invoke('ai-generate-description', {
        body: {
          currentDescription: formData.description,
          productTitle: formData.title,
          productType: 'jewelry',
          model: defaultModel
        }
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        description: data.description || prev.description,
      }));

      toast({
        title: "Description Enhanced",
        description: "Product description has been improved with AI",
      });
    } catch (error: any) {
      toast({
        title: "Enhancement Failed",
        description: error.message || "Failed to enhance description",
        variant: "destructive",
      });
    } finally {
      setAiLoading(prev => ({ ...prev, description: false }));
    }
  };

  const generateMetadata = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a product title first",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(prev => ({ ...prev, metadata: true }));
    try {
      const { data, error } = await supabase.functions.invoke('ai-generate-metadata', {
        body: {
          productTitle: formData.title,
          description: formData.description,
          category: 'jewelry',
          model: defaultModel
        }
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        meta_title: data.metaTitle || prev.meta_title,
        meta_description: data.metaDescription || prev.meta_description,
        tags: [...new Set([...prev.tags, ...(data.tags || [])])],
        keywords: [...new Set([...prev.keywords, ...(data.tags || [])])],
      }));

      toast({
        title: "Metadata Generated",
        description: "SEO metadata has been created with AI",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate metadata",
        variant: "destructive",
      });
    } finally {
      setAiLoading(prev => ({ ...prev, metadata: false }));
    }
  };

  const handleGenerateAll = async () => {
    if (formData.image_urls.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload at least one image to start AI generation",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a product title first",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(prev => ({ ...prev, generateAll: true }));
    try {
      // First analyze the image with full context
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('ai-analyze-image', {
        body: { 
          imageUrl: formData.image_urls[0],
          title: formData.title,
          colors: formData.color_variants,
          chainTypes: formData.chain_types,
          productContext: formData.description ? `Existing description: ${formData.description}` : ''
        }
      });

      if (analysisError) throw analysisError;

      // Update form with all AI-generated content
      setFormData(prev => ({
        ...prev,
        description: analysisData.description || prev.description,
        meta_title: analysisData.metaTitle || prev.meta_title,
        meta_description: analysisData.metaDescription || prev.meta_description,
        tags: [...new Set([...prev.tags, ...(analysisData.tags || [])])],
        keywords: [...new Set([...prev.keywords, ...(analysisData.keywords || [])])],
      }));

      toast({
        title: "AI Generation Complete",
        description: "All product fields have been enhanced with AI-generated content",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setAiLoading(prev => ({ ...prev, generateAll: false }));
    }
  };

  return (
    <div className="space-y-6" id="product-form-page">
      {/* Header */}
      <div className="flex items-center gap-4" id="product-form-header">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')} id="back-button">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div id="header-content">
          <h1 className="text-3xl font-bold font-cormorant" id="form-title">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-muted-foreground" id="form-description">
            {isEditing ? 'Update product information' : 'Create a new jewelry product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" id="product-form">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="form-grid">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6" id="main-content">
            {/* Basic Information */}
            <Card id="basic-info-card">
              <CardHeader id="basic-info-header">
                <CardTitle id="basic-info-title">Product Information</CardTitle>
                <CardDescription id="basic-info-description">
                  Basic details about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" id="basic-info-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="title-sku-grid">
                  <div className="space-y-2" id="title-input">
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Custom Gold Name Pendant"
                      required
                    />
                  </div>
                  <div className="space-y-2" id="sku-input">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="CGNP-001"
                    />
                  </div>
                </div>

                <div className="space-y-2" id="description-section">
                  <div className="flex items-center justify-between" id="description-header">
                    <Label htmlFor="description">Description</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={enhanceDescription}
                      disabled={aiLoading.description}
                      id="enhance-description-button"
                    >
                      {aiLoading.description ? (
                        <div className="animate-spin h-4 w-4 mr-2" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Enhance with AI
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Elegant gold-plated pendant with custom name engraving..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card id="images-card">
              <CardHeader id="images-header">
                <CardTitle id="images-title">Product Images</CardTitle>
                <CardDescription id="images-description">
                  Upload high-quality images of your product
                </CardDescription>
              </CardHeader>
              <CardContent id="images-content">
                <ImageUploader
                  imageUrls={formData.image_urls}
                  onImagesChange={(urls) => setFormData(prev => ({
                    ...prev,
                    image_urls: urls
                  }))}
                  productId={id}
                />
                {formData.image_urls.length > 0 && (
                  <div className="mt-4 flex gap-2" id="ai-button-container">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleImageAnalysis}
                      disabled={aiLoading.image || aiLoading.generateAll}
                      id="analyze-image-button"
                    >
                      {aiLoading.image ? (
                        <div className="animate-spin h-4 w-4 mr-2" />
                      ) : (
                        <Eye className="h-4 w-4 mr-2" />
                      )}
                      Analyze Image
                    </Button>
                    {formData.title.trim() && (
                      <Button
                        type="button"
                        onClick={handleGenerateAll}
                        disabled={aiLoading.generateAll || aiLoading.image}
                        id="generate-all-button"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {aiLoading.generateAll ? (
                          <div className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Generate All with AI
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO & Metadata */}
            <Card id="seo-card">
              <CardHeader id="seo-header">
                <CardTitle id="seo-title">SEO & Metadata</CardTitle>
                <CardDescription id="seo-description">
                  Optimize your product for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" id="seo-content">
                <div className="flex items-center justify-between" id="metadata-header">
                  <div>
                    <Label>Meta Information</Label>
                    {(aiLoading.generateAll || aiLoading.metadata) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        AI is generating SEO-optimized metadata...
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateMetadata}
                    disabled={aiLoading.metadata || aiLoading.generateAll}
                    id="generate-metadata-button"
                  >
                    {aiLoading.metadata ? (
                      <div className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <Tag className="h-4 w-4 mr-2" />
                    )}
                    Generate with AI
                  </Button>
                </div>

                <div className="space-y-2" id="meta-title-section">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    placeholder="Custom Gold Name Pendant - Personalized Jewelry"
                  />
                  <p className="text-xs text-muted-foreground" id="meta-title-counter">
                    {formData.meta_title.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2" id="meta-description-section">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    placeholder="Beautiful custom name pendant crafted with premium materials..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground" id="meta-description-counter">
                    {formData.meta_description.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6" id="sidebar">
            {/* Status & Visibility */}
            <Card id="status-card">
              <CardHeader id="status-header">
                <CardTitle id="status-title">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" id="status-content">
                <div className="flex items-center justify-between" id="active-toggle">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      is_active: checked
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between" id="featured-toggle">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <Label htmlFor="is_featured">Featured Product</Label>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      is_featured: checked,
                      // Set featured_order when featuring a product
                      featured_order: checked ? Math.floor(Date.now() / 1000) : prev.featured_order
                    }))}
                  />
                </div>

                {formData.is_featured && (
                  <div className="space-y-2" id="featured-order">
                    <Label htmlFor="featured_order">Featured Order (lower numbers show first)</Label>
                    <Input
                      id="featured_order"
                      type="number"
                      value={formData.featured_order}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        featured_order: parseInt(e.target.value) || 0
                      }))}
                      placeholder="0"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card id="pricing-card">
              <CardHeader id="pricing-header">
                <CardTitle id="pricing-title">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" id="pricing-content">
                <div className="space-y-2" id="price-input">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="74.99"
                    required
                  />
                </div>

                <div className="space-y-2" id="compare-price-input">
                  <Label htmlFor="compare_price">Compare Price ($)</Label>
                  <Input
                    id="compare_price"
                    name="compare_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_price}
                    onChange={handleChange}
                    placeholder="99.99"
                  />
                </div>

                <div className="space-y-2" id="cogs-input">
                  <Label htmlFor="cogs">Cost of Goods ($)</Label>
                  <Input
                    id="cogs"
                    name="cogs"
                    type="number"
                    step="0.01"
                    value={formData.cogs}
                    onChange={handleChange}
                    placeholder="25.00"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card id="inventory-card">
              <CardHeader id="inventory-header">
                <CardTitle id="inventory-title">Inventory</CardTitle>
              </CardHeader>
              <CardContent id="inventory-content">
                <div className="space-y-2" id="stock-input">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="50"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2" id="form-actions">
              <Button type="submit" disabled={loading} className="w-full" id="submit-button">
                {loading ? (
                  <div className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditing ? 'Update Product' : 'Create Product'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/products')}
                className="w-full"
                id="cancel-button"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
