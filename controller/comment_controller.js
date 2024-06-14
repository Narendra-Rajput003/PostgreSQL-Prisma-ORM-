import { Prisma , PrismaClient} from "@prisma/client";
import prisma from "../db/db_config.js";
import {getCache,setCache} from "../utils/cache.js"



export const createComment=async(req,res)=>{
    try {
        const {content,user_id,post_id}=req.body;
       

        // increase the comment count 

        await prisma.post.update({
            where:{
                id:Number(post_id)
            },
            data:{
                comment_count:{
                    increment:1
                }
            }
        })
        
        const comment=await prisma.comment.create({
            data:{
                content,
                user_id,
                post_id
            }
        })
        console.log("comment",comment)
        res.status(201).json({
            message:"comment created",
            comment
        })
    } catch (error) {
        console.log("error",error)
        res.status(500).json({
            message:"error in creating comment",
            error
        })
        
    }
}


export const getUserWithPostsAndComments =async(req,res)=>{
    try {
        const {id}=req.params;
        const cacheKey=`userWithPostsAndComments:${id}`
        const cachedData=await getCache(cacheKey)

        if(cachedData){
            console.log("cache hit")
            res.status(200).json({
                message:"user with post with comment",
                cachedData
            })
            return
        }
        console.log("id",id)

        const user=await prisma.user.findUnique({
            where:{
                id:Number(id)
            },
            include:{
                post:{
                    include:{
                        comment:true,
                        user_id:true
                    }
                }
            }
        })

        if(!user){
            res.status(404).json({
                message:"user not found"
            })
            return
        }

        await setCache(cacheKey,user);

        
        res.status(200).json({
            message:"user with post with comment",
            user
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"error in getting user with post with comment",
            error
        })
    }
}


export const deleteComment = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Delete the comment
      const deletedComment = await prisma.comment.delete({
        where: {
            id:'f524f654-f15f-4f72-b1f5-e957c309aa7c'// or Prisma.db.uuidFromString(id) if id is a UUID
        },
      });
  
      // Update the comment_count in the associated post
      const { post_id } = deletedComment;
      await prisma.post.update({
        where: {
          id: post_id,
        },
        data: {
          comment_count: {
            decrement: 1,
          },
        },
      });
  
      res.status(200).json({
        message: "Comment deleted successfully",
        deletedComment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error deleting comment",
        error,
      });
    }
  };
  