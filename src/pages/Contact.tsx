import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit contact request to Supabase using the function
      const { data, error } = await supabase.rpc('submit_contact_request', {
        p_name: formData.name.trim(),
        p_email: formData.email.trim().toLowerCase(),
        p_phone: formData.phone.trim() || null,
        p_subject: formData.subject.trim(),
        p_message: formData.message.trim(),
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEOHead
        title="Contact Us - Attiry"
        description="Get in touch with Attiry for custom name pendants, jewelry inquiries, and personalized service. We're here to help create your perfect piece."
        url="/contact"
      />

      {/* Embossed Floral Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cream-100 rounded-full shadow-inner transform rotate-12"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cream-50 rounded-full shadow-inner transform -rotate-45"></div>
        <div className="absolute bottom-32 left-20 w-28 h-28 bg-cream-100 rounded-full shadow-inner transform rotate-45"></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-cream-50 rounded-full shadow-inner transform -rotate-12"></div>
        
        {/* Floral SVG patterns */}
        <svg className="absolute top-32 left-1/4 w-40 h-40 text-cream-100" fill="currentColor" viewBox="0 0 100 100">
          <path d="M50 20 C60 30, 80 30, 80 50 C80 70, 60 70, 50 80 C40 70, 20 70, 20 50 C20 30, 40 30, 50 20 Z" className="drop-shadow-sm" />
          <circle cx="50" cy="50" r="8" className="opacity-50" />
        </svg>
        
        <svg className="absolute bottom-40 right-1/4 w-36 h-36 text-cream-50" fill="currentColor" viewBox="0 0 100 100">
          <path d="M50 15 C65 25, 85 35, 85 50 C85 65, 65 75, 50 85 C35 75, 15 65, 15 50 C15 35, 35 25, 50 15 Z" className="drop-shadow-sm" />
          <circle cx="50" cy="50" r="6" className="opacity-40" />
        </svg>
        
        <svg className="absolute top-1/2 left-10 w-28 h-28 text-cream-100" fill="currentColor" viewBox="0 0 100 100">
          <path d="M50 25 L55 40 L70 40 L58 50 L63 65 L50 55 L37 65 L42 50 L30 40 L45 40 Z" className="drop-shadow-sm" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-playfair text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question about our custom pendants? Need help with your order? 
            We'd love to hear from you and help create your perfect piece.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="space-y-8">
              <Card className="card-luxury border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair">
                    <Mail className="h-5 w-5 text-accent" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    For general inquiries and support
                  </p>
                  <a 
                    href="mailto:hello@attiry.com" 
                    className="text-accent hover:text-accent/80 font-medium transition-colors"
                  >
                    hello@attiry.com
                  </a>
                </CardContent>
              </Card>

              <Card className="card-luxury border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair">
                    <Phone className="h-5 w-5 text-accent" />
                    Call Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    Monday to Friday, 9 AM - 6 PM
                  </p>
                  <a 
                    href="tel:+1234567890" 
                    className="text-accent hover:text-accent/80 font-medium transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </CardContent>
              </Card>

              <Card className="card-luxury border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-playfair">
                    <Clock className="h-5 w-5 text-accent" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="text-foreground">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="text-foreground">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="text-foreground">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="card-luxury border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-playfair text-2xl">
                  <MessageSquare className="h-6 w-6 text-accent" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-luxury"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-luxury"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-luxury"
                        placeholder="+1 (234) 567-890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="input-luxury"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="input-luxury min-h-[120px]"
                      placeholder="Tell us about your inquiry, custom design ideas, or any questions you have..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-cta"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="card-luxury border-accent/20 bg-gradient-to-r from-accent/5 to-accent/10">
            <CardContent className="py-8">
              <h3 className="text-xl font-playfair font-semibold mb-4">
                Looking for Custom Design Help?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our design experts are here to help you create the perfect custom pendant. 
                Whether you have specific requirements or need inspiration, we're ready to bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="btn-outline-luxury">
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule a Call
                </Button>
                <Button variant="outline" className="btn-outline-luxury">
                  <Mail className="h-4 w-4 mr-2" />
                  Design Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;