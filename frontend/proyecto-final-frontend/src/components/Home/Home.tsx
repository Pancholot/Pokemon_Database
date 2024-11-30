import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const Home = ({ children }: any) => {

    const navigate = useNavigate()
    const token = localStorage.getItem("token_pokemon");
    const trainerData = token ? JSON.parse(token) : null;
    const { name, pokemon_team } = trainerData;


    /*SI NO ESTÁS INICIADO SESIÓN, TE MANDA A INICIAR SESIÓN XD */
    useEffect(() => {
        if (!trainerData) {
            navigate("/login")// REDIRECCIÓN A LOGIN
        }
    }, [])

    if (!trainerData) {
        return <div>NO ESTÁS INICIADO SESIÓN</div>
    }

    return (
        <div>
            <h2>Hola, {name}</h2>
            {pokemon_team?.map((pokemon: any, index: any) => (
                <img key={index} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon}.png`} />
            ))}
            {children}
        </div>
    )
}

export default Home