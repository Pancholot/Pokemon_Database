/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { retrieveData } from "@/funcs/api";
import { Trainer } from "@/types/Trainer";

const PrimaryButtonStyle = "self-end px-6 py-2 bg-slate-800 hover:bg-red-600 focus:bg-red-400 cursor-pointer rounded-md text-white mt-4 transition-colors";

const Home = ({ children }: any) => {
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
    return <div>NO ESTÁS INICIADO SESIÓN</div>;
  }

  const { name } = trainerData;

  return (
    <div className="bg-slate-100 min-h-screen min-w-fit flex-row space-x-7 justify-evenly">
      <h2 className="text-center text-xl font-bold mb-4">Hola, {name}</h2>
      {children}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={PrimaryButtonStyle}
        >
          Log Out
        </button>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => navigate("/capturescreen")}
          className={PrimaryButtonStyle}
        >
          Capture
        </button>
      </div>
    </div>
  );
};

export default Home;
