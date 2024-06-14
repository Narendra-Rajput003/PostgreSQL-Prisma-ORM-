import express from "express";
const app=express();


import userRoutes from "./routes/user_route.js"
import postRoutes from "./routes/post_route.js"
import commentRoutes from "./routes/comment_route.js"

const PORT=process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({extended:false}))


app.use("/api/v1/user",userRoutes);
app.use("/api/v1/post",postRoutes);
app.use("/api/v1/comment",commentRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
