import { MAX_PROFILE_IMAGE_SIZE } from "@/constants/common.constants";
import { z } from "zod";

export const createChannelSchema = z.object({
  topic: z
    .string()
    .min(1, "Channel topic is required")
    .max(15, "Channel topic can't be more than 15 characters."),
  description: z.string(),
  channelAvatar: z
    .custom<FileList>()
    .optional()
    .transform((file) =>
      file != null ? file.length > 0 && file.item(0) : undefined
    )
    .refine(
      (file) => !file || (!!file && file.size <= MAX_PROFILE_IMAGE_SIZE),
      {
        message: "Profile Picture cannot be more than 1MB in size",
      }
    )
    .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
      message: "Profile picture needs to be an image",
    }),

    // add channel users later
});
