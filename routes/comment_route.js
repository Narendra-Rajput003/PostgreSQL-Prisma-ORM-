import { Router } from "express";

import {createComment,getUserWithPostsAndComments,deleteComment} from "../controller/comment_controller.js"

const router = Router();

router.post("/create-comment",createComment);
router.get("/:id",getUserWithPostsAndComments);
router.delete("/:id",deleteComment);


export default router;