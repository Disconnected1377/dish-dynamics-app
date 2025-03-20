
import React, { useState } from 'react';
import MenuCard from './MenuCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';

// Sample menu data
const sampleMenuItems = [
  {
    id: 'item1',
    title: 'Masala Dosa with Coconut Chutney',
    description: 'Crispy South Indian crepe made from fermented batter, served with coconut chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    mealType: 'breakfast' as const,
    tags: ['South Indian', 'Vegetarian', 'Popular', 'Crispy'],
    servingTime: '7:30 - 9:30 AM',
    detailedDescription: 'A traditional South Indian breakfast, the crispy dosa is made from a fermented batter of rice and lentils, filled with a spiced potato mixture, and served with freshly made coconut chutney and sambar.',
    ingredients: ['Rice', 'Urad Dal', 'Potatoes', 'Onions', 'Green Chilies', 'Mustard Seeds', 'Turmeric', 'Coconut', 'Curry Leaves'],
    nutritionalInfo: {
      calories: 250,
      protein: 6,
      carbs: 45,
      fat: 7,
    },
  },
  {
    id: 'item2',
    title: 'Paneer Butter Masala with Naan',
    description: 'Rich and creamy curry with cottage cheese chunks in a tomato-based sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    mealType: 'lunch' as const,
    tags: ['North Indian', 'Vegetarian', 'Spicy', 'Popular'],
    servingTime: '12:30 - 2:30 PM',
    detailedDescription: 'A popular North Indian dish featuring soft cubes of paneer (cottage cheese) cooked in a rich, creamy tomato sauce with aromatic spices. Served with freshly baked naan bread.',
    ingredients: ['Paneer', 'Tomatoes', 'Cream', 'Butter', 'Cashews', 'Garam Masala', 'Kasuri Methi', 'Onions', 'Garlic', 'Ginger'],
    nutritionalInfo: {
      calories: 450,
      protein: 18,
      carbs: 30,
      fat: 28,
    },
  },
  {
    id: 'item3',
    title: 'Samosa with Mint Chutney',
    description: 'Crispy pastry filled with spiced potatoes and peas, served with tangy mint chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    mealType: 'snacks' as const,
    tags: ['North Indian', 'Vegetarian', 'Fried', 'Savory'],
    servingTime: '4:00 - 5:30 PM',
    ingredients: ['Flour', 'Potatoes', 'Peas', 'Cumin', 'Coriander', 'Green Chilies', 'Mint', 'Lemon Juice'],
  },
  {
    id: 'item4',
    title: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with marinated chicken pieces and aromatic spices.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    mealType: 'dinner' as const,
    tags: ['Hyderabadi', 'Non-Vegetarian', 'Spicy', 'Rice'],
    servingTime: '7:30 - 9:30 PM',
    detailedDescription: 'A royal Indian dish made with fragrant basmati rice, tender chicken, and a blend of aromatic spices. Slow-cooked to perfection using the dum method, where the pot is sealed to lock in all the flavors.',
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Onions', 'Tomatoes', 'Ginger-Garlic Paste', 'Biryani Masala', 'Saffron', 'Mint', 'Coriander'],
    nutritionalInfo: {
      calories: 550,
      protein: 32,
      carbs: 65,
      fat: 18,
    },
  },
  {
    id: 'item5',
    title: 'Idli Sambar',
    description: 'Soft, steamed rice cakes served with lentil-based vegetable stew and coconut chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    mealType: 'breakfast' as const,
    tags: ['South Indian', 'Vegetarian', 'Healthy', 'Steamed'],
    servingTime: '7:30 - 9:30 AM',
  },
  {
    id: 'item6',
    title: 'Vegetable Pulao',
    description: 'Fragrant rice cooked with mixed vegetables and mild spices.',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107aa7e1fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    mealType: 'lunch' as const,
    tags: ['North Indian', 'Vegetarian', 'Rice', 'Mildly Spiced'],
    servingTime: '12:30 - 2:30 PM',
  },
  {
    id: 'item7',
    title: 'Masala Chai with Biscuits',
    description: 'Spiced Indian tea served with cookies for a perfect evening break.',
    imageUrl: 'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    mealType: 'snacks' as const,
    tags: ['Beverage', 'Spiced', 'Hot', 'Teatime'],
    servingTime: '4:00 - 5:30 PM',
  },
  {
    id: 'item8',
    title: 'Dal Makhani with Jeera Rice',
    description: 'Creamy black lentils simmered overnight, served with cumin-flavored rice.',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    mealType: 'dinner' as const,
    tags: ['Punjabi', 'Vegetarian', 'Rich', 'Creamy'],
    servingTime: '7:30 - 9:30 PM',
  },
];

const MenuGrid = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('rating');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Extract unique tags from menu items
  const allTags = Array.from(
    new Set(sampleMenuItems.flatMap(item => item.tags))
  ).sort();

  // Filter menu items based on active tab, search, and tags
  const filteredMenuItems = sampleMenuItems.filter(item => {
    // Filter by meal type (tab)
    if (activeTab !== 'all' && item.mealType !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (
      searchTerm &&
      !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    
    // Filter by selected tags
    if (
      selectedTags.length > 0 &&
      !selectedTags.every(tag => item.tags.includes(tag))
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
              <MenuCard key={item.id} {...item} />
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
                .filter((item) => item.mealType === mealType)
                .map((item) => (
                  <MenuCard key={item.id} {...item} />
                ))}
            </div>
            
            {sortedMenuItems.filter((item) => item.mealType === mealType).length === 0 && (
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
