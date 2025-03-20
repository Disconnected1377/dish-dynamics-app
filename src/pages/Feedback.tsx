
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Feedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const menuItemId = searchParams.get('menuItemId');
  const { toast } = useToast();
  
  const [menuItem, setMenuItem] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!menuItemId) {
      setError('No menu item selected. Please go back to the menu and select an item to provide feedback for.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch menu item details
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('id', menuItemId)
          .single();

        if (menuError) {
          console.error('Error fetching menu item:', menuError);
          setError('Menu item not found. Please go back to the menu and try again.');
          setIsLoading(false);
          return;
        }

        setMenuItem(menuData);

        // Fetch existing feedback if user is logged in
        if (user) {
          const { data: feedbackData, error: feedbackError } = await supabase
            .from('feedback')
            .select('*')
            .eq('menu_item_id', menuItemId)
            .eq('user_id', user.id)
            .maybeSingle();

          if (feedbackError && feedbackError.code !== 'PGRST116') {
            console.error('Error fetching feedback:', feedbackError);
          }

          if (feedbackData) {
            setExistingFeedback(feedbackData);
            setRating(feedbackData.rating);
            setComment(feedbackData.comment || '');
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [menuItemId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit feedback.',
        variant: 'destructive',
      });
      navigate('/login', { state: { returnTo: `/feedback?menuItemId=${menuItemId}` } });
      return;
    }

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      let response;

      if (existingFeedback) {
        // Update existing feedback
        response = await supabase
          .from('feedback')
          .update({
            rating,
            comment,
            updated_at: new Date().toISOString(), // Fix: Convert Date to ISO string
          })
          .eq('id', existingFeedback.id);
      } else {
        // Insert new feedback
        response = await supabase
          .from('feedback')
          .insert({
            menu_item_id: menuItemId,
            user_id: user.id,
            rating,
            comment,
          });
      }

      if (response.error) {
        console.error('Error submitting feedback:', response.error);
        setError('Failed to submit feedback. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to submit feedback. Please try again.',
          variant: 'destructive',
        });
      } else {
        setSuccess('Your feedback has been submitted successfully!');
        toast({
          title: 'Success',
          description: 'Your feedback has been submitted successfully!',
        });

        // Refresh existing feedback data
        const { data } = await supabase
          .from('feedback')
          .select('*')
          .eq('menu_item_id', menuItemId)
          .eq('user_id', user.id)
          .single();

        setExistingFeedback(data);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('An unexpected error occurred. Please try again later.');
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 pb-12 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
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
            Feedback
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Share Your Experience
          </h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto md:mx-0">
            Your feedback helps us improve our menu and services.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {!error && menuItem && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>{menuItem.title}</CardTitle>
              <CardDescription>
                {menuItem.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              rating >= star
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium mb-2">
                      Your Comments (Optional)
                    </label>
                    <Textarea
                      id="comment"
                      placeholder="Share your thoughts on this dish..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {!user && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Authentication Required</AlertTitle>
                      <AlertDescription>
                        Please{' '}
                        <Button
                          variant="link"
                          className="p-0 h-auto font-semibold"
                          onClick={() => navigate('/login', { state: { returnTo: `/feedback?menuItemId=${menuItemId}` } })}
                        >
                          log in
                        </Button>{' '}
                        to submit your feedback.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/menu')}
              >
                Back to Menu
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !user}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : existingFeedback ? (
                  'Update Feedback'
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Feedback;
