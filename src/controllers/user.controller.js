import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler ( async (req , res)=>{
    // res.status(200).json({
    //     message : "ok"
    // })

    const { fullName , email , username , password  } = req.body
    console.log("email" , email) ; 

    if( 
        [fullName , email ,username , password ].some( (feild) => 
            feild?.trim() === ""
        )
     ) {
        throw new ApiError( 400 , "all feilds are required" ) 
    }

    const existedUser = User.findOne( {
        $or : [{username} , {email}]
    } )

    if( existedUser ){
        throw new ApiError( 409 ,"user with email or username is already exist" )
    }

    const avatarLocal = req.files?.avatar[0]?.path 
    const coverImageLocal = req.files?.coverImage[0]?.path

    if( !avatarLocal  ){
        throw new ApiError( 400 , "avatar is required" )
    }

    const avatar = await uploadOnCloudinary(avatarLocal)
    const coverImage = await uploadOnCloudinary(coverImageLocal)
    
    if( ! avatar ){
        throw new ApiError( 400 , "avatar is required" )
    }

    const newuser = await User.create({
        fullName , 
        avatar : avatar.url , 
        coverImage : coverImage?.url || "" ,
        email , 
        password , 
        username : username.toLowerCase()
    })

    const createdUser = await User.findById( newuser._id ).select(
        "-password -refreshToken"
    )

    if( ! createdUser ){
        throw new ApiError( 500 , "something went wrong while registering the user " )
    }

    return res.status(201).json(
        new ApiResponse(200 ,createdUser , "user registered successfully"   )
    )

} )

export {registerUser}

