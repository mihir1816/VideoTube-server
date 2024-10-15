import React, { useState } from "react";
import { useEffect } from "react";
import { axiosInstance } from "../helpers/axios.helper.js";
import { parseErrorMessage } from "../helpers/parseErrMsg.helper";
import { toast } from "react-toastify";


function ChannelTweets() {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState(null);

  const renderTweets = async () => {
    try {
      const response = await axiosInstance.get(`/api/tweets/getAllTweets`);
      toast.success(response.data.message);
      console.log(response); 
      setTweets(response.data.data) ; 
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      setError(error.message || "Failed to fetch videos. Please try again...");
  }
};

  const [newtweet, setNewTweet] = useState("");

  const addTweet = async () => {
    if (newtweet.trim()) {
      try {
        console.log("creating tweet with data : " + newtweet )
        const response = await axiosInstance.post('/api/tweets/', { content: newtweet });
        toast.success(response.data.message);
        await renderTweets();
        console.log(response);
        setNewTweet("");
      } catch (error) {
        const errorMessage = error.response ? error.response.data : "Failed to post tweet. Please try again...";
        toast.error(parseErrorMessage(errorMessage));
        console.error('Error posting tweet:', error);
      }
    } else {
      toast.error("Add some text to tweet");
    }
  };
  
  useEffect(() => {
    renderTweets();
  }, []);

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
    <div className="flex flex-col items-center w-full min-h-screen bg-[#121212]">
    <div className="w-full max-w-6xl border pb-2 px-0 mt-2">
      <textarea
        className="w-full h-10 resize-none border-none bg-transparent px-3 pt-2 outline-none text-white"
        placeholder="Write a tweet"
        value={newtweet}
        onChange={(e) => setNewTweet(e.target.value)} // Update tweet state on input change
      ></textarea>
      <div className="flex items-center justify-end gap-x-3 px-3 mt-2">
        <button 
        className="bg-[#ae7aff] px-3 py-1 font-semibold text-black border rounded-md"
        onClick={addTweet} >
          Send
        </button>
      </div>
    </div>
  
    <div className="w-full py-4">
      {tweets.map((tweet, index) => (
        <div key={index} className="flex gap-3 border-b border-gray-700 py-4 ml-0 last:border-b-transparent w-full">
          <div className="h-14 w-14 ml-5 shrink-0">
            <img
              src={tweet.owner.avatar}
              alt={tweet.owner.username}
              className="h-full w-full rounded-full"
            />
          </div>
          <div className="w-full">
            <h4 className="mb-1 flex items-center gap-x-3">
              <span className="font-semibold">{tweet.owner.username}</span> 
              <span className="inline-block text-sm text-gray-400">
              {timeSince(new Date(tweet.createdAt))}
              </span>
            </h4>
            <p className="mb-2">{tweet.content}</p>
            <div className="flex gap-4">
              <button
                className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-like-count)] focus:after:content-[attr(data-like-count-alt)]"
                data-like-count={tweet.likeCount}
                data-like-count-alt={tweet.likeCount - 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5 text-[#ae7aff] group-focus:text-inherit"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                  ></path>
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
