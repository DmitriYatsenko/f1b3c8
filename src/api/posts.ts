import { NextFunction, Request, Response } from "express";

import PostModel from "../db/models/post";
import UserPostModel from "../db/models/user_post";
import express from "express";

const router = express.Router();

/**
 * Create a new blog post
 * req.body is expected to contain {text: required(string), tags: optional(Array<string>)}
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { text, tags } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ error: "Must provide text for the new post" });
    }
    // Create new post
    const post = await PostModel.create({
      text,
      tags: tags?.join(","),
    });
    if (req.user?.id) {
      await UserPostModel.create({
        userId: req.user.id,
        postId: post.id,
      });
    }
    res.json({ post });
  } catch (error) {
    next(error);
  }
});

export default router;
