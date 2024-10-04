import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const {channelId} = req.params ; 

    const channelOwner =await User.findOne( channelId )
    if( !channelOwner ){
        throw new ApiError( 400 ,"invalid channel id" )
    }

    const allSubscribers = Subscription.find( {
        channel : channelId 
    } )
    const totalSubscribers = allSubscribers.length

    const allVideos = await Video.find({
        owner : channelId
    })
    const totalVideos = allVideos.length 
    const totalViews = 0 ; 
    allVideos.forEach((element) => (
        totalViews = totalViews + element.views
    ));

    const totalLikesOnVideos = 0 ; 
    allVideos.forEach( async (element) => {
        const likesOnThisVideo = await Like.find({
            video : element._id 
        } ) 
        totalLikesOnVideos = totalLikesOnVideos + likesOnThisVideo.length
    });

    const totalLikesOnTweet = 0 ; 
    allVideos.forEach(async (element) => {
        const likesOnThisTweet =await Like.find({
            video : element._id 
        } ) 
        totalLikesOnTweet = totalLikesOnTweet + likesOnThisTweet.length
    });

    const totalLikesOnChannel = totalLikesOnTweet + totalLikesOnVideos ; 

    return res.status(200).json(
        new ApiResponse(200 ,
            {
                totalSubscribers , 
                totalVideos , 
                totalLikesOnChannel , 
                totalViews
            } ,
             "channel states has been generated"   )
    )


})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const {channelId} = req.params ; 

    const channelOwner =await User.findOne( channelId )
    if( !channelOwner ){
        throw new ApiError( 400 ,"invalid channel id" )
    }

    // use pipeline or directly by find (array)

    const allVideos = await Video.find({
        owner : channelId
    })

    return res.status(201).json(
        new ApiResponse(200 ,allVideos , "all videos fetched successfully"   )
    )

})

export {
    getChannelStats, 
    getChannelVideos
}