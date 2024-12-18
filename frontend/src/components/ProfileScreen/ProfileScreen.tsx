import React, { useEffect } from 'react'
import { PrimaryButtonStyle } from '../LoginScreen/classnameStyles'
import { useNavigate } from 'react-router';
import { retrieveData } from '@/funcs/api';
import { Vortex } from 'react-loader-spinner';
import { Trainer } from '@/types/Trainer';
import { capitalizeFirstLetter } from '@/funcs/CapitalizeLetter';

const ProfileScreen = () => {
    const navigate = useNavigate()
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
    function copyToClipboard() {
        const textToCopy = _id
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                alert("Texto copiado al portapapeles")
            })
            .catch((err) => {
                console.error("Error al copiar el texto: ", err);
            });
    }
    return (
        <>
            <div className='absolute top-0 left-2 mt-3'>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className={PrimaryButtonStyle}
                >
                    Home
                </button>
            </div>
            <section className='bg-slate-200 min-h-screen min-w-screen md:grid md:grid-cols-12 shadow-xl'>

                <img src="https://wallpaper.dog/large/10881125.jpg" className='col-span-6 md:h-screen md:object-cover md:rounded-r-3xl md:rounded-bl-none rounded-b-3xl' />
                <div className='md:col-span-6 flex flex-col items-center justify-center'>
                    <img className='mt-4 rounded-full object-cover h-40 w-40 shadow-lg' src="https://images4.alphacoders.com/127/thumb-1920-1274987.png" alt='Profile photo'></img>
                    <p className='mt-6'>{capitalizeFirstLetter(name)}</p>
                    <span className='flex gap-4 items-center justify-center'>
                        ID: {_id}<button
                            onClick={() => copyToClipboard()}
                            className="text-white bg-slate-50 hover:bg-red-600 font-bold flex justify-center items-center p-1 rounded-lg shadow-xl hover:shadow-xl transition-colors focus:outline-none focus:ring-2  focus:ring-offset-2 max-w-24 "
                        >
                            <img src="https://img.icons8.com/material-outlined/24/copy.png" className='h-5 w-5 ' />
                        </button></span>
                    <div className='flex gap-4 mt-3'>

                        <button
                            type="button"
                            onClick={() => navigate("/friendscreen")}
                            className={PrimaryButtonStyle}
                        >
                            Friends
                        </button>
                        <button className={PrimaryButtonStyle} onClick={() => navigate("/TeamScreen")}>Pokemon Team</button>
                    </div>
                </div>
            </section >
        </>
    )
}

export default ProfileScreen