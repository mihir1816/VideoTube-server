
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { axiosInstance } from "../helpers/axios.helper.js"
import { parseErrorMessage } from "../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

function LikedVideos() {


  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const renderVideo = async () => {
      try {
        const response = await axiosInstance.get(`/api/likes/videos`);
        toast.success(response.data.message);
        console.log("this responce of liked videos : " + response) ; 
        setVideos(response.data.data);
      } catch (error) {
        toast.error(parseErrorMessage(error.response.data));
        setError(
          error.message || "Failed to fetch videos. Please try again..."
        );
        console.error("side videos are not fetched :", error);
      }
    };
    renderVideo();
  }, []);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      return '0'; // Handle invalid or undefined input
    }
    
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + "B"; // Convert to Billion (B)
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M"; // Convert to Million (M)
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K"; // Convert to Thousand (K)
    } else {
      return num.toString(); // Less than 1000, return as is
    }
  }
   const timeSince = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;

    return `${Math.floor(seconds)} seconds ago`;
  };

  return (
    <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div class="flex flex-col gap-4 p-4">


      {videos && videos.map((video) => (
        <NavLink to={`/video/${video?.video?._id}`}>
        <div key={video._id} className="w-full max-w-3xl gap-x-4 md:flex">
        <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
          <div className="w-full pt-[56%]">
            <div className="absolute inset-0">
              <img
                src={video?.video?.thumbnail}
                alt={video?.video?.title}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
              {formatDuration(video?.video?.duration)}
            </span>
          </div>
        </div>
        <div className="flex gap-x-2 md:w-7/12">
          <div className="h-10 w-10 shrink-0 md:hidden">
            <img
              src={video?.owner?.avatar}
              alt={video?.owner?.username}
              className="h-full w-full rounded-full"
            />
          </div>
          <div className="w-full">
            <h6 className="mb-1 font-semibold md:max-w-[75%]">{video?.video?.title}</h6>
            <p className="flex text-sm text-gray-200 sm:mt-3">
              {formatNumber(video?.video?.views)} Views · {timeSince(new Date(video?.video?.createdAt))}
            </p>
            <div className="flex items-center gap-x-4">
              <div className="mt-2 hidden h-10 w-10 shrink-0 md:block">
                <img
                  src={video?.video?.owner?.avatar}
                  alt={video?.video?.owner?.username}
                  className="h-full w-full rounded-full"
                />
              </div>
              <p className="text-sm text-gray-200">{video?.video?.owner?.username}</p>
            </div>
            <p className="mt-2 hidden text-sm md:block">{video?.video?.description}</p>
          </div>
        </div>
      </div>
      </NavLink>
      ))}


      </div>
    </section>
  );
}

export default LikedVideos;
