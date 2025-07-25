
import { Heart, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-greatvibes font-bold">
                Attiry
              </div>
              <div className="text-xs text-primary-foreground/70 uppercase tracking-widest">
                Custom Pendants
              </div>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Crafting luxury custom name pendants with premium materials and 
              precision engraving since 1984.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/shop" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Shop All
              </Link>
              <Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                About Us
              </Link>
              <Link to="/terms" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/faq" className="text-primary-foreground/80 hover:text-accent transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Care</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/shipping" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Shipping Info
              </Link>
              <Link to="/returns" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Returns & Exchanges
              </Link>
              <Link to="/size-guide" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Size Guide
              </Link>
              <Link to="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>hello@attiry.com</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
            <p className="text-primary-foreground/80 mb-4">
              Get exclusive offers and new collection updates
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-background text-foreground border border-border focus:outline-none focus:border-accent"
              />
              <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/70 text-sm">
            © 2024 Attiry. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 text-primary-foreground/70 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
