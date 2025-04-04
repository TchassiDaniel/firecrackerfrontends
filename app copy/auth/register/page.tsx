// Fichier app/auth/register/page.tsx 

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  password_confirmation: z.string(),
  terms: z.boolean().refine((value) => value, {
    message: 'You must agree to the terms of service and privacy policy',
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      router.push('/auth/verify-email');
      toast({
        title: 'Success',
        description: 'Registration successful. Please verify your email.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Registration failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 mb-4">
            <svg 
              viewBox="0 0 24 24" 
              className="w-full h-full text-blue-500"
              fill="currentColor"
            >
              <path d="M22 17.5C22 19.433 20.433 21 18.5 21H5.5C3.567 21 2 19.433 2 17.5C2 15.567 3.567 14 5.5 14H18.5C20.433 14 22 15.567 22 17.5Z" />
              <path d="M22 6.5C22 8.433 20.433 10 18.5 10H5.5C3.567 10 2 8.433 2 6.5C2 4.567 3.567 3 5.5 3H18.5C20.433 3 22 4.567 22 6.5Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 mt-2">Start your cloud journey with us</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Name"
              {...register('name')}
              className={`w-full px-4 py-3 rounded-lg border border-blue-100 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-lg border border-blue-100 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register('password')}
              className={`w-full px-4 py-3 rounded-lg border border-blue-100 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              {...register('password_confirmation')}
              className={`w-full px-4 py-3 rounded-lg border border-blue-100 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.password_confirmation ? 'border-red-500' : ''}`}
            />
            {errors.password_confirmation && (
              <p className="text-sm text-red-500 mt-1">{errors.password_confirmation.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="terms" {...register('terms')} required />
            <Label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <Link href="/terms" className="text-[#0066FF] hover:text-blue-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#0066FF] hover:text-blue-700">
                Privacy Policy
              </Link>
            </Label>
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms.message}</p>
            )}
          </div>

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Creating account...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Register
              </>
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Already registered?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
