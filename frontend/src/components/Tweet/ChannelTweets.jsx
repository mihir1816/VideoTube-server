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

  const [isLoading, setisLoading] = useState(true)


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
      // toast.success(response.data.message);
      console.log(response);
      setuser(response.data.data);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
      // setError(error.message || "Failed to fetch user. Please try again...");
    }
  };

  const renderTweets = async () => {
    try {
      const response = await axiosInstance.get(`/api/tweets/user/${userId}`);
      // toast.success(response.data.message);
      console.log(response);
      setTweets(response.data.data);
    } catch (error) {
      // toast.error(parseErrorMessage(error.response.data));
      // setError(error.message || "Failed to fetch tweet. Please try again...");
    }
  };

  const toggleLike = async (tweetId) => {
    try {
      const response = await axiosInstance.post(`/api/likes/toggle/t/${tweetId}`);
      // toast.success(response.data.message);
      await renderTweets()
    } catch (error) {
      const errorMessage = error.response ? error.response.data : "can not toggle like. Please try again...";
      // toast.error(parseErrorMessage(errorMessage));
      console.error('Error toggling like:', error);
    }
};

  const [tweets, setTweets] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
        Promise.all([renderUser(), renderTweets()])
          .finally(() => setisLoading(false));
    }, 300); 
    return () => clearTimeout(timer);
  }, [userId]);

  if (isLoading) {
    return (
      <section className="w-full py-1 px-3 pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="mt-2 border pb-2 text-transparent bg-slate-100/10 rounded animate-pulse">
          <div className="mb-2 h-12 w-full resize-none border-none px-3 pt-2"></div>

          <div className="flex items-center justify-end gap-x-3 px-3">
            <div className="w-20 h-10 bg-slate-100/20 rounded animate-pulse"></div>
          </div>
        </div>
        <hr className=" border-[#ae7aff]/0 animate-pulse my-2" />
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>{" "}
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>
        <div className=" px-1">
          <div className="flex justify-between ">
            {/* comment content */}
            <span className="flex w-full gap-x-4 ">
              {/* avatar */}
              <div className="mt-2 h-12 w-12 shrink-0 ">
                <div className="h-full w-full rounded-full border-white bg-slate-100/10 animate-pulse"></div>
              </div>
              {/* Content */}
              <div className="block w-full">
                <div className="flex items-center">
                  <span className="bg-slate-100/10 rounded animate-pulse w-44 h-6 mr-1"></span>
                  <span className="bg-slate-100/10 rounded animate-pulse w-16 h-6"></span>
                </div>
                <div className="bg-slate-100/10 rounded animate-pulse w-32 mt-1 h-4"></div>
                <p className="my-1 text-[14px]">
                  <div className="text-transparent h-6 bg-slate-100/10 rounded animate-pulse w-[50%] outline-none border-b-[1px] border-transparent"></div>
                </p>
              </div>
            </span>
          </div>
          <hr className="my-2 border-slate-100/50 animate-pulse" />
        </div>
      </section>
    );
  }

  return Array.isArray(tweets) && tweets.length === 0 ? (
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
