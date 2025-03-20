
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

// Schema for form validation
const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  userType: z.enum(['user1', 'user2']),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'user2',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsRegistering(true);
      
      const userData = {
        username: data.username,
        user_type: data.userType,
      };

      const { error } = await signUp(data.email, data.password, userData);
      
      if (error) {
        // Handle specific error cases
        if (error.message.includes('email already in use')) {
          setError('email', { 
            type: 'manual', 
            message: 'This email is already registered. Please try logging in.'
          });
        } else {
          toast({
            title: 'Registration failed',
            description: error.message,
            variant: 'destructive',
          });
        }
        return;
      }

      toast({
        title: 'Account created successfully',
        description: 'You can now log in with your credentials.',
      });
      
      // On successful registration, navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const userType = watch('userType');

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-card rounded-xl animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
        <p className="text-muted-foreground mt-2">Sign up to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label 
            htmlFor="username" 
            className="text-sm font-medium"
          >
            Username
          </Label>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="johndoe"
            {...register('username')}
            aria-invalid={errors.username ? "true" : "false"}
            aria-describedby={errors.username ? "username-error" : undefined}
            className={errors.username ? "border-destructive" : ""}
            disabled={isRegistering}
          />
          {errors.username && (
            <div className="flex items-center gap-2 text-sm text-destructive" id="username-error">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.username.message}</span>
            </div>
          )}
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <Label 
            htmlFor="email" 
            className="text-sm font-medium"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={errors.email ? "border-destructive" : ""}
            disabled={isRegistering}
          />
          {errors.email && (
            <div className="flex items-center gap-2 text-sm text-destructive" id="email-error">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.email.message}</span>
            </div>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <Label 
            htmlFor="password" 
            className="text-sm font-medium"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('password')}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={errors.password ? "border-destructive pr-10" : "pr-10"}
              disabled={isRegistering}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
              disabled={isRegistering}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="flex items-center gap-2 text-sm text-destructive" id="password-error">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.password.message}</span>
            </div>
          )}
        </div>

        {/* Confirm Password field */}
        <div className="space-y-2">
          <Label 
            htmlFor="confirmPassword" 
            className="text-sm font-medium"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
              className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
              disabled={isRegistering}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
              disabled={isRegistering}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="flex items-center gap-2 text-sm text-destructive" id="confirm-password-error">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.confirmPassword.message}</span>
            </div>
          )}
        </div>

        {/* Account Type radios */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Account Type</Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="user1"
                value="user1"
                {...register('userType')}
                className="h-4 w-4 text-primary"
                disabled={isRegistering}
              />
              <Label htmlFor="user1" className="font-normal cursor-pointer">
                Mess Worker (can update menu)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="user2"
                value="user2"
                {...register('userType')}
                className="h-4 w-4 text-primary"
                disabled={isRegistering}
              />
              <Label htmlFor="user2" className="font-normal cursor-pointer">
                Regular User (can view menu and give feedback)
              </Label>
            </div>
          </div>
          {userType === 'user1' && (
            <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
              Note: Mess Worker accounts require approval from administrators.
            </div>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            {...register('termsAccepted')}
            aria-invalid={errors.termsAccepted ? "true" : "false"}
            aria-describedby={errors.termsAccepted ? "terms-error" : undefined}
            disabled={isRegistering}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-normal cursor-pointer"
            >
              I agree to the{' '}
              <Link 
                to="/terms" 
                className="text-primary hover:underline font-medium"
                target="_blank"
              >
                terms of service
              </Link>
              {' '}and{' '}
              <Link 
                to="/privacy" 
                className="text-primary hover:underline font-medium"
                target="_blank"
              >
                privacy policy
              </Link>
            </Label>
            {errors.termsAccepted && (
              <div className="flex items-center gap-2 text-sm text-destructive" id="terms-error">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.termsAccepted.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isRegistering}
          className="w-full"
          aria-busy={isRegistering}
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
