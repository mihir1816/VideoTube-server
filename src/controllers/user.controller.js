import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
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
    // console.log( req.files )

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

    const avatarLocal = req.files?.avatar && req.files.avatar[0]?.path
     // const coverImageLocal = req.files?.coverImage[0]?.path

     let coverImageLocalPath;
     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
         coverImageLocalPath = req.files.coverImage[0].path;
     } else {
         coverImageLocalPath = ""; // or handle missing cover image case
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

    console.log(user , user._id)

    // we have to use "user" that we have found not the "User"
    // beacause we have created pass checker meathod for our own user 

    const isPasswordValid = await user.isPasswordCorrect(password)
    if( ! isPasswordValid ){
        throw new ApiError(401 , "password is not valid"  )
    }

    console.log(password)

    const {accessToken , refreshToken} =await generateAccessAndRefereshTokens(user._id)

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

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


const refreshAccessToken = asyncHandler( async (req , res) =>{

    const incomingRefreshToken = req.cookies.refreshToken 
                            || req.body.refreshToken

    if(!incomingRefreshToken ){
        throw new ApiError( 401 , "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify( incomingRefreshToken ,process.env.REFRESH_TOKEN_SECRET  )
    
        const user = await User.findById(decodedToken?._id)
    
        if( !user ){
            throw new ApiError( 401 , "invalid refresh token")
        }
    
        if( incomingRefreshToken !== user.refreshToken ){
            throw new ApiError( 401 , "refresh token is expired or used")
        }
    
        const options = {
            httpOnly : true , 
            secure : true 
        } 
        const {accessToken , newRfreshToken } = await generateAccessAndRefereshTokens(user._id)
    
        return res.status(200)
        .cookie("accessToken" ,accessToken , options )
        .cookie( "newRfreshToken" , newRfreshToken , options )
        .json( 
            new ApiResponse( 200 ,{accessToken , newRfreshToken} ,  "access token erefreshed successfully" )
         )
    } catch (error) {
        throw new ApiError( 401 , error?.message || "invalid refresh token")
    }

} )

const changeCurrentPassword =asyncHandler( async (req , res) =>{
    const {oldPassword , newPassword } = req.body ; 

    const user = await User.findById(req.user?._id) ; 
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword) ; 

    if( ! isPasswordCorrect ){
        throw new ApiError( 400 , "invalid old password" )
    }

    user.password = newPassword 
     await user.save({
        validateBeforeSave : false  
    })

    return res.status(200)
    .json( 
        new ApiResponse(200 , {} , "password changes successfully"  )
     )


} )

const getCurrentUser = asyncHandler ( async (req , res) =>{
    return req.status(200).json( 200 , req.user , "current user fetched successfully" )
} )

const updateAccountDetails = asyncHandler( async (req , res) =>{
    const { fullName , email ,  } = req.body ; 

    if( !fullName || !email ){
        throw new ApiError( 400 , "all fields are required" )
    }

    const user = await User.findByIdAndUpdate(
         req.user?._id , 
         {
            $set : {
                fullName , 
                email : email 
            }
         } , 
         {new :true }
     ).select("-password")  

     return res
     .json( 
        new ApiResponse(200 ,user , "account details updated successfully"  )
     )

} )

const updateUserAvatar = asyncHandler( async(  req , res) =>{
    const avatarLocalPath = req.file?.path
    if( ! avatarLocalPath ){
        throw new ApiError( 400 , "avater file is missing" )
    }

    const avatar = await uploadOnCloudinary( avatarLocalPath )

    if( !avatar.url ){
        throw new ApiError( 400 , "error while uploading avatar on cloudinary" )
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id , 
        {
           $set : {
               avatar : avatar.url
           }
        } , 
        {new :true }
    ).select("-password")  
    
    return res
    .json( 
       new ApiResponse(200 ,user , "avatar updated successfully"  )
    )
} )


const updateUserCoverImage = asyncHandler( async(  req , res) =>{
    const CoverImageLocalPath = req.file?.path
    if( ! CoverImageLocalPath ){
        throw new ApiError( 400 , "CoverImage file is missing" )
    }

    const CoverImage = await uploadOnCloudinary( CoverImageLocalPath )

    if( !CoverImage.url ){
        throw new ApiError( 400 , "error while uploading avatar on cloudinary" )
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id , 
        {
           $set : {
            CoverImage : CoverImage.url
           }
        } , 
        {new :true }
    ).select("-password")  
    
    return res
    .json( 
       new ApiResponse(200 ,user , "CoverImage updated successfully"  )
    )
} )


export {
    registerUser , 
    loginUser , 
    logoutUser , 
    refreshAccessToken , 
    changeCurrentPassword , 
    getCurrentUser , 
    updateAccountDetails , 
    updateUserCoverImage
}

