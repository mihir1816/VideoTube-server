import React, { useState , useEffect } from "react";
import EmptyTweet from "./EmptyTweet";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../helpers/axios.helper";  
import { toast } from "react-toastify"; 


function ChannelTweets() {

  const location = useLocation();
  const path = location.pathname.split("/");
  const userId = path[3]; 
  const username = path[2] ; 

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

  const [user, setuser] = useState(null)

  const renderUser = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/c/${username}`);
      toast.success(response.data.message);
      console.log(response);
      setuser(response.data.data);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      // setError(error.message || "Failed to fetch user. Please try again...");
    }
  };

  const renderTweets = async () => {
    try {
      const response = await axiosInstance.get(`/api/tweets/user/${userId}`);
      toast.success(response.data.message);
      console.log(response);
      setTweets(response.data.data);
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      // setError(error.message || "Failed to fetch tweet. Please try again...");
    }
  };

  const toggleLike = async (tweetId) => {
    try {
      const response = await axiosInstance.post(`/api/likes/toggle/t/${tweetId}`);
      toast.success(response.data.message);
      await renderTweets()
    } catch (error) {
      const errorMessage = error.response ? error.response.data : "can not toggle like. Please try again...";
      toast.error(parseErrorMessage(errorMessage));
      console.error('Error toggling like:', error);
    }
};

  const [tweets, setTweets] = useState(null);

  useEffect(() => {
    renderUser() ; 
    renderTweets() ; 
  }, [userId]);

  return !tweets ? (
    <EmptyTweet />
  ) : (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#121212]">

      <div className="w-full py-4">
        {tweets.map((tweet, index) => (
          <div
            key={index}
            className="flex gap-3 border-b border-gray-700 py-4 ml-0 last:border-b-transparent w-full"
          >
            <div className="h-14 w-14 ml-5 shrink-0">
              <img
                src={user?.avatar}
                alt={user?.username}
                className="h-full w-full rounded-full"
              />
            </div>
            <div className="w-full">
              <h4 className="mb-1 flex items-center gap-x-3">
                <span className="font-semibold">{user?.username}</span> 
                <span className="inline-block text-sm text-gray-400">
                  {timeSince(new Date(tweet.createdAt))}
                </span>
              </h4>
              <p className="mb-2">{tweet.content}</p>
              <div className="flex justify-between">
                <button onClick={() => toggleLike(tweet._id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill={tweet?.liked ? "red" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ cursor: "pointer" }}
                  >
                    <path d="M12 21C12 21 4 14.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12 4 12 4C12 4 12.76 3 14.5 3C17.58 3 20 5.42 20 8.5C20 14.36 12 21 12 21Z" />
                  </svg>
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
 
}

export default ChannelTweets;
