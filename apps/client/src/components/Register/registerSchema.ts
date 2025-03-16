import { MAX_PROFILE_IMAGE_SIZE } from "@/constants/common.constants";
import { z } from "zod";

export const registerSchema = z
  .object({
    userName: z
      .string()
      .min(1, "Username is required")
      .min(4, "Username should be atleast 4 characters")
      .max(20, "Username cannot be more than 20 characters"),
    email: z.string().min(1, "Email is required").email("Email is not valid"),
    fullName: z.string().min(1, "Full Name is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password should be atleast 8 characters"),
    avatarUrl: z
      .instanceof(FileList, {
        message: "Please select a file",
      })
      .refine((file) => !!file, "Please select a file.")
      .refine(
        (file) => file && file.size <= MAX_PROFILE_IMAGE_SIZE,
        `Profile picture must be less than 1MB`
      )
      .refine(
        (file) => file && file.type.startsWith("image"),
        "Profile picture must be an image"
      )
      .optional(),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password is not strong enough",
      });
    }
  });

export type RegisterFormSchema = z.infer<typeof registerSchema>;
