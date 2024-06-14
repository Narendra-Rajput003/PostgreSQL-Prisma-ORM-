import {Router} from "express"
import { createPost,getPost,getPosts,updatePost,getUserWithPost,deletePost} from "../controller/post_controller.js";

const route=Router();


route.post("/create-post",createPost);
route.get("/get-posts",getPosts);
route.get("/get-post",getPost);
route.put("/update-post",updatePost);
route.get("/user-with-post/:id",getUserWithPost);
route.delete("/delete-post/:id",deletePost);




export default route;