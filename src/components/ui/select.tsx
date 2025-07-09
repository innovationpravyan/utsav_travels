'use client';

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

const Select = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
  value: string
  onValueChange: (value: string) => void
}
>(({ children, value, onValueChange, ...props }, ref) => {
  const [open, setOpen] = React.useState(false)

  return (
      <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
        <div ref={ref} className="relative" {...props}>
          {children}
        </div>
      </SelectContext.Provider>
  )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext)

  return (
      <button
          ref={ref}
          type="button"
          className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
          )}
          onClick={() => context?.setOpen(!context.open)}
          {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & {
  placeholder?: string
}
>(({ className, placeholder, ...props }, ref) => {
  const context = React.useContext(SelectContext)

  return (
      <span
          ref={ref}
          className={cn("block truncate", className)}
          {...props}
      >
      {context?.value || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext)

  if (!context?.open) return null

  return (
      <div
          ref={ref}
          className={cn(
              "absolute top-full z-50 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
              className
          )}
          {...props}
      >
        {children}
      </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
  value: string
}
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext)
  const isSelected = context?.value === value

  const handleClick = () => {
    context?.onValueChange(value)
    context?.setOpen(false)
  }

  return (
      <div
          ref={ref}
          className={cn(
              "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              className
          )}
          onClick={handleClick}
          {...props}
      >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
        {children}
      </div>
  )
})
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}