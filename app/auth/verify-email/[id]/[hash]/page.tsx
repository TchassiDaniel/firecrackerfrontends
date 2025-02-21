// Fichier app/auth/verify-email/[id]/[hash]/page.tsx 

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: params.id,
            hash: params.hash,
          }),
        });

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        toast({
          title: 'Success',
          description: 'Your email has been verified successfully.',
        });
        
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Email verification failed. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [params.id, params.hash]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to resend verification email');
      }

      toast({
        title: 'Success',
        description: 'A new verification link has been sent to your email.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resend verification email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/auth/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-4">
      <Card className="w-full max-w-md backdrop-blur-lg bg-white/95">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-20 h-20 text-primary mb-4">
            <Mail className="w-full h-full" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center">
            {isVerifying
              ? 'We are verifying your email address...'
              : 'Thanks for signing up! Please verify your email address to get started.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerifying ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-gray-500">
                If you didn't receive the email, we will gladly send you another.
              </p>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
