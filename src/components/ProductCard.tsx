
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/products';
import { useFavourites } from '@/stores/favourites';

interface ProductCardProps {
  product: Product;
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

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-accent text-accent-foreground">New</Badge>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge variant="destructive">
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
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
              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
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

// Default export for compatibility
export default ProductCard;
