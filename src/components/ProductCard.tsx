
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SupabaseProduct } from '@/hooks/useProducts';
import { useFavourites } from '@/stores/favourites';

interface ProductCardProps {
  product: SupabaseProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { favourites, addToFavourites, removeFromFavourites } = useFavourites();
  const isFavourite = favourites.includes(product.id);

  const toggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavourite) {
      removeFromFavourites(product.id);
    } else {
      addToFavourites(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Handle missing or null image URLs
  const imageUrl = product.image_urls?.[0] || '/placeholder.svg';
  
  // Calculate discount percentage
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <Badge className="bg-accent text-accent-foreground">New</Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                Save {discountPercentage}%
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white"
            onClick={toggleFavourite}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavourite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-lg mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {product.description || 'Premium custom name pendant'}
          </p>
          
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating || 5)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              ({product.review_count || 0})
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compare_price!)}
                </span>
              )}
            </div>
            
            <div className="flex gap-1">
              {(product.color_variants || ['gold', 'silver', 'rose-gold']).slice(0, 3).map((color) => (
                <div
                  key={color}
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    color === 'gold'
                      ? 'bg-yellow-500'
                      : color === 'rose-gold'
                      ? 'bg-rose-400'
                      : color === 'silver'
                      ? 'bg-gray-300'
                      : 'bg-amber-600'
                  }`}
                />
              ))}
              {(product.color_variants || []).length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{(product.color_variants || []).length - 3}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
