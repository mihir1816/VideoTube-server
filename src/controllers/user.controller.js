import { asyncHandler } from "../utils/asyncHandler.js";

import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAcsessAndRefreshToken = async (userId) =>{
    try {
       const user =  await User.findById(userId)
       const AcsessToken = user.generateAcsessToken()
      const RefreshToken = user.generateRefreshToken()

      user.refreshToken = RefreshToken
      await user.save({validateBeforeSave : false})

      return {AcsessToken , RefreshToken}

    } catch (error) {
        throw new ApiError(500 , "something went wrong while generating refresh and access token"  )
    }
}

const registerUser = asyncHandler ( async (req , res)=>{
     // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    
    console.log( "done")

    const { fullName , email , username , password  } = req.body
    if(!fullName){
        throw new ApiError(400 , "not working");
    }
    // const {avatar , coverImage} =  req.files;
    // // console.log(req.body)
    // console.log(fullName);
    // // console.log(fullName , avatar);
    // console.log("email" , email , avatar) ;


    if( 
        [fullName , email ,username , password ].some( (feild) => 
            feild?.trim() === ""
        )
     ) {
        throw new ApiError( 400 , "all feilds are required" ) 
    }

    const existedUser = await User.findOne( {
        $or : [{username} , {email}]
    } )

    if( existedUser ){
        throw new ApiError( 409 ,"user with email or username is already exist" )
    }

    const avatarLocal = req.files?.avatar[0]?.path  
     // const coverImageLocal = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if( !avatarLocal  ){
        throw new ApiError( 400 , "avatar is required" )
    }

    const avatar = await uploadOnCloudinary(avatarLocal)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
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
        // { "message" : "kridh"}
        new ApiResponse(200 ,createdUser , "user registered successfully"   )
    )

} )

const loginUser = asyncHandler( async (req , res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email , username ,password } = req.body

    if( ! email && ! username ){
        throw new ApiError(400 , "username or email rerquired")
    }

    const user = await User.findOne({
        $or : [{username} , {email}]
    })

    if( ! user ){
        throw new ApiError(401 , "user does not exist"  )
    }

    // we have to use "user" that we have found not the "User"
    // beacause we have created pass checker meathod for our own user 

    const isPasswordValid = await user.isPasswordCorrect(password)

    if( ! isPasswordValid ){
        throw new ApiError(401 , "password is not valid"  )
    }

    const {accessToken , refreshToken} =await generateAcsessAndRefreshToken(user._id)

    const loggedUser = User.findById(user._id)
    .select( "-password -refreshToken" )

    const options = {
        httpOnly : true , 
        secure : true 
    } 

    return res.status(201)
        .cookie("accessToken" , accessToken , options  )
        .cookie("refreshToken" , refreshToken , options)
        .json(
            new ApiResponse(
                200 , 
                {
                    user : loggedUser , accessToken , refreshToken
                } , 
                "User logged in successfully"
            )
        )
  } )

const logoutUser = asyncHandler( async(req , res) => {

    await User.findByIdAndUpdate(
        req.user._id  , 
        {
            $set : {
                refreshToken : undefined
            }   
        } , 
        {
            new : true
        }
    )
 
    const options = {
        httpOnly : true , 
        secure : true 
    } 

    return res.status(200)
    .clearCookie( "accessToken", options )
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse( 200 , {} , "user logged out" )
    )

} )

export {
    registerUser , 
    loginUser , 
    logoutUser
}

