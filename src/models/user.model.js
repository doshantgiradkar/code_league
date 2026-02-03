import { z } from "zod";
import { Timestamp } from "firebase/firestore";

export const UserSchema = z.object({
  name: z.string().min(1),
  age: z.number(),
  email: z.string().email(),
  phoneNumber: z.string(),

  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),

  job: z.string(),
  hobbies: z.array(z.string()),

  createdAt: z.instanceof(Timestamp).optional(),
  updatedAt: z.instanceof(Timestamp).optional(),
});

export const createUserModel = (data) => {
  const parsed = UserSchema.parse(data);

  return {
    ...parsed,
    createdAt: parsed.createdAt || Timestamp.now(),
    updatedAt: parsed.updatedAt || Timestamp.now(),
  };
};
