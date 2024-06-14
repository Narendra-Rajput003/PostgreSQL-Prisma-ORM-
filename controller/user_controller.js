import prisma from "../db/db_config.js";
import bcrypt from "bcrypt";
import { getCache, setCache, deleteCache } from "../utils/cache.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // find the user if already exists or not
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (findUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // create the user
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      },
    });
    return res.status(200).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.json(500).json({
      message: "Error in create user controller",
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    // check if user is in cache or not

    const cacheKey = "all_users";
    const cacheValue = await getCache(cacheKey);

    if (cacheValue) {
      return res.status(200).json({
        message: "Users fetched from cache",
        data: cacheValue,
      });
    }

    // check if user is not cache then set cache
    const allUsers = await prisma.user.findMany({
      // include:{
      //   post:{
      //     select:{
      //       title:true,
      //       description:true,
      //       comment_count:true
      //     }
      //   }
      // }

      // select:{
      //   _count:{
      //     select:{
      //       post:true,
      //       comment:true
      //     }
      //   }
      // }
    });
    await setCache(cacheKey, allUsers);

    return res.status(200).json({
      message: "Users fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in get all user controller",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId =Number(req.params.id);
    console.log(userId)
    const { name, email, password } = req.body;
    console.log(name,email,password)

    const user=await prisma.user.findUnique({
        where:{
            id:Number(userId)
        }
    })

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    
      const updateUser=await prisma.user.update({
        where:{
            id:Number(userId)
        },
        data:{
            name:name,
            email:email,
            password:password
        }
      })

      await deleteCache("all_users");

    return res.status(200).json({
      message: "User updated successfully",
      data: updateUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "update user error throws",
    });
  }
};


export const deleteUser=async(req,res)=>{
    try {
        
        const userId=Number(req.params.id);
        const user=await prisma.user.findUnique({
            where:{
                id:Number(userId)
            }
        })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

          const deleteUser=await prisma.user.delete({
            where:{
                id:Number(userId)
            }
          })

          await deleteCache("all_users");

          return res.status(200).json({
            message: "User deleted successfully",
            data: deleteUser,
          });

    } catch (error) {
      console.error(error)
        return res.status(500).json({
            message: "delete user error throws",
        });
        
    }
}