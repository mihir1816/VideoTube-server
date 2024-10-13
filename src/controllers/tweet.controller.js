import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getAllTweets = async (req, res) => {
    try {
    
        const tweets = await Tweet.find().populate('owner', 'username avatar'); 
  
      return res.status(201).json(
        new ApiResponse(200 ,tweets , "all tweets fetched successfully"   )
      )
    } catch (error) {
        console.log("error in fetching tweets" + error) ; 
        throw new ApiError(500 , "tweets are not fetched") ; 
    }
  };

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const {content} = req.body ; 

    if( !content ){
        throw new ApiError( 400 , "content is required" )
    }

    const currentUser = req.user?._id
    
    if( !currentUser ){
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

        const { userId } = req.params 

    if (!isValidObjectId(userId)) {
        throw new ApiError( 400 , "invalid channel object Id" )
    }

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
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
    console.log("the new content " + newContent)
    //TODO: update tweet

    if (!isValidObjectId(tweetId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    // getting error in updating by this query.......

    // const tweet = Tweet.findByIdAndUpdate( 
    //     tweetId ,   
    //     {
    //         $set : {
    //             content : newContent
    //         }
    //     } , 
    //     {
    //         new : true
    //     }
    //  )

    
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Cannot find tweet by tweet Id or no valid tweet ID");
    }

    tweet.content = newContent;
    const result = await tweet.save({ validateBeforeSave: false })

    if( !result ){
        throw new ApiError( 500 , "problem while updating tweet" )
     }

    return res.status(200)
    .json( 
        new ApiResponse(200 , result , "tweet updated successfully"  )
     )

})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: delete tweet

    if (!isValidObjectId(tweetId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    try {
        const result = await Tweet.findByIdAndDelete(tweetId);
        if (result) {
          console.log("tweet deleted successfully");
        } else {
          console.log("tweet not found");
        }

        return res.status(200)
      .json( 
          new ApiResponse(200 , {} , "tweet deleted successfully"  )
       )

      } catch (err) {
        throw new ApiError( 400 , "error while deleting tweet" + err )
      }

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet , 
    getAllTweets
}
