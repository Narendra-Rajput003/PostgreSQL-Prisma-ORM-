import { Redis } from "ioredis";

const redis = new Redis({
    host: "redis-18736.c232.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 18736,
    password: "ecT2fWE7YExHcP7eJ6WARcgc7JxdaTBd",
  });

  
  redis.on("connect",()=>{
    console.log("Redis connected")
  })

  redis.on("error",(err)=>{
    console.log(err)
  })


export const getCache=async(key)=>{

    const cacheData=await redis.get(key);
    // if data in cache then return response

    return cacheData? JSON.parse(cacheData) : null;



}

export const setCache=async(key,data,ttl=60)=>{

    // set data in cache with key and ttl
    await redis.set(key,JSON.stringify(data), "EX", ttl);


}

export const deleteCache=async(key)=>{
  // delete data from cache
    await redis.del(key);
}


  export default {getCache,setCache,deleteCache};