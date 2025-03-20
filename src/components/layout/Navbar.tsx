
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6',
        isScrolled
          ? 'glass-card py-2 shadow-md'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
          aria-label="Annapurna Home"
        >
          <ChefHat className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline-block">Annapurna</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-foreground/80 hover:text-primary transition-colors"
            aria-label="Home"
          >
            Home
          </Link>
          <Link 
            to="/menu" 
            className="text-foreground/80 hover:text-primary transition-colors"
            aria-label="Menu"
          >
            Menu
          </Link>
          <Link 
            to="/feedback" 
            className="text-foreground/80 hover:text-primary transition-colors"
            aria-label="Feedback"
          >
            Feedback
          </Link>
        </nav>

        {/* Authentication Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm" className="rounded-full gap-1">
              <User className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="rounded-full">Register</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transform ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } transition-all duration-300 ease-in-out md:hidden pt-20 bg-background`}
      >
        <div className="flex flex-col gap-4 px-6 py-8">
          <Link
            to="/"
            className="flex items-center py-3 text-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="flex items-center py-3 text-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            to="/feedback"
            className="flex items-center py-3 text-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Feedback
          </Link>
          <div className="border-t my-3 border-border"></div>
          <Link
            to="/login"
            className="flex items-center py-3 text-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="flex items-center py-3 text-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
