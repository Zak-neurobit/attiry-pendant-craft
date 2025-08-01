import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/lazy-image';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavourites } from '@/stores/favourites';

interface FastProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    originalPrice?: number;
    formattedPrice: string;
    formattedOriginalPrice?: string;
    description: string;
    images: string[];
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    colors: string[];
    category: string;
    stock: number;
    sku?: string;
  };
  priority?: boolean;
}

export const FastProductCard: React.FC<FastProductCardProps> = ({ product, priority = false }) => {
  const { favourites, addToFavourites, removeFromFavourites } = useFavourites();
  const isFavourite = favourites.includes(product.id);

  const toggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavourite) {
      removeFromFavourites(product.id);
    } else {
      addToFavourites(product.id);
    }
  };

  // Calculate savings percentage if there's an original price
  const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;
  const savingsPercentage = hasOriginalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative overflow-hidden">
          <LazyImage
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&auto=format&fit=crop&q=60'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            loadingClassName="h-64"
            priority={priority}
            quality="high"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-accent text-accent-foreground">New</Badge>
            )}
            {hasOriginalPrice && (
              <Badge variant="destructive">
                Save {savingsPercentage}%
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
          <h3 className="font-medium text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
          
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              {hasOriginalPrice ? (
                <>
                  <span className="font-bold text-lg">{product.formattedPrice}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    {product.formattedOriginalPrice}
                  </span>
                </>
              ) : (
                <span className="font-bold text-lg">
                  {product.formattedPrice}
                </span>
              )}
            </div>
            
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map((color) => (
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
              {product.colors.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FastProductCard;