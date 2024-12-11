import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Trainer } from "@/types/Trainer";
import { putData, retrieveData } from "@/funcs/api";
import { Vortex } from "react-loader-spinner";
import { PrimaryButtonStyle } from "../LoginScreen/classnameStyles";
import { capitalizeFirstLetter } from "@/funcs/CapitalizeLetter";
import FriendRow from "./FriendRow";
import FriendRowRequest from "./FriendRowRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TradeRequest } from "@/types/TradeRequest";
import { useSocket } from "@/context/SocketContext";

type FriendRequestType = {
  sender: string;
  status: string;
};
const Friends = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [trainerData, setTrainerData] = React.useState<Trainer | null>(null);
  const [isSidebarFriendsOpen, setIsSidebarFriendsOpen] = useState(false);
  const [friends, setFriends] = useState<string[] | null>(null);
  const [friendRequests, setFriendRequests] = useState<
    FriendRequestType[] | null
  >(null);
  const [error, setError] = useState<string>("");
  const [friend, setFriend] = useState<string>("");
  const [requestTrades, setRequestTrades] = useState<TradeRequest[]>([]);

  const toggleSidebarFriend = () =>
    setIsSidebarFriendsOpen(!isSidebarFriendsOpen);

  useEffect(() => {
    const getTrainer = async () => {
      try {
        const { trainer } = await retrieveData("/trainer");
        if (trainer) {
          setTrainerData(trainer);
          setFriends(trainer.friends);
          setFriendRequests(trainer.requests);
        }
      } catch (error) {
        console.warn(error);
        navigate("/login");
      }
    };
    getTrainer();
  }, [navigate]);

  useEffect(() => {
    if (!socket || !trainerData) return;
    const { _id } = trainerData;
    socket.on("updated_friends", (data) => {
      if (data._id === _id) {
        setFriends(data.friends);
      }
    });
    socket.on("updated_friend_requests", (data) => {
      if (data._id === _id) {
        setFriendRequests(data.requests);
      }
    });
    return () => {
      socket.off("updated_friends");
      socket.off("updated_friend_requests");
    };
  }, [socket, trainerData]);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const { trades } = await retrieveData("/trades");
        console.log(trades);
        setRequestTrades(trades);
      } catch (error) {
        console.error(error);
      }
    };
    getRequests();
  }, []);

  if (!trainerData || !friends || !friendRequests) {
    return (
      <div className="flex justify-center items-center h-screen br">
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["red", "red", "black", "black", "gray", "gray"]}
        />
      </div>
    );
  }

  const handleSendFriendRequest = async () => {
    try {
      const response = await putData("/trainer/send_friend_request", {
        friend_id: friend,
      });
      if (!response.success) {
        setError("Hubo un error al mandar solicitud");
      } else {
        toast("You've sent a friend request.");
      }
      setFriend("");
    } catch {
      setError("Hubo un error al mandar solicitud");
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFriend(event.target.value);
  };
  const onFocus = () => {
    setError("");
  };

  const { name } = trainerData;

  return (
    <>
      <div className="bg-bgFriendScreen bg-cover min-h-screen flex flex-col p-4 relative text-white">
        <div className="absolute top-0 left-0 m-2 mt-5">
          <button
            type="button"
            onClick={() => navigate("/profilescreen")}
            className={PrimaryButtonStyle}
          >
            Profile
          </button>
        </div>

        <div className="flex flex-col text-white p-3 rounded-lg text-center absolute top-0 right-0 m-2 mb-2">
          <button
            onClick={toggleSidebarFriend}
            className={`${PrimaryButtonStyle} mb-2`}
          >
            <Vortex
              visible={friendRequests && friendRequests.length > 0}
              height="10"
              width="10"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={["red", "red", "black", "black", "gray", "gray"]}
            />
            Friend Requests
          </button>
        </div>

        {/* Sidebar Friends*/}
        <div
          className={`fixed top-0 right-0 h-full bg-gray-800 text-white shadow-lg transform transition-transform ${
            isSidebarFriendsOpen ? "translate-x-0" : "translate-x-full"
          } w-64`}
        >
          <button
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
            onClick={toggleSidebarFriend}
            aria-label="Cerrar menú lateral"
          >
            &times;
          </button>

          <div className="p-4 text-xl font-bold border-b border-gray-700">
            Friend Requests
          </div>

          <nav className="p-4">
            <ul>
              {friendRequests.map((req, key) => (
                <li
                  key={key}
                  className="py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer"
                >
                  <FriendRowRequest
                    key={key}
                    friend_id={req.sender}
                    index={key}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="text-center my-4">
          <h1 className="text-3xl text-black font-bold text-">Find Friends</h1>
        </div>
        <div className={"flex justify-center " + (error ? "mb-2" : "mb-8")}>
          <input
            type="text"
            placeholder="Enter Trainer ID"
            className="p-2 text-black rounded-l-md w-64"
            onChange={onChange}
            onFocus={onFocus}
            value={friend}
          />

          <button
            className="bg-black text-white hover:bg-red-600 px-4 rounded-r-md"
            onClick={handleSendFriendRequest}
          >
            Send Friend Request
          </button>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="flex justify-center">
          <h2 className="inline-block px-4 bg-black bg-opacity-10 text-center text-2xl text-white font-bold mb-4 rounded">
            Your Friends {capitalizeFirstLetter(name)}
          </h2>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {friends.map((friend_id, key) => (
            <FriendRow
              key={key}
              friend_id={friend_id}
              hasPendingTrade={requestTrades.some(
                (req) => req.trainer_id === friend_id
              )}
            />
          ))}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Friends;
