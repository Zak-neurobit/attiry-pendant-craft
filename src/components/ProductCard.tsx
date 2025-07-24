
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useFavourites } from '@/stores/favourites';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  colors?: string[];
  slug?: string;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  originalPrice, 
  image, 
  rating = 5, 
  reviewCount = 0,
  isNew = false,
  colors = ['gold', 'rose-gold', 'silver'],
  slug
}: ProductCardProps) => {
  const { isFavourite, addToFavourites, removeFromFavourites } = useFavourites();
  const { toast } = useToast();
  const isProductFavourite = isFavourite(id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isProductFavourite) {
        await removeFromFavourites(id);
        toast({
          title: "Removed from favorites",
          description: `${name} has been removed from your favorites.`,
        });
      } else {
        await addToFavourites(id);
        toast({
          title: "Added to favorites",
          description: `${name} has been added to your favorites.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  const productSlug = slug || (id === '1' ? 'custom-gold-name-pendant' : 
                                id === '2' ? 'rose-gold-script-pendant' : 
                                id === '3' ? 'classic-silver-nameplate' : 
                                'vintage-copper-pendant');

  return (
    <motion.div 
      className="bg-card rounded-lg shadow-soft overflow-hidden border hover:shadow-lg transition-all duration-300 group"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <Link to={`/product/${productSlug}`}>
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
              New
            </span>
          )}
          {originalPrice && (
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
              25% OFF
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isProductFavourite 
                ? 'fill-red-500 text-red-500' 
                : 'text-muted-foreground hover:text-red-500'
            }`} 
          />
        </motion.button>

        {/* Quick Add Button - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button className="w-full btn-cta text-sm">
            Quick Add
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({reviewCount})
          </span>
        </div>

        {/* Product Name */}
        <Link to={`/product/${productSlug}`}>
          <h3 className="font-medium text-foreground hover:text-accent transition-colors mb-2 line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Color Options */}
        <div className="flex items-center gap-1 mb-3">
          {colors.map((color) => (
            <div 
              key={color}
              className={`w-4 h-4 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform ${
                color === 'gold' ? 'bg-yellow-400' :
                color === 'rose-gold' ? 'bg-rose-400' :
                color === 'silver' ? 'bg-gray-300' :
                color === 'copper' ? 'bg-orange-600' :
                'bg-muted'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            +{colors.length} colors
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
