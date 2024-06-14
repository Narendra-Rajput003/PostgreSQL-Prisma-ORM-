import {Router} from "express"
import { createUser,getAllUser,updateUser , deleteUser} from "../controller/user_controller.js";

const route=Router();



route.post("/create-user",createUser);
route.get("/getallUsers",getAllUser);
route.put("/:id",updateUser);
route.delete("/delete-comment",deleteUser)


export default route;



