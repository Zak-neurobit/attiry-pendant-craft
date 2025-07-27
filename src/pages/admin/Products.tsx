
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Filter, Download, Eye, Package, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { toggleProductFeatured, bulkUpdateFeatured } from '@/lib/featuredProducts';

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  compare_price: number;
  stock: number;
  sku: string | null;
  is_active: boolean;
  is_featured: boolean;
  featured_order: number;
  image_urls: string[] | null;
  color_variants: string[] | null;
  chain_types: string[] | null;
  fonts: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  tags: string[] | null;
  cogs: number;
  created_at: string;
  updated_at: string;
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, statusFilter, stockFilter, featuredFilter]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(product => product.is_active === isActive);
    }

    if (stockFilter !== 'all') {
      if (stockFilter === 'in_stock') {
        filtered = filtered.filter(product => product.stock > 0);
      } else if (stockFilter === 'out_of_stock') {
        filtered = filtered.filter(product => product.stock === 0);
      }
    }

    if (featuredFilter !== 'all') {
      const isFeatured = featuredFilter === 'featured';
      filtered = filtered.filter(product => product.is_featured === isFeatured);
    }

    setFilteredProducts(filtered);
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProducts);

      if (error) throw error;

      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      toast({
        title: "Success",
        description: `${selectedProducts.length} products deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete products",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const exportProducts = () => {
    toast({
      title: "Export Started",
      description: "Your product data is being exported to CSV.",
    });
  };

  const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      const result = await toggleProductFeatured(productId, !currentFeatured);
      
      if (result.success) {
        // Update the local state
        setProducts(products.map(product => 
          product.id === productId 
            ? { ...product, is_featured: !currentFeatured }
            : product
        ));
        
        toast({
          title: "Success",
          description: `Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const handleBulkFeature = async (featured: boolean) => {
    if (selectedProducts.length === 0) return;

    try {
      const result = await bulkUpdateFeatured(selectedProducts, featured);
      
      if (result.success) {
        // Update the local state
        setProducts(products.map(product => 
          selectedProducts.includes(product.id) 
            ? { ...product, is_featured: featured }
            : product
        ));
        
        setSelectedProducts([]);
        toast({
          title: "Success",
          description: `${selectedProducts.length} products ${featured ? 'featured' : 'unfeatured'} successfully`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-cormorant">Products</h1>
          <p className="text-muted-foreground">
            Manage your jewelry collection
          </p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by inventory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Inventory</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="not_featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>

            {selectedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  Delete Selected ({selectedProducts.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkFeature(true)}>
                  <Star className="mr-2 h-4 w-4" />
                  Feature Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkFeature(false)}>
                  Unfeature Selected
                </Button>
                <Button variant="outline" size="sm" onClick={exportProducts}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Products ({filteredProducts.length})
            {selectedProducts.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({selectedProducts.length} selected)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div>Loading products...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No products found.</p>
                        <Button onClick={() => navigate('/admin/products/new')}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create your first product
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                            {product.image_urls?.[0] ? (
                              <img 
                                src={product.image_urls[0]} 
                                alt={product.title}
                                className="w-10 h-10 object-cover rounded-md"
                              />
                            ) : (
                              <Package className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {product.title}
                              {product.is_featured && (
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              )}
                            </div>
                            {product.compare_price > 0 && product.compare_price > product.price && (
                              <div className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.compare_price)}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Active" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                product.is_featured
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-400 hover:text-yellow-400'
                              }`}
                            />
                          </Button>
                          {product.is_featured && (
                            <Badge variant="outline" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock} in stock
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{formatPrice(product.price)}</span>
                          {product.compare_price > 0 && product.compare_price > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.compare_price)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.color_variants?.slice(0, 2).map((variant) => (
                            <Badge key={variant} variant="outline" className="text-xs">
                              {variant.replace('_', ' ')}
                            </Badge>
                          ))}
                          {product.color_variants && product.color_variants.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.color_variants.length - 2}
                            </Badge>
                          )}
                          {product.chain_types && product.chain_types.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {product.chain_types.length} chains
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Product</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "{product.title}"? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  Delete Product
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
