/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Trainer } from '@/types/Trainer';
import { putData, retrieveData } from "@/funcs/api";
import { Vortex } from 'react-loader-spinner';
import { PrimaryButtonStyle } from '../LoginScreen/classnameStyles'
import { capitalizeFirstLetter } from '@/funcs/CapitalizeLetter';

const Friends = () => {
  const navigate = useNavigate();
  const [trainerData, setTrainerData] = React.useState<Trainer | null>(null)
  useEffect(() => {
    const getTrainer = async () => {
      try {
        const { trainer } = await retrieveData("/trainer")
        if (trainer) {
          setTrainerData(trainer)
        }
      } catch (error) {
        navigate("/login")
      }
    }
    getTrainer()
  }, [])

  if (!trainerData) {
    return <div className="flex justify-center items-center h-screen"><Vortex
      visible={true}
      height="80"
      width="80"
      ariaLabel="vortex-loading"
      wrapperStyle={{}}
      wrapperClass="vortex-wrapper"
      colors={['red', 'red', 'black', 'black', 'gray', 'gray']}
    /> </div>
  }
  const { _id, name } = trainerData

  return (
    <div className="bg-bgFriendScreen bg-cover min-h-screen flex flex-col items-center p-4">
      {/* Texto principal colocado en la parte superior */}
      <h2 className="text-xl font-bold text-black mb-4 mt-8">
        ¿Quieres nuevos amigos, {capitalizeFirstLetter(name)}?
      </h2>

      {/* Botón para ir al perfil */}
      <div className="mt-auto">
        <button
          type="button"
          onClick={() => navigate("/profilescreen")}
          className={PrimaryButtonStyle}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

export default Friends;
