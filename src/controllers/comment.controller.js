import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

   const getPaginatedComment = async (page, limit) => {
    
        const currentVideoQuery = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "videoId",
                    foreignField: "video",
                    as: "commentList",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "personWhoComment",
                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                owner:{
                                    $first: "$owner"
                                }
                            }
                        }
                    ]
                }
            } , 
            {
                $sort: {
                    createdAt: -1, // by descending
                    title: 1, // [A-Z] by ascending
                    [sortBy]: sortType,
                    views: -1,
                }
            }
        ])

        const options = {
            page,
            limit,
        };
  
      const result = await Video.aggregatePaginate(currentVideoQuery , options);
      return result;
} 

    getPaginatedComment(page, limit)
        .then((result) => {
            return res
            .status(200)
            .json(
                new ApiResponse( 200 , result , "all comments are loaded successfully" )
            )
        })
        .catch((err) => {
            console.error(err);
        });

})

const addComment = asyncHandler(async (req, res) => {

    // TODO: add a comment to a video
    const {commentContent} = req.body ;
    const {videoId} = req.params ; 
    const userId = req.user?._id ;

    if( !commentContent ){
        throw new ApiError(400 , "comment content is required"  )
    }

    if( !videoId?.trim() || !userId ){
        throw new ApiError( 400 , "invalid video id or invalid user" )
    }

    const newComment = await Comment.create({
        content : commentContent , 
        video : videoId , 
        owner : userId
    })

    if( ! newComment ){
        throw new ApiError( 500 , "something went wrong while adding new comment" )
    }

    return res.status(200).json(
        new ApiResponse(200 , newComment , "comment added successfully"   )
    )
    
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {commentId} = req.params ;
   
    if( ! commentId ){
        new ApiError( 400 , "invalid comment id" )
    }

    const { newContent } = req.body ;

    if( ! newContent ){
        new ApiError( 400 , "content required to update comment" )
    }

    const updatedComment = Comment.findByIdAndUpdate( 
        commentId , 
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
        new ApiResponse(200 ,updatedComment , "comment content updated successfully"  )
     )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params ;
    
    if( ! commentId ){
        new ApiError( 400 , "invalid comment id" )
    }

    const result = Comment.findByIdAndDelete( commentId ) ; 

    if( ! result ){
        new ApiError( 500 , "error while deleting comment" )
    }

    return res.status(200).json(
        new ApiResponse(200 , {} , "comment deleted successfully"   )
    )

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
