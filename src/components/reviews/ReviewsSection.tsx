
import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/stores/auth';
import { productReviews, Review as StaticReview } from '@/lib/reviews';

interface Review {
  id: string;
  user_id: string;
  userName?: string;
  userImage?: string;
  rating: number;
  comment: string;
  images: string[];
  verified: boolean;
  helpful: number;
  not_helpful: number;
  created_at: string;
  customText?: string;
  color?: string;
}

interface ReviewsSectionProps {
  productId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { user } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If no database reviews, use static reviews as fallback
      if (!data || data.length === 0) {
        const staticReviews = productReviews[productId] || [];
        setReviews(staticReviews);
      } else {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // On error, fallback to static reviews
      const staticReviews = productReviews[productId] || [];
      setReviews(staticReviews);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user || !newReview.comment.trim()) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: newReview.rating,
          comment: newReview.comment.trim(),
        });

      if (error) throw error;

      setNewReview({ rating: 5, comment: '' });
      setShowWriteReview(false);
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const voteHelpful = async (reviewId: string, isHelpful: boolean) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      const updates = isHelpful 
        ? { helpful: review.helpful + 1 }
        : { not_helpful: review.not_helpful + 1 };

      const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId);

      if (error) throw error;
      loadReviews();
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (loading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <div className="flex items-center mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>
        </div>
        {user && (
          <Button onClick={() => setShowWriteReview(!showWriteReview)}>
            Write Review
          </Button>
        )}
      </div>

      {showWriteReview && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h4 className="font-medium mb-4">Write a Review</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= newReview.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Comment</label>
            <Textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your experience with this product..."
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={submitReview} disabled={!newReview.comment.trim()}>
              Submit Review
            </Button>
            <Button variant="outline" onClick={() => setShowWriteReview(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {review.userImage && (
                  <div className="relative">
                    <img 
                      src={review.userImage} 
                      alt={review.userName || 'User'} 
                      className={`w-10 h-10 rounded-full ${
                        review.userImage.startsWith('data:image/svg+xml') 
                          ? '' 
                          : 'object-cover ring-2 ring-gray-100'
                      }`}
                    />
                    {review.verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {review.userName && (
                    <p className="text-sm font-medium text-gray-900 mt-1">{review.userName}</p>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
            <p className="text-gray-700 mb-3">{review.comment}</p>
            {(review.customText || review.color) && (
              <div className="flex gap-4 mb-3 text-sm text-gray-600">
                {review.customText && (
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    Personalized: "{review.customText}"
                  </span>
                )}
                {review.color && (
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs capitalize">
                    Color: {review.color.replace('-', ' ')}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{new Date(review.created_at).toLocaleDateString()}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => voteHelpful(review.id, true)}
                  className="flex items-center gap-1 hover:text-green-600"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {review.helpful}
                </button>
                <button
                  onClick={() => voteHelpful(review.id, false)}
                  className="flex items-center gap-1 hover:text-red-600"
                >
                  <ThumbsDown className="h-4 w-4" />
                  {review.not_helpful}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
