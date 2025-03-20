
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Clock, CalendarDays, ThumbsUp, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-[-1]"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Campus Mess Menu App
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Discover Today's <span className="text-primary">Delicious</span> Meal Options
              </h1>
              <p className="text-xl text-muted-foreground">
                Check what's on the menu, give feedback, and never miss your favorite meal again.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="rounded-full gap-2">
                  <Link to="/menu">
                    View Today's Menu
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/register">
                    Register Now
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Delicious Food" 
                  className="object-cover h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-card p-4 rounded-xl shadow-lg max-w-[180px] animate-fade-in glass-card">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400" />
                </div>
                <p className="text-sm font-medium mt-2">
                  "The best mess food I've had on campus!"
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  - Student Review
                </p>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white dark:bg-card p-4 rounded-xl shadow-lg animate-fade-in glass-card">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Next Meal</p>
                    <p className="text-xs text-muted-foreground">
                      Lunch: 12:30 - 2:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Why Use Our Annapurna App?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've designed our app to make your campus dining experience better and more enjoyable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CalendarDays className="h-10 w-10 text-primary" />,
                title: "Daily Updated Menu",
                description: "Check the menu for all meals of the day in advance so you can plan accordingly."
              },
              {
                icon: <ThumbsUp className="h-10 w-10 text-primary" />,
                title: "Feedback & Ratings",
                description: "Rate your meals and provide feedback to help improve the mess food quality."
              },
              {
                icon: <Clock className="h-10 w-10 text-primary" />,
                title: "Meal Time Notifications",
                description: "Get notified before your favorite meals are served so you never miss out."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-shadow glass-card">
                <div className="rounded-full w-16 h-16 flex items-center justify-center bg-primary/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-2xl bg-primary/5 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                Ready to Enhance Your Dining Experience?
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Join the Annapurna platform to get the most out of your campus dining. View menus, provide feedback, and never miss your favorite meal again.
              </p>
              <Button asChild size="lg" className="rounded-full gap-1">
                <Link to="/register">
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
