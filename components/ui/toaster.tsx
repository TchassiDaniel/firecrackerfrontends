"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { TOAST_ICONS, ToastVariant } from "@/lib/toast-utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = 'default' as ToastVariant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props} className="items-start">
            <div className="flex items-start space-x-3 w-full">
              <span className="text-2xl mt-1">{TOAST_ICONS[variant]}</span>
              <div className="grid gap-1 flex-grow">
                {title && (
                  <ToastTitle className={`font-bold ${
                    variant === 'destructive' ? 'text-red-900' :
                    variant === 'success' ? 'text-green-900' :
                    variant === 'warning' ? 'text-yellow-900' :
                    variant === 'info' ? 'text-blue-900' :
                    'text-gray-900'
                  }`}>
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className={`text-sm ${
                    variant === 'destructive' ? 'text-red-700' :
                    variant === 'success' ? 'text-green-700' :
                    variant === 'warning' ? 'text-yellow-700' :
                    variant === 'info' ? 'text-blue-700' :
                    'text-gray-600'
                  }`}>
                    {description}
                  </ToastDescription>
                )}
              </div>
              {action}
              <ToastClose className="absolute top-2 right-2 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
