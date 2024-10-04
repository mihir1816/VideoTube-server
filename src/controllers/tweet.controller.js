import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content} = req.body ; 

    if( !content ){
        throw new ApiError( 400 , "content is required" )
    }

    const currentUser = req.user?._id
    
    if( !owner ){
        throw new ApiError( 400 , "invalid authorization" )
    }

    const newTweet =await Tweet.create({
        content , 
        owner : currentUser 
    })
    
    if( ! newTweet ){
        throw new ApiError( 500 , "something went wrong while making new tweet " )
    }

    return res.status(201).json(
        new ApiResponse(200 ,newTweet , "tweet generated successfully"   )
    )

})

const getUserTweets = asyncHandler(async (req, res) => {

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "tweetList",
            }
        }
    ])

    if( ! user?.length ){
        throw new ApiError( 404 , "there are no tweets by user" )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].tweetList,
            "user tweets fetched successfully"
        )
    )

    //?????????????????????????????? what will be format of user and why i am doing this  user[0].tweetList, ??
// Copilot
// Good catch! The format of user in your query result will be an array of objects, even if there's only one user matching the criteria. It's because MongoDB aggregation always returns an array. Here’s a sample format:

// json

// [
//   {
//     "_id": "userId",
//     "tweetList": [
//       {
//         "_id": "tweet1",
//         "content": "First tweet",
//         "owner": "userId"
//       },
//       {
//         "_id": "tweet2",
//         "content": "Second tweet",
//         "owner": "userId"
//       }
//     ]
//   }
// ]
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { newContent } = req.body 
    //TODO: update tweet

    const tweet = Comment.findByIdAndUpdate( 
        tweetId , 
        {
            $set : {
                content : newContent
            }
        } , 
        {
            new : true
        }
     )

    return res.status(200)
    .json( 
        new ApiResponse(200 ,{} , "tweet updated successfully"  )
     )


})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: delete tweet

    try {
        const result = await Video.findByIdAndDelete(tweetId);
        if (result) {
          console.log("tweet deleted successfully");
        } else {
          console.log("tweet not found");
        }
      } catch (err) {
        throw new ApiError( 400 , "error while deleting tweet" + err )
      }
      
      return res.status(200)
      .json( 
          new ApiResponse(200 , {} , "tweet deleted successfully"  )
       )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
