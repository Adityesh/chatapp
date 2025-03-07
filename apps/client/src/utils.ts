import { cva } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookie from 'js-cookie'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getNameInitials(fullName: string) {
  const [first, last] = fullName.split(" ");
  return (first ? first.charAt(0) : "") + (last ? last.charAt(0) : "");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function objToQuery(obj: any) {
  const objCopy = structuredClone(obj)
  for (const key in obj) {
    if (objCopy[key] == null) delete objCopy[key];
  }
  return "?" + new URLSearchParams(objCopy).toString();
}

export function getUsersTyping(users: string[]) {
  if (users.length === 0) return "";
  if (users.length === 1) return users[0] + " is typing";
  return users.join(",") + " are typing";
}

export function convertObjectToFormData(obj: any) {
  const formData = new FormData();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      formData.append(key, obj[key]);
    }
  }
  return formData;
}

export function checkAuthenticatedUser() {
  return !!Cookie.get('valid_session')
}
