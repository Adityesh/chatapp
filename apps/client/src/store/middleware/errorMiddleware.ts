import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import { BaseApiResponse } from "shared";
import { toast } from "sonner";

/**
 * Log a warning and show a toast!
 */
export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.error(action.payload);
    toast.error(
      (
        (action.payload as { data: BaseApiResponse<boolean> })
          .data as BaseApiResponse<boolean>
      )?.error?.message || "Failed to perform request.",
    );
  }
  return next(action);
};
