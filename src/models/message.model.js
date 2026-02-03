// models/message.model.js
import { z } from "zod";
import { Timestamp } from "firebase/firestore";

export const MessageSchema = z.object({
  senderId: z.string(),
  text: z.string().min(1),
  createdAt: z.instanceof(Timestamp).optional(),
});

export const createMessageModel = (data) => ({
  ...MessageSchema.parse(data),
  createdAt: Timestamp.now(),
});
