import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../controllers/video.controller.js"
import { User } from "../models/user.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const currentUser = req.user?._id ; 

    const alreadyLiked = await Like.findOne({
        $and: [{ likedBy: currentUser }, { video: videoId }]
    })

    if( alreadyLiked ){
        // delete that documents

        await Like.deleteOne( alreadyLiked );
        return res.status(201).json(
            new ApiResponse(200 ,{} , "user unLiked the video successfully")
        )

    } else {

        const likedDocument = await Like.create( {
            video : videoId , 
            likedBy : currentUser , 
            comment : "" , 
            tweet : ""
        })

        if( !likedDocument ){
            throw new ApiError( 400 , "failed to like the video" )
        }

        return res.status(201).json(
            new ApiResponse(201 ,likedDocument , "user Liked the video successfully")
        )

    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    const currentUser = req.user?._id ; 

    const alreadyLiked = await Like.findOne({
        $and: [{ likedBy: currentUser }, { comment: commentId }]
    })

    if( alreadyLiked ){
        // delete that documents

        await Like.deleteOne( alreadyLiked );
        return res.status(201).json(
            new ApiResponse(200 ,{} , "user unLiked the comment successfully")
        )

    } else {

        const likedDocument = await Like.create( {
            comment : commentId , 
            likedBy : currentUser , 
            video : "" , 
            tweet : ""
        })

        if( !likedDocument ){
            throw new ApiError( 400 , "failed to like the comment" )
        }

        return res.status(201).json(
            new ApiResponse(201 ,likedDocument , "user Liked the comment successfully")
        )

    }


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on twee
    t
    const currentUser = req.user?._id ; 

    const alreadyLiked = await Like.findOne({
        $and: [{ likedBy: currentUser }, { tweet: tweetId }]
    })

    if( alreadyLiked ){
        // delete that documents

        await Like.deleteOne( alreadyLiked );
        return res.status(201).json(
            new ApiResponse(200 ,{} , "user unLiked the video successfully")
        )

    } else {

        const likedDocument = await Like.create( {
            tweet : tweetId , 
            likedBy : currentUser , 
            video : "" , 
            comment : ""
        })

        if( !likedDocument ){
            throw new ApiError( 400 , "failed to like the tweet" )
        }

        return res.status(201).json(
            new ApiResponse(201 ,likedDocument , "user Liked the tweetId successfully")
        )

    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const currentUser = req.user?._id ; 

    const likedVD = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(currentUser)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "likedBy",
                as: "LikedVideosList",
                pipeline: [
                    {
                        $lookup: {
                            from: "videos",
                            localField: "video", // local file = like document
                            foreignField: "_id",
                            as: "video",
                            pipeline: [
                                {
                                    $project: {
                                        videoFile: 1,
                                        thumbnail: 1,
                                        title: 1,
                                        description: 1,
                                        duration: 1,
                                        views: 1,
                                        isPublished: 1,
                                        owner: 1,
                                        createdAt: 1,
                                        updatedAt: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            video:{
                                $first: "$video"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            likedVD[0].LikedVideosList,
            "Watch history fetched successfully"
        )
    )

    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}