import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Trainer } from '@/types/Trainer';
import { putData, retrieveData } from "@/funcs/api";
import { Vortex } from 'react-loader-spinner';
import { PrimaryButtonStyle } from '../LoginScreen/classnameStyles';
import { capitalizeFirstLetter } from '@/funcs/CapitalizeLetter';
import FriendRow from "./FriendRow";

const Friends = () => {
  const navigate = useNavigate();
  const [trainerData, setTrainerData] = React.useState<Trainer | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  useEffect(() => {
    const getTrainer = async () => {
      try {
        const { trainer } = await retrieveData("/trainer");
        if (trainer) {
          setTrainerData(trainer);
        }
      } catch (error) {
        navigate("/login");
      }
    };
    getTrainer();
  }, []);

  if (!trainerData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={['red', 'red', 'black', 'black', 'gray', 'gray']}
        />
      </div>
    );
  }

  const { name } = trainerData;

  return (
    <div className="bg-bgFriendScreen bg-cover min-h-screen flex flex-col p-4 relative text-white">
      <div className="absolute top-0 left-0 m-2">
        <button
          type="button"
          onClick={() => navigate("/profilescreen")}
          className={PrimaryButtonStyle}
        >
          Profile
        </button>
      </div>

      <div className="text-white p-3 rounded-lg text-center absolute top-0 right-0 m-2">
        <button className={PrimaryButtonStyle}>Friend Requests</button>

      </div>

      <div className="text-center my-4">
        <h1 className="text-3xl text-black font-bold text-">Find Trainers</h1>
      </div>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Enter Trainer ID"
          className="p-2 text-black rounded-l-md w-64"
        />
        <button className="bg-black text-white hover:bg-red-600 px-4 rounded-r-md">
          Search
        </button>

      </div>
      <h2 className="text-center text-2xl text-black font-bold mb-4">Friends</h2>

      <div className="flex flex-col items-center space-y-4">
        <FriendRow />
      </div>
    </div>
  );
};

export default Friends;
