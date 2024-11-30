import { useState } from 'react'
import { InputStyle, PrimaryButtonStyle, labelStyle } from './classnameStyles'
import { useNavigate } from 'react-router'
import axios from 'axios'

const LoginScreen = () => {

    const [mail, setMail] = useState("")
    const [password, setPassword] = useState("")
    let navigate = useNavigate()

    const Login = async (event: any) => {
        event.preventDefault()
        try {
            const response = await axios.post("http://127.0.0.1:5000/trainer/login", { mail, password })
            if (response.data.success) {
                localStorage.setItem("token_pokemon", JSON.stringify(response.data.trainer))
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <div className="font-sans w-screen h-screen bg-bgLogin bg-cover bg-position flex justify-center items-center">
            <section className='self-center bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 h-[70%] p-4 w-2/3 md:w-[45%] border border-gray-100'>
                <img className="h-28 mx-auto" src="https://cdn.discordapp.com/attachments/1103532600351543346/1311590456714334218/pokeball.png?ex=6749694d&is=674817cd&hm=f7ed69fb45dcc95333aecb74c2d777e6b38db5bf25bce2b0bd14205b5212c4aa&" />

                <form className='flex flex-col items-center justify-center' onSubmit={Login}>
                    <label htmlFor='email' id="email" className={labelStyle}>Email</label>
                    <input type='email' name='email' placeholder='Type your email...' className={InputStyle} onChange={(event: any) => {
                        setMail(event.target.value)
                    }} />
                    <label htmlFor='password' className={labelStyle}>Password</label>
                    <input type='password' name='password' placeholder='Type your password...' className={InputStyle} onChange={(event: any) => {
                        setPassword(event.target.value)
                    }} />
                    <div className='w-full flex items-center justify-between'>
                        <a href="/register" className='underline text-blue-700 font-mono'>Register</a>
                        <input type="submit" value="Sign In" className={PrimaryButtonStyle} />
                    </div>
                </form>
            </section>
        </div>
    )
}

export default LoginScreen