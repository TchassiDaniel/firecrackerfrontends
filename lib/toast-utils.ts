import { toast } from "@/components/ui/use-toast";

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

export const TOAST_ICONS: Record<ToastVariant, string> = {
  default: '✨',
  destructive: '❌',
  success: '✅', 
  warning: '⚠️',
  info: 'ℹ️'
};

export function showToast(options: {
  title: string;
  description?: string;
  variant?: ToastVariant;
}) {
  const { 
    title, 
    description, 
    variant = 'default' 
  } = options;

  toast({
    title,
    description,
    variant,
    duration: 3000, // 3 seconds
  });
}

export function showErrorToast(error: unknown, fallbackMessage?: string) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : fallbackMessage 
      || 'Une erreur inattendue est survenue';

  toast({
    title: 'Erreur',
    description: errorMessage,
    variant: 'destructive',
    duration: 5000, // 5 seconds for errors
  });
}

export function showSuccessToast(message: string) {
  toast({
    title: 'Succès',
    description: message,
    variant: 'success',
    duration: 3000,
  });
}

export function showWarningToast(message: string) {
  toast({
    title: 'Attention',
    description: message,
    variant: 'warning',
    duration: 4000,
  });
}
