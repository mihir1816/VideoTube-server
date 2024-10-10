import mongoose , {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 2 } = req.query; // Default page 1 and limit 10

    // Check if videoId is a valid MongoDB ObjectId
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video object Id");
    }

    try {
        // Define the aggregation pipeline
        const aggregationQuery = Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId), // Match comments for the given video
                },
            },
            {
                $sort: {
                    createdAt: -1, // Sort by newest comments first
                },
            },
        ]);

        // Use aggregatePaginate to paginate the results
        const options = {
            page: parseInt(page),   // Current page
            limit: parseInt(limit), // Limit of results per page
        };

        const result = await Comment.aggregatePaginate(aggregationQuery, options);

        // Send response with paginated comments
        return res.status(200).json(
            new ApiResponse(200, result, "All comments are loaded successfully")
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json(new ApiError(500, "Failed to load comments"));
    }
});

const addComment = asyncHandler(async (req, res) => {

    // TODO: add a comment to a video
    const {commentContent} = req.body
    const {videoId} = req.params ; 
    const userId = req.user?._id ;

    if (!isValidObjectId(videoId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }  

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
   
    if (!isValidObjectId(commentId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const { newContent } = req.body ;

    if( ! newContent ){
        new ApiError( 400 , "content required to update comment" )
    }

    const updatedComment = await Comment.findByIdAndUpdate( 
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
        new ApiResponse(200 ,updatedComment.toObject() , "comment content updated successfully"  )
     )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params ;
    
    if (!isValidObjectId(commentId)) {
        throw new ApiError( 400 , "invalid tweet object Id" )
    }

    const result = await Comment.findByIdAndDelete( commentId ) ; 

    console.log(result) ;

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
