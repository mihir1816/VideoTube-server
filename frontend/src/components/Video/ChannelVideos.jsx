import React, { useState , useEffect } from "react";
import { EmptyChannelVideo } from "../index";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../helpers/axios.helper";  
import { toast } from "react-toastify"; 
import { NavLink } from "react-router-dom";

function ChannelVideos() {

  
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

  const location = useLocation();
  const path = location.pathname.split("/");
  const userId = path[3]; 
  console.log("user if from channel video " + userId)

  const [videos, setVideos] = useState(null);

  useEffect(() => {
    const renderVideo = async () => {
        try {
          const response = await axiosInstance.get(`/api/videos/allVideosOfUser/${userId}`); 
          toast.success(response.data.message); 
          console.log(response); 
          setVideos(response.data.data.result) ; 
        } catch (error) {
          toast.error(parseErrorMessage(error.response.data));
          // setError(error.message || "Failed to fetch videos. Please try again...");
          console.error("getAllVideos dispatch error:", error);
      }
    };
    renderVideo();
  }, [userId]);


  return !videos ? (
    <EmptyChannelVideo />
  ) : (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
      {
      Array.isArray(videos) &&
        videos.map((video) => (
          <div className="w-full" key={video._id}>

          <NavLink to={`/video/${video._id}`}>
            <div 
            onClick={() => {
              addview(video._id);
              addToHistory(video._id); 
          }}
            className="relative mb-2 w-full pt-[56%] ">
              <div className="absolute inset-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full"
                />
              </div>
              <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                {formatDuration(video.duration)}
              </span>
            </div>
          </NavLink>

            <div className="flex gap-x-2">
              <div className="h-10 w-10 shrink-0">
                <img
                  src= {video?.owner?.avatar}
                  alt="expresslearner"
                  className="h-full w-full rounded-full"
                />
              </div>
              <div className="w-full">
                <h6 className="mb-1 font-semibold">{video.title}</h6>
                <p className="flex text-sm text-gray-200">
                  {video.views} Views · {timeSince(new Date(video.createdAt))}
                </p>
                <p className="text-sm text-gray-200">{video.owner.username}</p>
              </div>
            </div>

          </div>
        ))}
    </div>
     </section>
  );
}

export default ChannelVideos;
