import React from 'react'
import { PrimaryButtonStyle } from '../LoginScreen/classnameStyles'

const FriendRow = () => {
    return (

        <div className="border flex md:w-[60%] bg-slate-800 h-24 items-center justify-around">
            <div className=" flex items-center">
                <img
                    src="https://i.redd.it/c8z5m7o3osk81.jpg"
                    alt="Ash"
                    className="w-12 h-12 object-cover rounded-full"
                />
                <span className="text-lg font-medium">Nombre de Amigo</span>
            </div>
            <button className={PrimaryButtonStyle + " bg-white !text-black"}>Trade</button>
        </div>

    )
}

export default FriendRow