
import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 pt-12 pb-6 px-4 md:px-6 mt-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">Mess Menu</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Providing delicious and nutritious meals for our community. Check our daily menu 
              and give us your feedback to help us improve.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-foreground/80 hover:text-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-foreground/80 hover:text-primary transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-foreground/80 hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-foreground/80 hover:text-primary transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-foreground/80">123 Mess Hall Street, Campus Area</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-foreground/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-foreground/80">contact@messmenu.com</span>
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                <a 
                  href="https://www.messmenu.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  www.messmenu.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mess Menu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
