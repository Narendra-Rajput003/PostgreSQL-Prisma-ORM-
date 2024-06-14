import prisma from "../db/db_config.js";
import {getCache,setCache,deleteCache} from "../utils/cache.js"

export const createPost=async(req,res)=>{

    try {

        const {user_id,title,description}=req.body;
        const newPost=await prisma.post.create({
            data:{
                user_id:Number(user_id),
                title,
                description
            }
        })

        return res.status(201).json({
            message: "Post created successfully",
            newPost
        })

        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error"
        })
        
    }

}


export const getPosts=async(req,res)=>{
    try {
        const cacheKey="all_posts";
        const cacheData=await getCache(cacheKey);

        if(cacheData){
            return res.status(200).json({
                message: "Posts retrieved successfully",
                data:cacheData
            })
        }

        const allPosts=await prisma.post.findMany();
        await setCache(cacheKey,allPosts);
        return res.status(200).json({
            message: "Posts retrieved successfully",
            data:allPosts
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error"
        })

    }
}

export const getPost=async(req,res)=>{

    try {
        const {id}=req.body;
        const post=await prisma.post.findUnique({
            where:{
                id:Number(id)
            }
        })

        return res.status(200).json({
            message: "Post retrieved successfully",
            post
        })

}catch(error){
    console.error(error)
    return res.status(500).json({
        message: "Internal server error"
    })

}
}

export const updatePost=async(req,res)=>{

    try {
        
        const {user_id,title,description}=req.body;
        const updatedPost=await prisma.post.update({
            where:{
                id:Number(user_id)
            },
            data:{
                title,
                description
            }
        })

        return res.status(200).json({
            message: "Post updated successfully",
            updatedPost
        })

    } catch (error) {

        console.error(error)
        return res.status(500).json({
            message: "Internal server error"
        })
        
    }

}


export const getUserWithPost=async(req,res)=>{
    try {

        const user_id=req.params.id;

        const user=await prisma.user.findMany({
            where:{
                id:Number(user_id)
            },
            include:{
                post:{
                    select:{
                        title:true,
                        description:true,
                        comment_count:true,
                        id:true,
                        comment:{
                            select:{
                                user_id:true,
                                content:true,
                                id:true
                            }
                        }
                    }
                }
            }
            
        })
        return res.status(200).json({
            message: "User with his post retrieved successfully",
            user
        })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error"
        })
        
    }
}


export const deletePost=async(req,res)=>{
    try {
        // fetch the user of particular with post id
        const user_id=req.params.id;
        const {id}=req.body;
        const user=await prisma.user.findUnique({
            where:{
                id:Number(user_id)
            },
            include:{
                post:true
            }
        })
        // delete the post

        const deletedPost=await prisma.post.delete({
            where:{
                id:Number(id)
            }
        });
        console.log("deletedPost",deletePost);
        return res.status(200).json({
            message: "Post deleted successfully",
            deletedPost
        })

    } catch (error) {

        console.error(error)
        return res.status(500).json({
            message: "Internal server error"
        })
        
    }
}

