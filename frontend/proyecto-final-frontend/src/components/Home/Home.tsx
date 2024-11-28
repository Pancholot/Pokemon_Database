import React from 'react'
import { useNavigate } from 'react-router'

const Home = ({ children }: any) => {

    const navigate = useNavigate()
    const token = localStorage.getItem("token_pokemon");
    const trainerData = token ? JSON.parse(token) : null;



    /*SI NO ESTÁS INICIADO SESIÓN, TE MANDA A INICIAR SESIÓN XD */
    if (!trainerData) {
        navigate("/login")
    }

    return (
        <div>
            <h2>Hola, {trainerData.name}</h2>
            {trainerData.pokemon_team.map((pokemon: any) => (
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon}.png`} />
            ))}
            {children}
        </div>
    )
}

export default Home