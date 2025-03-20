
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MenuGrid from '@/components/menu/MenuGrid';

const Menu = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="mb-8 text-center md:text-left">
          <div className="inline-block mb-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Today's Menu
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Discover What's Cooking
          </h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto md:mx-0">
            Explore our daily menu options prepared with fresh ingredients and care for your wellbeing.
          </p>
        </div>
        
        <MenuGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
