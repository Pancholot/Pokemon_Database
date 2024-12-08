import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Trainer } from '@/types/Trainer';
import { putData, retrieveData } from "@/funcs/api";
import { Vortex } from 'react-loader-spinner';
import { PrimaryButtonStyle } from '../LoginScreen/classnameStyles';
import { capitalizeFirstLetter } from '@/funcs/CapitalizeLetter';

const Friends = () => {
  const navigate = useNavigate();
  const [trainerData, setTrainerData] = React.useState<Trainer | null>(null);

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

      <div className="absolute top-0 right-0 m-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className={PrimaryButtonStyle}
        >
          Friend Requests
        </button>
      </div>

      <div className="text-center my-4">
        <h1 className="text-3xl font-bold text-black">Find Trainers</h1>
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

      <div>
        <h2 className="text-center text-2xl text-black font-bold mb-4">Friends</h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center bg-gray-800 p-4 rounded-md w-2/3">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img
                src="https://i.redd.it/c8z5m7o3osk81.jpg"
                alt="Ash"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-medium">Ash Ketchum</span>
          </div>

          <div className="flex items-center bg-gray-800 p-4 rounded-md w-2/3">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img
                src="https://i.pinimg.com/1200x/c0/34/08/c0340871f5861bd23f88e92211d9aadc.jpg"
                alt="Ash"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-medium">Misty</span>
          </div>

        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-center text-black-700 text-2xl font-bold">Trade Pokemon</h2>
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Enter the Friend's ID"
            className="p-2 text-black rounded-l-md w-64"
          />
          <button className="bg-black text-white px-4 hover:bg-red-600 rounded-r-md">
            Trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default Friends;
