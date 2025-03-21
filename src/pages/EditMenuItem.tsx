import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Image, X, Plus, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const EditMenuItem = () => {
  const { id } = useParams<{ id: string }>();
  const { user, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meal_type: '',
    serving_time: '',
    detailed_description: '',
    ingredients: [''],
  });

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    // Only run the redirect check after auth state is confirmed loaded
    if (!authLoading) {
      // Redirect to login if not authenticated
      if (!user) {
        navigate('/login', { state: { returnTo: `/edit-menu-item/${id}` } });
        return;
      }
      
      // Redirect regular users to home
      if (user && userType !== 'user1') {
        navigate('/');
        toast({
          title: 'Access Denied',
          description: 'Only mess workers can edit menu items.',
          variant: 'destructive',
        });
        return;
      }

      // Only fetch data if we're not redirecting and have an ID
      if (id && user && userType === 'user1' && !dataFetched) {
        fetchMenuItem();
      }
    }
  }, [id, user, authLoading, navigate, userType, dataFetched]);

  const fetchMenuItem = async () => {
    try {
      console.log("Fetching menu item with ID:", id);
      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching menu item:', fetchError);
        setError('Failed to load menu item data. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!data) {
        setError('Menu item not found');
        setIsLoading(false);
        return;
      }

      console.log("Menu item data fetched:", data);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        meal_type: data.meal_type || '',
        serving_time: data.serving_time || '',
        detailed_description: data.detailed_description || '',
        ingredients: data.ingredients?.length > 0 ? data.ingredients : [''],
      });

      setTags(data.tags || []);
      setImageUrl(data.image_url || null);
      setDataFetched(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching menu item:', error);
      setError('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ''],
    }));
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please enter a title for the menu item.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please enter a description for the menu item.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.meal_type) {
      toast({
        title: 'Required Field',
        description: 'Please select a meal type.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.serving_time.trim()) {
      toast({
        title: 'Required Field',
        description: 'Please enter a serving time for the menu item.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let updatedImageUrl = imageUrl;

      // Upload new image if one is selected
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('food_images')
          .upload(filePath, image);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('food_images')
          .getPublicUrl(filePath);

        updatedImageUrl = publicUrlData.publicUrl;
      }

      // Filter out empty ingredients
      const filteredIngredients = formData.ingredients.filter(ingredient => ingredient.trim() !== '');

      // Update menu item in the database
      const { error } = await supabase
        .from('menu_items')
        .update({
          title: formData.title,
          description: formData.description,
          image_url: updatedImageUrl,
          meal_type: formData.meal_type,
          tags: tags,
          serving_time: formData.serving_time,
          detailed_description: formData.detailed_description,
          ingredients: filteredIngredients,
          updated_at: new Date().toISOString(), // Convert Date to ISO string
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Menu item updated successfully!',
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating menu item:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update menu item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a more granular loading state rather than a full-page loader
  const renderLoadingContent = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-64 mb-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-6">
        <Skeleton className="h-10 w-32 mr-auto" />
        <Skeleton className="h-10 w-40" />
      </CardFooter>
    </Card>
  );

  // Don't render a loading screen if we're still checking auth, just render nothing
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 pb-12 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Verifying access...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Only render 'null' if we're still checking auth permissions and redirecting
  if (!user || userType !== 'user1') {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 pb-12">
          <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="mb-8 text-center md:text-left">
          <div className="inline-block mb-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Menu Management
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Edit Menu Item
          </h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto md:mx-0">
            Update information for this menu item.
          </p>
        </div>

        {isLoading ? renderLoadingContent() : (
          <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Menu Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter the name of the dish"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="A brief description of the dish"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal_type">Meal Type*</Label>
                    <Select
                      value={formData.meal_type}
                      onValueChange={(value) => handleSelectChange('meal_type', value)}
                    >
                      <SelectTrigger id="meal_type">
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="snacks">Snacks</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serving_time">Serving Time*</Label>
                    <Input
                      id="serving_time"
                      name="serving_time"
                      value={formData.serving_time}
                      onChange={handleChange}
                      placeholder="e.g. 7:30 - 9:30 AM"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailed_description">Detailed Description</Label>
                  <Textarea
                    id="detailed_description"
                    name="detailed_description"
                    value={formData.detailed_description}
                    onChange={handleChange}
                    placeholder="A more detailed description of the dish, its origin, or how it's prepared"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ingredients</Label>
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        disabled={formData.ingredients.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIngredient}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ingredient
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pl-2 gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-transparent p-0"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag (e.g. Spicy, Vegetarian)"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} disabled={!newTag.trim()}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Food Image</Label>
                  <div className="mt-1 flex items-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 rounded-full h-6 w-6"
                          onClick={removeImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : imageUrl ? (
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Menu item"
                          className="h-32 w-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 rounded-full h-6 w-6"
                          onClick={removeImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-md border-gray-300 cursor-pointer hover:border-primary transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Image className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">Upload Image</p>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Update Menu Item'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EditMenuItem;
