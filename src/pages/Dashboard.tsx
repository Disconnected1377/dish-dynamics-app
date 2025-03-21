
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MenuManagement from '@/components/dashboard/MenuManagement';
import { Separator } from '@/components/ui/separator';

const Dashboard = () => {
  const { user, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [redirectChecked, setRedirectChecked] = useState(false);

  useEffect(() => {
    // Only do redirect checks after the auth state is loaded
    if (!authLoading) {
      // Redirect to login if not authenticated
      if (!user) {
        navigate('/login', { state: { returnTo: '/dashboard' } });
      }
      // Redirect regular users to home
      else if (user && userType === 'user2') {
        navigate('/');
      }
      setRedirectChecked(true);
    }
  }, [user, authLoading, navigate, userType]);

  // Show a loading indicator only while auth is loading
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

  // Don't render anything if we're still checking for redirect
  if (!redirectChecked || !user || userType !== 'user1') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="mb-8">
          <div className="inline-block mb-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Mess Worker Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Manage Your Mess
          </h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl">
            Update menu items, view feedback, and manage your mess services.
          </p>
        </div>

        <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Menu Items</h2>
              <Button onClick={() => navigate('/add-menu-item')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            </div>
            <Separator />
            <MenuManagement />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Coming Soon</AlertTitle>
              <AlertDescription>
                Analytics and feedback aggregation features are coming in a future update.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
