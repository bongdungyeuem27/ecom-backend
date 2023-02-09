import { Schema, model } from "mongoose";

export type IUser = {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  phone: string;
  password: string;
  active: boolean;
};

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("user", userSchema);
