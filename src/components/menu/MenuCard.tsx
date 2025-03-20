
import React, { useState } from 'react';
import { Star, Clock, Tag, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface MenuCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  tags: string[];
  servingTime: string;
  detailedDescription?: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const MenuCard: React.FC<MenuCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  rating,
  mealType,
  tags,
  servingTime,
  detailedDescription,
  ingredients,
  nutritionalInfo,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const navigate = useNavigate();

  const mealTypeColors = {
    breakfast: 'bg-blue-100 text-blue-800',
    lunch: 'bg-orange-100 text-orange-800',
    snacks: 'bg-green-100 text-green-800',
    dinner: 'bg-purple-100 text-purple-800',
  };

  const mealTypeLabel = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    snacks: 'Snacks',
    dinner: 'Dinner',
  };

  const handleGiveFeedback = () => {
    setIsDetailsOpen(false);
    navigate(`/feedback?menuItemId=${id}`);
  };

  return (
    <>
      <div className="menu-card group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-md">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <div 
            className={cn(
              "absolute inset-0 bg-muted",
              !imageLoaded && "animate-pulse"
            )}
          />
          <img 
            src={imageUrl} 
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-transform duration-300 menu-image",
              imageLoaded ? "image-loaded" : "image-loading"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute top-2 left-2">
            <Badge 
              variant="secondary" 
              className={cn("font-medium", mealTypeColors[mealType])}
            >
              {mealTypeLabel[mealType]}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
          
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>
          
          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
          
          {/* Meta Information */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{servingTime}</span>
            </div>
          </div>
          
          {/* Action Button */}
          <Button 
            onClick={() => setIsDetailsOpen(true)}
            className="mt-3 w-full gap-1"
            variant="secondary"
            size="sm"
          >
            <Info className="h-4 w-4" />
            <span>Details</span>
          </Button>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={cn("font-medium", mealTypeColors[mealType])}
              >
                {mealTypeLabel[mealType]}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                <span>{servingTime}</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Image */}
            <div className="overflow-hidden rounded-md">
              <img 
                src={imageUrl} 
                alt={title}
                className="h-56 w-full object-cover"
              />
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {detailedDescription || description}
              </p>
            </div>

            {/* Ingredients */}
            {ingredients && ingredients.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold">Ingredients</h4>
                <ul className="grid grid-cols-2 gap-1 mt-1">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-primary"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutritional Info */}
            {nutritionalInfo && (
              <div>
                <h4 className="text-sm font-semibold">Nutritional Information</h4>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  <div className="rounded-md bg-secondary p-2 text-center">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-semibold">{nutritionalInfo.calories}</p>
                  </div>
                  <div className="rounded-md bg-secondary p-2 text-center">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="font-semibold">{nutritionalInfo.protein}g</p>
                  </div>
                  <div className="rounded-md bg-secondary p-2 text-center">
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="font-semibold">{nutritionalInfo.carbs}g</p>
                  </div>
                  <div className="rounded-md bg-secondary p-2 text-center">
                    <p className="text-xs text-muted-foreground">Fat</p>
                    <p className="font-semibold">{nutritionalInfo.fat}g</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div>
              <h4 className="text-sm font-semibold">Tags</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={handleGiveFeedback}>Give Feedback</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuCard;
