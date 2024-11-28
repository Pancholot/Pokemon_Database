import React from 'react'
import { useNavigate } from 'react-router'

const Home = ({ children }: any) => {

    const navigate = useNavigate()
    const trainerData = localStorage.getItem("token_pokemon")
    if (!localStorage.getItem("token_pokemon")) {

    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Home