import mongoose from "mongoose";

interface ILike {
  text: string;
  year: string;
  image: string;
  imageSize: {
    height: number;
    width: number;
  };
}

const likeSchema = new mongoose.Schema<ILike>({
  text: String,
  year: String,
  image: String,
  imageSize: {
    height: Number,
    width: Number,
  },
});

export interface IUser {
  userId: string;
  likes: ILike[];
}

const userSchema = new mongoose.Schema<IUser>({
  userId: { type: String, unique: true },
  likes: [likeSchema],
});

export default mongoose.model<IUser>("User", userSchema);
