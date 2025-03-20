
import React, { useState, useEffect } from 'react';
import MenuCard from './MenuCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MenuGrid = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('rating');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Fetch menu items from Supabase
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('rating', { ascending: false });

        if (error) {
          console.error('Error fetching menu items:', error);
          toast({
            title: 'Error',
            description: 'Failed to load menu items.',
            variant: 'destructive',
          });
          return;
        }

        setMenuItems(data || []);
        
        // Extract unique tags from menu items
        const tags = Array.from(
          new Set(data?.flatMap(item => item.tags || []))
        ).sort();
        
        setAllTags(tags);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [toast]);

  // Filter menu items based on active tab, search, and tags
  const filteredMenuItems = menuItems.filter(item => {
    // Filter by meal type (tab)
    if (activeTab !== 'all' && item.meal_type !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (
      searchTerm &&
      !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    ) {
      return false;
    }
    
    // Filter by selected tags
    if (
      selectedTags.length > 0 &&
      (!item.tags || !selectedTags.every(tag => item.tags.includes(tag)))
    ) {
      return false;
    }
    
    return true;
  });
  
  // Sort filtered menu items
  const sortedMenuItems = [...filteredMenuItems].sort((a, b) => {
    switch (sortOption) {
      case 'rating':
        return b.rating - a.rating;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setActiveTab('all');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p className="text-lg">Loading menu items...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full animate-fade-in">
      {/* Search, sort, and filter controls */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search menu items..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="sort-by" className="mb-1.5 block text-sm">
              Sort by
            </Label>
            <Select
              value={sortOption}
              onValueChange={setSortOption}
            >
              <SelectTrigger id="sort-by">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="title-asc">Name (A-Z)</SelectItem>
                <SelectItem value="title-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <Label className="mb-1.5 block text-sm">
              Filter by Tags
            </Label>
            <div className="flex flex-wrap gap-1.5 border rounded-md p-1.5 bg-background min-h-[42px]">
              {allTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {allTags.length > 10 && (
                <Badge variant="secondary">+{allTags.length - 10} more</Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Active filters indicator */}
        {(searchTerm || selectedTags.length > 0 || activeTab !== 'all') && (
          <div className="flex items-center justify-between border rounded-md p-2 bg-muted/50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Active filters:</span>
              </span>
              
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>"{searchTerm}"</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchTerm('')}
                  />
                </Badge>
              )}
              
              {activeTab !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setActiveTab('all')}
                  />
                </Badge>
              )}
              
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <span>{tag}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {/* Meal type tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="w-full grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="snacks">Snacks</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedMenuItems.map((item) => (
              <MenuCard 
                key={item.id} 
                id={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                rating={Number(item.rating) || 0}
                mealType={item.meal_type}
                tags={item.tags || []}
                servingTime={item.serving_time}
                detailedDescription={item.detailed_description}
                ingredients={item.ingredients}
              />
            ))}
          </div>
          
          {sortedMenuItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No menu items match your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </TabsContent>
        
        {["breakfast", "lunch", "snacks", "dinner"].map((mealType) => (
          <TabsContent key={mealType} value={mealType} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedMenuItems
                .filter((item) => item.meal_type === mealType)
                .map((item) => (
                  <MenuCard 
                    key={item.id} 
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                    rating={Number(item.rating) || 0}
                    mealType={item.meal_type}
                    tags={item.tags || []}
                    servingTime={item.serving_time}
                    detailedDescription={item.detailed_description}
                    ingredients={item.ingredients}
                  />
                ))}
            </div>
            
            {sortedMenuItems.filter((item) => item.meal_type === mealType).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No {mealType} items match your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-2 text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MenuGrid;
