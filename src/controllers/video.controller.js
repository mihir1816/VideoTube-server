import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // body object can be look like this ...

  // {
  //     page: 1 ,          // Page number
  //     limit: 10 ,         // Number of items per page
  //     query: '',    // Search query
  //     sortBy: 'durationInSeconds',// Field to sort by
  //     sortType: -1 ,   // Sort direction (ascending or descending)
  //     userId: '12345'     // User-specific filter
  // }

  //TODO: get all videos based on query, sort, pagination

  const getPaginatedVideos = async (page, limit) => {

    const aggregateQuery = Video.aggregate([
      {
        $match: {
          duration: { $gt: 20 },
          owner: new mongoose.Types.ObjectId(userId),
        },
      }, // Filter documents by duration > 20 seconds

      {
        $sort: {
          createdAt: -1, // by descending
          title: 1, // [A-Z] by ascending
          [sortBy]: sortType,
          views: -1,
        },
      }, // Sort by createdAt in descending order
    ]);

    const options = {
      page,
      limit,
    };

    const result = await Video.aggregatePaginate(aggregateQuery, options);
    return result;
  };


  getPaginatedVideos(page, limit)
    .then((result) => {
      return res
      .status(201)
      .json(
        new ApiResponse( 200 , result , "all videos are loaded successfully" )
      )
    })
    .catch((err) => {
      console.error(err);
    });
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (title?.trim() === "" || description?.trim() === "") {
    throw new ApiError(400, "title and description are required");
  }

  const videoLocalPath = req.files?.videoFile && req.files?.videoFile[0]?.path;
  const thumbnailLocalPath =
    req.files?.thumbnail && req.files?.videoFile[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "video or thumbnail are required");
  }

  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!video || !thumbnail) {
    throw new ApiError(400, "video or thumbnail is not uploded on cloudinary");
  }

  const videoOwner = req.user?._id;

  const durationInSeconds = video?.duration;
  // const hours = Math.floor(seconds / 3600);
  // const minutes = Math.floor((seconds % 3600) / 60);
  // const secs = seconds % 60;
  // const duration = [
  //     hours.toString().padStart(2, '0'),
  //     minutes.toString().padStart(2, '0'),
  //     secs.toString().padStart(2, '0')
  // ].join(':') ;

  const newVideo = await Video.create({
    videoFile: video?.url,
    thumbnail: thumbnail?.url,
    title,
    description,
    duration: durationInSeconds,
    views: 0,
    isPublished: true,
    owner: videoOwner,
  });

  const createdVideo = await User.findById(newVideo._id).select("-isPublished");

  if (!createdVideo) {
    throw new ApiError(500, "something went wrong while uploading video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id

  const searchedVideo = await Video.findById(videoId).select("-isPublished");
  return req
    .status(200)
    .json(new ApiResponse(200, createdUser, "video searched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  //TODO: update video details like title, description, thumbnail

  const searchedVideo = await Video.findById(videoId);

  if (title.trim() !== "") {
    searchedVideo.title = title;
  }
  if (description.trim() !== "") {
    searchedVideo.description = description;
  }
  // here can be error
  const thumbnailLocalPath = req.file?.thumbnail[0].path;
  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
      throw new ApiError(
        400,
        "error while uploading thumbnail on cloudinary during updating thumbnail"
      );
    }
    searchedVideo.thumbnail = thumbnail.url;
  }

  await searchedVideo.save({
    validateBeforeSave: false,
  });

  return res.json(
    new ApiResponse(200, searchedVideo, "video details updated successfully")
  );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video

  try {
    const result = await Video.findByIdAndDelete(videoId);
    if (result) {
      console.log("Video deleted successfully");
    } else {
      throw new ApiError(400, "this video doesn't exist" + err);
    }
  } catch (err) {
    throw new ApiError(400, "error while deleting video" + err);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const searchedVideo = await Video.findById(videoId);
  if (!searchedVideo) {
    throw new ApiError(400, "invalid video id");
  }
  const videoOwner = searchedVideo?.owner;
  const currentUser = req.user?.username;

  if (videoOwner !== currentUser) {
    throw new ApiError(
      400,
      "current user is not owner of this video , so user cannot change in publishification of the video"
    );
  }

  searchedVideo.isPublished = !searchedVideo.isPublished;

  await searchedVideo.save({
    validateBeforeSave: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "isPublish toggled successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
