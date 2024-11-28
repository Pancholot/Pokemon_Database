import React from 'react'
import { useNavigate } from 'react-router'

const Home = ({ children }: any) => {

    const navigate = useNavigate()
    const trainerData = localStorage.getItem("token_pokemon")

    /*SI NO ESTÁS INICIADO SESIÓN, TE MANDA A INICIAR SESIÓN XD */
    if (!localStorage.getItem("token_pokemon")) {
        navigate("/login")
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Home