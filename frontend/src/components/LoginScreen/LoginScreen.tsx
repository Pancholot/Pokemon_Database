/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { InputStyle, PrimaryButtonStyle, labelStyle } from "./classnameStyles";
import { useNavigate } from "react-router";
import { loginTrainer } from "@/funcs/api";

const LoginScreen = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const Login = async (event: any) => {
    event.preventDefault();
    if (!mail || !password) {
      setError("Este campo es obligatorio");
      return;
    }

    try {
      const response = await loginTrainer({ mail, password });
      if (response) {
        navigate("/");
      }
    } catch (error) {
      setError("Invalid credentials");
      console.log(error);
    }
  };

  const handleInputMailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMail(event.target.value);
    if (error.length > 0) {
      setError("");
    }
  };
  const handleInputPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const handleInputPasswordFocus = () => {
    if (error.length > 0) {
      setError("");
      setPassword("");
    }
  };

  return (
    <div className="font-sans w-screen h-screen bg-bgLogin bg-cover bg-position flex justify-center items-center">
      <section className="self-center bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 h-[55%] p-4 w-2/3 md:w-[45%] border border-gray-100">
        <img
          className="h-28 mx-auto mb-2"
          src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Pokéball.png"
        />
        <label
          htmlFor="email"
          id="email"
          className={"self-center font-sans text-3xl text-center"}
        >
          Login
        </label>
        {error && (
          <div className="text-red-500 text-center text-lg mb-4">{error}</div>
        )}
        <form
          className="flex flex-col items-center justify-center mt-2"
          onSubmit={Login}
        >
          <label htmlFor="email" id="email" className={labelStyle}>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Type your email..."
            className={InputStyle}
            value={mail}
            onChange={handleInputMailChange}
          />
          <label htmlFor="password" className={labelStyle}>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Type your password..."
            className={InputStyle}
            value={password}
            onChange={handleInputPasswordChange}
            onFocus={handleInputPasswordFocus}
          />
          <div className="w-full flex items-center justify-evenly">
            <button
              onClick={(event: any) => {
                event.preventDefault();
                navigate("/register");
              }}
              className={PrimaryButtonStyle}
            >
              Register
            </button>
            <button onClick={Login} className={PrimaryButtonStyle}>
              Sign In
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginScreen;
