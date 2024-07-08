import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import { BaseApiResponse } from "@repo/shared";
import { toast } from "sonner";

/**
 * Log a warning and show a toast!
 */
export const errorMiddleware: Middleware =
  () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      console.error(action.payload);
      toast.error(
        ((action.payload as any).data as BaseApiResponse)?.error?.message ||
          "Failed to perform request.",
      );
    }
    return next(action);
  };
