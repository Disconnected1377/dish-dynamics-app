
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="h-2 w-12 bg-primary rounded-full my-6" />
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground text-lg max-w-md mb-8">
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Button asChild size="lg" className="rounded-full gap-2">
          <Link to="/">
            <HomeIcon className="h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
