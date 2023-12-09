import User, { IUser } from "../model/User.model";
import { Request, Response } from "express";

// Your ILikeFact should match this structure
interface ILikeFact {
  text: string;
  year: string;
  image: string;
  imageSize: {
    height: number;
    width: number;
  };
}
 interface IUserRequest extends Request {
  params: { userId: string };
  body: { userId: string; likedFact: ILikeFact };
}

export const getAUser = async (req: IUserRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    return res.status(200).json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
};

export const likeAfact = async (req: IUserRequest, res: Response) => {
  try {
    const { userId, likedFact } = req.body;
    let user = await User.findOne({ userId });

    if (!user) {
      const newUser = new User({
        userId,
        likes: [likedFact],
      });
      await newUser.save();
      return res.status(200).json(newUser);
    }

    const sameFact = user.likes.some((fact) => fact.text === likedFact.text);
    if (!sameFact) {
      user.likes.push(likedFact);
      await user.save();
    }

    return res.status(200).json(user);
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
}  
