
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';

export default function DesignRequest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    imageFile: null as File | null,
    deliveryDate: null as Date | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, imageFile: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // For now, we'll simulate upload and return a placeholder
      // In a real implementation, you'd upload to Supabase Storage
      return `placeholder-url-${fileName}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const { error } = await supabase
        .from('design_requests')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          description: formData.description.trim(),
          image_url: imageUrl,
          delivery_date: formData.deliveryDate?.toISOString().split('T')[0],
        });

      if (error) throw error;

      toast.success('Design request submitted successfully! We\'ll be in touch soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        description: '',
        imageFile: null,
        deliveryDate: null,
      });
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error submitting design request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <SEOHead 
        title="Custom Design Request - Attiry"
        description="Request a custom jewelry design. Share your vision and we'll bring it to life with our expert craftsmanship."
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Custom Design Request
            </h1>
            <p className="text-xl text-gray-600">
              Share your vision and we'll create something uniquely yours
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tell us about your dream piece</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Design Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your ideal piece in detail. Include style preferences, materials, size requirements, special features, or any inspiration you have in mind..."
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The more details you provide, the better we can understand your vision.
                  </p>
                </div>

                <div>
                  <Label htmlFor="image">Inspiration Image (Optional)</Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="h-28 w-28 object-cover rounded"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> inspiration image
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                          </div>
                        )}
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Desired Delivery Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-2"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.deliveryDate ? (
                          format(formData.deliveryDate, "PPP")
                        ) : (
                          <span>Select a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.deliveryDate || undefined}
                        onSelect={(date) => setFormData(prev => ({ ...prev, deliveryDate: date || null }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-gray-500 mt-1">
                    Custom pieces typically take 2-4 weeks to complete.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• We'll review your request within 24 hours</li>
                    <li>• Our designer will contact you to discuss details and pricing</li>
                    <li>• We'll create a digital mockup for your approval</li>
                    <li>• Once approved, we'll begin crafting your unique piece</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Design Request'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Have questions? Contact us at{' '}
              <a href="mailto:design@attiry.com" className="text-purple-600 hover:underline">
                design@attiry.com
              </a>{' '}
              or call{' '}
              <a href="tel:+1234567890" className="text-purple-600 hover:underline">
                (123) 456-7890
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
