
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Clock, CalendarDays, ThumbsUp, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user } = useAuth();
  const [nextMeal, setNextMeal] = useState<any>(null);
  const [topRatedMeals, setTopRatedMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      
      try {
        // Get current time
        const now = new Date();
        const currentHour = now.getHours();
        
        // Determine next meal type based on time of day
        let nextMealType;
        if (currentHour < 11) {
          nextMealType = 'breakfast';
        } else if (currentHour < 16) {
          nextMealType = 'lunch';
        } else {
          nextMealType = 'dinner';
        }
        
        // Fetch next meal
        const { data: mealData, error: mealError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('meal_type', nextMealType)
          .order('rating', { ascending: false })
          .limit(1)
          .single();
        
        if (mealError && mealError.code !== 'PGRST116') {
          console.error('Error fetching next meal:', mealError);
        } else {
          setNextMeal(mealData || {
            title: 'Next meal information coming soon',
            serving_time: mealType(nextMealType),
            rating: 0
          });
        }
        
        // Fetch top rated meals
        const { data: topRated, error: topRatedError } = await supabase
          .from('menu_items')
          .select('*')
          .order('rating', { ascending: false })
          .limit(3);
        
        if (topRatedError) {
          console.error('Error fetching top rated meals:', topRatedError);
        } else {
          setTopRatedMeals(topRated || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, []);

  // Helper function to get meal time display
  const mealType = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '7:30 - 9:30 AM';
      case 'lunch':
        return '12:30 - 2:30 PM';
      case 'dinner':
        return '7:00 - 9:00 PM';
      default:
        return 'Coming soon';
    }
  };

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={`star-${i}`} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-1 text-sm">{rating ? rating.toFixed(1) : 'No ratings'}</span>
      </div>
    );
  };

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
                Annapurna Mess Menu App
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
                {!user && (
                  <Button asChild variant="outline" size="lg" className="rounded-full">
                    <Link to="/register">
                      Register Now
                    </Link>
                  </Button>
                )}
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
              {topRatedMeals.length > 0 && (
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-card p-4 rounded-xl shadow-lg max-w-[180px] animate-fade-in glass-card">
                  {renderStars(topRatedMeals[0]?.rating || 0)}
                  <p className="text-sm font-medium mt-2">
                    "{topRatedMeals[0]?.title || 'The best mess food on campus!'}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    - Top Rated Meal
                  </p>
                </div>
              )}
              
              {nextMeal && (
                <div className="absolute -top-6 -right-6 bg-white dark:bg-card p-4 rounded-xl shadow-lg animate-fade-in glass-card">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Next Meal</p>
                      <p className="text-xs text-muted-foreground">
                        {nextMeal.meal_type ? `${nextMeal.meal_type.charAt(0).toUpperCase() + nextMeal.meal_type.slice(1)}: ${nextMeal.serving_time || mealType(nextMeal.meal_type)}` : 'Coming soon'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
      
      {/* Top Rated Meals Section */}
      {topRatedMeals.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Top Rated Meals
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Check out the highest-rated meals from our menu
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {topRatedMeals.map((meal, index) => (
                <div key={index} className="bg-background p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    <img 
                      src={meal.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                      alt={meal.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{meal.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{meal.description || "A delicious meal prepared with care."}</p>
                  {renderStars(meal.rating || 0)}
                  <div className="mt-4 text-sm">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-10">
              <Button asChild variant="outline" size="lg" className="rounded-full gap-2">
                <Link to="/menu">
                  View All Menu Items
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      
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
              {user ? (
                <Button asChild size="lg" className="rounded-full gap-1">
                  <Link to="/menu">
                    Explore Menu
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="rounded-full gap-1">
                  <Link to="/register">
                    Get Started
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
