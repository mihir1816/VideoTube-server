import React from "react";
import { useSelector } from "react-redux";
import selectCurrentUser from '../app/Slices/authSlice.js'

function History() {

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

  const user = useSelector(selectCurrentUser) ; 

  if( user ){
      console.log(" this is ....................user ")
      console.log(user)
      console.log(user.type)
  }



  const videos = user?.watchHistory ?? [];

  return (
    <section class="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div class="flex flex-col gap-4 p-4">

      { videos.length > 0  && videos.map((video) => (
        <div class="w-full md:flex" key={video._id}>
          <div class="relative mb-2 w-full md:mb-0 md:w-5/12">
            <div class="w-full pt-[56%]">
              <div class="absolute inset-0">
                <img
                  src={video?.thumbnail} 
                  alt={video?.title} // Dynamic title as alt tex
                  class="h-full w-full"
                />
              </div>
              <span class="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
                {formatDuration(video?.duration)} 
              </span>
            </div>
          </div>
          <div class="flex gap-x-2 md:w-7/12">
            <div class="h-10 w-10 shrink-0 md:hidden">
              <img
                src={video?.owner?.avatar} 
                alt={video?.owner?.username} 
                class="h-full w-full rounded-full"
              />
            </div>
            <div class="w-full">
              <h6 class="mb-1 font-semibold md:max-w-[75%]">
                {video?.title} 
              </h6>
              <p class="flex text-sm text-gray-200 sm:mt-3">
                {formatNumber(video?.views)} Views · {timeSince(video?.createdAt)} 
              </p>
              <div class="flex items-center gap-x-4">
                <div class="mt-2 hidden h-10 w-10 shrink-0 md:block">
                  <img
                    src={video?.owner?.avatar} 
                    alt={video?.owner?.username} 
                    class="h-full w-full rounded-full"
                  />
                </div>
                <p class="text-sm text-gray-200">
                  {video?.owner?.username} 
                </p>
              </div>
              <p class="mt-2 hidden text-sm md:block">
                {video?.description} 
              </p>
            </div>
          </div>
        </div>
      ))}
        
      </div>
    </section>
  );
}

export default History;
