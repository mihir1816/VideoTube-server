import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const currentUser = req.user?._id ; 
    // TODO: toggle subscription

    const alreadySubscribed = await Subscription.findOne({
        $and: [{ subscriber: currentUser }, { channel: channelId }]
    })

    if( alreadySubscribed ){
        // delete that documents

         await Subscription.deleteOne( alreadySubscribed );
        
        return res.status(201).json(
            new ApiResponse(200 ,{} , "user unsubscribed the channel successfully")
        )

    } else {

        const sunscribeDocument = await Subscription.create( {
            subscriber : currentUser , 
            channel : channelId
        })

        if( !sunscribeDocument ){
            throw new ApiError( 400 , "failed to subscribe the channel" )
        }

        return res.status(201).json(
            new ApiResponse(201 ,sunscribeDocument , "user subscribed the channel successfully")
        )

    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "channelId",
                foreignField: "channel",
                as: "SubscriberList",
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].SubscriberList,
            "subscriber list has been fetched successfully"
        )
    )  


})


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "subscriberId",
                foreignField: "subscriber",
                as: "SubscribeToList",
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].SubscriberList,
            "List of channels which user has subscribed fetched successfully"
        )
    )  

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}