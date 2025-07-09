"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastIcon,
  ToastAction,
} from "@/components/ui/toast"
import { memo } from "react"

// Memoized individual toast component for performance
const ToastComponent = memo(({ toast }: { toast: any }) => {
  const { id, title, description, action, variant, ...props } = toast

  return (
      <Toast key={id} variant={variant} {...props}>
        <div className="flex items-start space-x-3 w-full">
          <ToastIcon variant={variant} />
          <div className="flex-1 space-y-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
                <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
          )}
        </div>
        <ToastClose />
      </Toast>
  )
})

ToastComponent.displayName = "ToastComponent"

// Main toaster component
export function Toaster() {
  const { toasts } = useToast()

  return (
      <ToastProvider swipeDirection="right">
        {toasts.map((toast) => (
            <ToastComponent key={toast.id} toast={toast} />
        ))}
        <ToastViewport />
      </ToastProvider>
  )
}