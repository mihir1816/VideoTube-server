import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from '../app/Slices/authSlice.js';  
import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../app/Slices/authSlice.js";
import { useDispatch } from "react-redux";

function History() {

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const timeSince = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);

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

 const formatNumber = (num) => {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + "B"; 
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + "M"; 
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "K"; 
    } else {
        return num.toString(); 
    }
  };

  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser); 

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(getCurrentUser());  
      setLoading(false);  
    };
    fetchUser();
  }, [dispatch]);

  

  console.log("User data:", user);

  if (!user) {
    return <p>Loading...</p>;
  }

  const videos = user?.watchHistory ?? []; 

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="flex flex-col gap-4 p-4">

        {videos.length > 0 ? (

          videos.map((video) => (
            <NavLink to={`/video/${video?._id}`}>
            <div key={video._id} className="w-full max-w-3xl gap-x-4 md:flex">

            <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
              <div className="w-full pt-[56%]">
                
                <div className="absolute inset-0">
                  <img
                    src={video?.thumbnail}
                    alt={video?.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                  {formatDuration(video?.duration)}
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
                <h6 className="mb-1 font-semibold md:max-w-[75%]">{video?.title}</h6>
                <p className="flex text-sm text-gray-200 sm:mt-3">
                  {formatNumber(video?.views)} Views · {timeSince(new Date(video?.createdAt))}
                </p>
                <div className="flex items-center gap-x-4">
                  <div className="mt-2 hidden h-10 w-10 shrink-0 md:block">
                    <img
                      src={video?.owner?.avatar}
                      alt={video?.owner?.username}
                      className="h-full w-full rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-200">{video?.owner?.username}</p>
                </div>
                <p className="mt-2 hidden text-sm md:block">{video?.description}</p>
              </div>  
            </div>

          </div>
          </NavLink>
          ))

        ) : (
          <p>No watch history found.</p>
        )}
        
      </div>
    </section>
  );
}

export default History;
