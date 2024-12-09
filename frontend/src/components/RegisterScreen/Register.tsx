import { useState } from "react";
import {
  InputStyle,
  PrimaryButtonStyle,
  labelStyle,
} from "../LoginScreen/classnameStyles";
import { useNavigate } from "react-router";
import { postData } from "@/funcs/api.ts";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number | string>(""); // Si aceptas texto y números
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registerUser = async (event: any) => {
    event.preventDefault();
    try {
      const response = await postData("/trainer/register", {
        name,
        age,
        region,
        mail,
        password,
      });
      if (response.success) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function capitalizeFirstLetter(string: string) {
    if (!string) return ""; // Check for empty strings or null
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <div className="font-sans w-screen min-h-screen bg-bgRegister text-white bg-cover bg-position flex justify-center items-center bg-fixed">
      <section className="self-center bg-gray-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 min-h-[70%] p-4 w-2/3 md:w-[45%] border border-gray-100">
        <img
          className="h-28 mx-auto"
          src="https://cdn.discordapp.com/attachments/1103532600351543346/1311590456714334218/pokeball.png?ex=6749694d&is=674817cd&hm=f7ed69fb45dcc95333aecb74c2d777e6b38db5bf25bce2b0bd14205b5212c4aa&"
        />

        {/* NAME */}
        <label htmlFor="name" className={labelStyle}>
          Name
        </label>
        <input
          required
          type="text"
          name="name"
          placeholder="Type your name..."
          className={InputStyle}
          onChange={(event: any) => {
            setName(capitalizeFirstLetter(event.target.value));
          }}
        />

        {/*AGE */}
        <label htmlFor="age" className={labelStyle}>
          Age
        </label>
        <input
          required
          type="text"
          name="age"
          placeholder="Type your Age..."
          className={InputStyle}
          onChange={(event: any) => {
            setAge(event.target.value);
          }}
        />

        {/*EMAIL */}
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={registerUser}
        >
          <label htmlFor="email" id="email" className={labelStyle}>
            Email
          </label>
          <input
            required
            type="email"
            name="email"
            placeholder="Type your email..."
            className={InputStyle}
            onChange={(event: any) => {
              setMail(event.target.value);
            }}
          />
          {/*Password */}
          <label htmlFor="password" className={labelStyle}>
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            placeholder="Type your password..."
            className={InputStyle}
            onChange={(event: any) => {
              setPassword(event.target.value);
            }}
          />

          {/* REGION */}
          <label htmlFor="region" className={labelStyle}>
            Choose a region:
          </label>
          <select
            name="region"
            id="region"
            className={InputStyle}
            onChange={(event) => {
              setRegion(event?.target.value);
            }}
          >
            <option value="kanto">Kanto</option>
            <option value="johto">Johto</option>
            <option value="hoenn">Hoenn</option>
            <option value="sinnoh">Sinnoh</option>
            <option value="unova">Unova</option>
            <option value="hoenn">Hoenn</option>
          </select>
          {/*<input required type='text' name='region' placeholder='Type your region...' className={InputStyle} onChange={(event: any) => {
                        setRegion(event.target.value)
                    }} />*/}
          <div className="w-full flex items-center justify-between mt-3">
            <a href="/login" className="underline text-white font-mono">
              Log In
            </a>
            <input
              type="submit"
              value="Register"
              className={PrimaryButtonStyle}
            />
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;
