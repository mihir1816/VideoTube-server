import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { axiosInstance } from "../helpers/axios.helper.js";
import { parseErrorMessage } from "../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";

function LikedVideos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const renderVideo = async () => {
      try {
        const response = await axiosInstance.get(`/api/likes/videos`);
        toast.success(response.data.message);
        console.log("This is the response of liked videos: " + response);
        setVideos(response.data.data);
      } catch (error) {
        toast.error(parseErrorMessage(error.response.data));
        console.error("Videos are not fetched:", error);
      }
    };
    renderVideo();
  }, []);

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const formatNumber = (num) => {
    if (typeof num !== "number" || isNaN(num)) {
      return "0";
    }

    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + "B"; // Billion
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M"; // Million
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K"; // Thousand
    } else {
      return num.toString();
    }
  };

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
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-col gap-4 p-4">
        {videos &&
          videos.map((video) =>
            video?.video ? (
              <div key={video._id} className="w-full max-w-3xl gap-x-4 md:flex">
                <div className="relative  w-full md:w-5/12">
                  {/* NavLink directly on img and content */}
                  <NavLink to={`/video/${video?.video?._id}`}>
                    <div className="relative">
                      <img
                        src={video?.video?.thumbnail}
                        alt={video?.video?.title}
                        className="w-full h-44 object-cover"
                      />  
                      <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm text-white">
                        {formatDuration(video?.video?.duration)}
                      </span>
                    </div>
                  </NavLink>
                </div>

                <div className="flex flex-col gap-x-2 md:w-7/12">
                  <h6 className="mb-1 font-semibold">
                    <NavLink to={`/video/${video?.video?._id}`}>
                      {video?.video?.title}
                    </NavLink>
                  </h6>
                  <p className="text-sm text-gray-200">
                    {formatNumber(video?.video?.views)} Views ·{" "}
                    {timeSince(new Date(video?.video?.createdAt))}
                  </p>

                  <div className="flex items-center gap-x-2 mt-2">
                    <NavLink to={`/user/${video?.video?.owner?.username}/${video?.video?.owner?._id}`}>
                      <img
                        src={video?.video?.owner?.avatar}
                        alt={video?.video?.owner?.username}
                        className="w-10 h-10 rounded-full"
                      />
                    </NavLink>
                    <p className="text-sm text-gray-200">
                      {video?.video?.owner?.username}
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-gray-300 hidden md:block">
                    {video?.video?.description}
                  </p>
                </div>
              </div>
            ) : null
          )}
      </div>
    </section>
  );
}

export default LikedVideos;
