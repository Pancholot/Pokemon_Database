/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { retrieveData } from "@/funcs/api";
import { Trainer } from "@/types/Trainer";
import { PrimaryButtonStyle } from "../LoginScreen/classnameStyles";
import { Vortex } from 'react-loader-spinner';

const Home = () => {
  const navigate = useNavigate();
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);

  /*SI NO ESTÁS INICIADO SESIÓN, TE MANDA A INICIAR SESIÓN XD */
  useEffect(() => {
    const getData = async () => {
      try {
        const { trainer } = await retrieveData("/trainer");
        setTrainerData(trainer);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    getData();
  }, [navigate]);

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

  const { name, pokemon_team } = trainerData;
  console.log(pokemon_team);

  return (
    <div className="bg-slate-200 min-h-screen text-center flex flex-col px-8 items-center justify-center">
      <h2 className="">Hola, {name}</h2>

      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => navigate("/capturescreen")}
          className={PrimaryButtonStyle}
        >
          Capture
        </button>
        <button
          type="button"
          onClick={() => navigate("/profilescreen")}
          className={PrimaryButtonStyle}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={PrimaryButtonStyle}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Home;
