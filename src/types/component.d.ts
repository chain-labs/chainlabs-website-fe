import { LucideIcon } from "lucide-react";
import { VariantProps } from "class-variance-authority";

// Button Component Types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

// Sidebar Component Types
export interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export interface SidebarMenuButtonProps extends React.ComponentProps<"a"> {
  asChild?: boolean;
  size?: "default" | "sm" | "lg";
  isActive?: boolean;
  variant?: "default" | "outline";
}

export interface SidebarMenuSubButtonProps extends React.ComponentProps<"a"> {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}

// Sheet Component Types
export interface SheetContentProps
  extends React.ComponentProps<
    typeof import("@radix-ui/react-dialog").Content
  > {
  side?: "top" | "right" | "bottom" | "left";
}

// Input Container Props
export interface InputContainerProps {
  inputValue: string;
  isFocused: boolean;
  isRecording: boolean;
  hasMessages: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
  onToggleRecording: () => void;
}

// Chat Bubble Props
export interface ChatBubbleProps {
  message: ChatMessage;
}

// Feature Card Props
export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Animation Props
export interface MotionProps {
  initial?: object;
  animate?: object;
  exit?: object;
  transition?: object;
  whileHover?: object;
  whileTap?: object;
  layoutId?: string;
}
