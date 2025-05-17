import { cva } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookie from "js-cookie";
import { InfiniteQueryConfigOptions } from "@reduxjs/toolkit/query";
import {
  BaseChannelDto,
  ClassProperties,
  PaginatedSearchQuery,
  UserStatus,
} from "shared";
import { SocketSliceState } from "@/types/socketSlice.types.ts";

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
  },
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
  const objCopy = structuredClone(obj);
  for (const key in obj) {
    if (objCopy[key] == null) delete objCopy[key];
  }
  return "?" + new URLSearchParams(objCopy).toString();
}

export function convertObjectToFormData(obj: any) {
  const formData = new FormData();
  for (const key in obj) {
    const value = obj[key];
    if(value) {
      formData.append(key, value);
    }
  }
  return formData;
}

export function checkAuthenticatedUser() {
  return !!Cookie.get("valid_session");
}

export function stringToCapitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function getInfiniteQueryOptions<
  T extends {
    data: any;
  },
>(): InfiniteQueryConfigOptions<T, number> {
  return {
    initialPageParam: 1,
    getNextPageParam: ({ data }, _allPages, lastPageParam) => {
      const totalPages = data && data?.meta?.totalPages;
      const currentPage = data && data?.meta?.currentPage;
      if (totalPages && totalPages === currentPage) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, _allPages, firstPageParam) => {
      const currentPage = firstPage && firstPage?.data?.meta?.currentPage;
      if (currentPage === 1) return undefined;
      return firstPageParam - 1;
    },
  };
}

export function generatePaginationFilterObj(
  obj: PaginatedSearchQuery["filter"],
) {
  const newObj = {} as PaginatedSearchQuery["filter"];
  for (const key in obj) {
    if (newObj) {
      newObj["filter." + key] = obj[key];
    }
  }
  return newObj;
}

export function getUserPresenceColor(
  lastSeen: Date | null | undefined,
  status?: UserStatus | null,
) {
  if (!lastSeen || !status || status === "disconnected")
    return "border-red-500";
  switch (status) {
    case "online":
      return "border-green-500";
    case "away":
      return "border-yellow-500";
    default:
      return "border-red-500";
  }
}

export function getUsersTyping(
  usersTyping: SocketSliceState["usersTyping"],
  channel: ClassProperties<typeof BaseChannelDto>,
  channelId: number,
) {
  const userIds = usersTyping[channelId];
  if (!userIds || !channel) return "";
  if (userIds.length > 2) return "Several people are typing...";

  const channelUsers = channel.users
    .map((cu) => cu.user)
    .filter((user) => userIds.includes(user.id))
    .map((user) => user.fullName);

  if (channelUsers.length === 0) return "";
  return channelUsers.length === 1
    ? `${channelUsers[0]} is typing...`
    : `${channelUsers.join(",")} are typing...`;
}
