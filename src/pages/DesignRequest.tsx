
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';

export default function DesignRequest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    imageUrl: '',
    deliveryDate: undefined as Date | undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('design_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          description: formData.description,
          image_url: formData.imageUrl,
          delivery_date: formData.deliveryDate?.toISOString().split('T')[0],
        });

      if (error) throw error;

      toast.success('Design request submitted successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        description: '',
        imageUrl: '',
        deliveryDate: undefined,
      });
    } catch (error) {
      toast.error('Failed to submit design request. Please try again.');
      console.error('Error submitting design request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEOHead
        title="Custom Design Request - Attiry"
        description="Request a custom jewelry design. Share your vision and we'll bring it to life."
      />
      
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Custom Design Request
          </h1>
          <p className="text-lg text-gray-600">
            Have a unique vision? Share your ideas and we'll create something special just for you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Design Details</CardTitle>
            <CardDescription>
              Tell us about your dream piece and we'll make it happen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Design Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your ideal piece... What style, materials, size, and special details would you like?"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Inspiration Image (Optional)</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/inspiration-image.jpg"
                />
                <p className="text-sm text-gray-500">
                  Share a link to an image that inspires your design
                </p>
              </div>

              <div className="space-y-2">
                <Label>Desired Delivery Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {formData.deliveryDate ? format(formData.deliveryDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deliveryDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, deliveryDate: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Design Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            We typically respond to design requests within 24-48 hours. 
            Custom pieces usually take 2-4 weeks to complete.
          </p>
        </div>
      </div>
    </div>
  );
}
