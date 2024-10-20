import React, { useState } from "react";
import MyChannelEmptyVideo from "./MyChannelEmptyVideo";
import UploadVideo from "./UploadVideo";
import { useEffect } from "react";

function MyChannelVideos() {
  const [videos, setVideos] = useState(null);
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
  function formatNumber(num) {
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

  useEffect(() => {
    const renderVideo = async () => {
        try {
          const response = await axiosInstance.get(`/api/videos`); 
          // toast.success(response.data.message); 
          console.log(response); 
          setVideos(response.data.data.docs) ; 
        } catch (error) {
          toast.error(parseErrorMessage(error.response.data));
          setError(error.message || "Failed to fetch videos. Please try again...");
          console.error("getAllVideos dispatch error:", error);
      }
    };
    renderVideo();
  }, []);



  return !videos ? (
    <MyChannelEmptyVideo />
  ) : (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">

        <div className="w-full">
          {videos.map((video) => (
            <div key={video.id} className="mb-4">
              <div className="relative mb-2 w-full pt-[56%]">
                <div className="absolute inset-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm text-white">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <h6 className="mb-1 font-semibold">{video.title}</h6>
              <p className="flex text-sm text-gray-200">
                {formatNumber(video.views)} Views · {timeSince(video.createdAt)}
              </p>
            </div>
          ))}
        </div>

        
      </div>
      {/* <UploadVideo/> */}
    </>
  );
}

export default MyChannelVideos;
