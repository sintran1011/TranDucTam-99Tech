import { z } from "zod";

export const swapSchema = z
  .object({
    fromToken: z.string().nonempty({ message: "Token missing" }),
    toToken: z.string().nonempty({ message: "Token missing" }),
    fromAmount: z
      .string()
      .nonempty({ message: "Amount missing" })
      .refine((val) => parseFloat(val) > 0, {
        message: "Amount must be greater than 0",
      }),
    toAmount: z
      .string()
      .nonempty({ message: "Amount missing" })
      .refine((val) => parseFloat(val) > 0, {
        message: "Amount must be greater than 0",
      }),
    assetUser: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.assetUser && parseFloat(val.assetUser) < parseFloat(val.fromAmount))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Your assets not enough !",
        path: ["fromAmount"],
      });
  });
