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

  const Login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mail || !password) {
      setError("Este campo es obligatorio");
      return;
    }

    try {
      const response = await loginTrainer({ mail, password });
      if (response) {
        navigate("/"); // Navega a la página principal
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
    if (error) {
      setError("");
    }
  };

  const handleInputPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const handleInputPasswordFocus = () => {
    if (error) {
      setError("");
    }
  };

  return (
    <div className="font-sans w-screen h-screen bg-bgLogin bg-cover bg-position flex justify-center items-center">
      <section className="self-center bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 p-4 w-2/3 md:w-[45%] border border-gray-100 transition-all duration-300 ease-in-out">
        <img
          className="h-28 mx-auto mb-2"
          src="https://styles.redditmedia.com/t5_2s9kv/styles/communityIcon_8zzeib8pmwud1.png"
        />
        <label
          htmlFor="email"
          id="email"
          className="self-center font-sans text-3xl text-center block mx-auto mb-4"
        >
          Login
        </label>
        <div
          className={`text-red-500 text-center text-lg mb-4 transition-all duration-300 ease-in-out ${error ? "opacity-100 h-auto" : "opacity-0 h-0"
            }`}
        >
          {error}
        </div>
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
            onFocus={handleInputPasswordFocus}
            required
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
            required
          />
          <div className="w-full flex items-center justify-evenly mt-3">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className={PrimaryButtonStyle}
            >
              Register
            </button>
            <button type="submit" className={PrimaryButtonStyle}>
              Sign In
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginScreen;