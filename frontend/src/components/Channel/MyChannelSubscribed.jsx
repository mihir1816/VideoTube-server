import React, { useState } from "react";
import MyChannelEmptySubscribed from "./MyChannelEmptySubscribed";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../app/Slices/authSlice.js";
import { axiosInstance } from "../../helpers/axios.helper.js";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper.js";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

function MyChannelSubscribed() {

  const user = useSelector(selectCurrentUser);

  const [subscribedChannels, setSubscribedChannels] = useState(null);
 
  const rendersubscribedChannels = async () => {
    try {
      const response = await axiosInstance.get(`/api/subscriptions/u/${user?._id}`);
      toast.success(response.data.message);
      setSubscribedChannels(response.data.data);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      setError(error.message || "Failed to fetch subscribed Channels. Please try again...");
    }
  };

  useEffect(() => {
    if(user){
      rendersubscribedChannels();
    }
  }, []);

  return !subscribedChannels ? (
    <MyChannelEmptySubscribed />
  ) : (
    <div className="flex flex-col gap-y-4 py-4">
      <div className="relative mb-2 rounded-lg bg-white py-2 pl-8 pr-3 text-black">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            ></path>
          </svg>
        </span>
        <input className="w-full bg-transparent outline-none" placeholder="Search" />
      </div>

      {subscribedChannels.map((channel) => (
        <div key={channel.channelId} className="flex w-full justify-between mb-4">
          <div className="flex items-center gap-x-2">
            <div className="h-14 w-14 shrink-0">
            <NavLink to={`/user/${channel.username}/${channel.channelId}`}>
              <img
                src={channel.avatar}
                alt={channel.username}
                className="h-full w-full rounded-full"
              />
              </NavLink>
            </div>
            <div className="block">
              <h6 className="font-semibold">{channel.username}</h6>
              <p className="text-sm text-gray-300">{channel.subscriberCount} Subscribers</p>
            </div>
          </div>
          
        </div>
      ))}
 
    </div>
  );
}

export default MyChannelSubscribed;
