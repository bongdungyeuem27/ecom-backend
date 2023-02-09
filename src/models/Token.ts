import { Schema, model } from "mongoose";

export type IToken = {
  _id: Schema.Types.ObjectId;
  data: string;
};

const tokenSchema = new Schema<IToken>(
  {
    data: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Token = model<IToken>("token", tokenSchema);
