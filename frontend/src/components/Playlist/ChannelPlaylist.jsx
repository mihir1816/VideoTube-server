import React, { useState } from "react";
import EmptyPlaylist from "./EmptyPlaylist";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from 'react-router-dom';

function ChannelPlaylist() {

  const [playlists, setPlaylists] = useState(null);
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const username = pathParts[2];
  const userId = pathParts[3];

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

  const renderPlayList = async () => {
    try {
      console.log("userId : " +   userId)
      const response = await axiosInstance.get(`/api/playlist/user/${userId}`);
      console.log(response) ; 
      toast.success(response.data.message);
      setPlaylists(response.data.data);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      // setError(error.message || "Failed to fetch playlist. Please try again...");
    }
  };

  useEffect(() => { 
    if(userId){
      renderPlayList(); 
    }
  }, []);

  return !playlists ? (
    <EmptyPlaylist />
  ) : (
    <>
          <ul
            className={`grid gap-4 pt-2 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] ${
              playlists?.length < 4 && "lg:grid-cols-[repeat(auto-fit,_minmax(300px,400px))]"
            }`}
          >
            {playlists?.map(
              (playlist) =>
                (playlist.videos.length > 0 || playlist.owner) && (
                  <li key={playlist._id} className="w-full">
                    <NavLink to={`/playlist/${playlist._id}/${username}`}>
                      <div className="relative w-full pt-[56%]">
                        <div className="absolute inset-0">
                          <img
                            src={playlist.videos.length === 0 ? 
                              "https://res.cloudinary.com/df6ztmktu/image/upload/v1717336091/videotube/photos/iqqvkshu1a14wfbr56lh.png"
                              :
                                  playlist?.thumbnail ? playlist?.thumbnail : ""
                            }
                            alt="Thunbnail is not uploaded"
                            className="h-full w-full resize"
                          />  
                          <div className="absolute inset-x-0 bottom-0">
                            <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
                              <div className="relative z-[1]">
                                <p className="flex justify-between">
                                  <span className="inline-block">{playlist.name}</span>
                                  <span className="inline-block">
                                    {playlist?.videos?.length} video
                                    {playlist?.videos?.length > 1 ? "s" : ""}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-200">
                                  {playlist.totalViews} view{playlist.totalViews > 1 ? "s" : ""} ·{" "}
                                  {timeSince(playlist?.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex py-2 px-3 min-h-8 bg-[#21212199]">
                        <p className="flex text-sm text-gray-200 max-h-10 overflow-hidden">
                          {playlist.description}
                        </p>
                      </div>
                    </NavLink>
                  </li>
                )
            )}
          </ul>
    
    </>
  );
}

export default ChannelPlaylist;
