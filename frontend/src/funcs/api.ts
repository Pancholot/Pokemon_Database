import axios from "axios";
import { deleteData, getData, saveData } from "./userKey";

const api = axios.create({
  baseURL: "http://backend:5000",
});

api.interceptors.request.use(
  async (config) => {
    if (
      config.url === "/trainer/login" ||
      config.url === "/trainer/register" ||
      config.url === "/trainer/refresh"
    ) {
      return config;
    }
    let access_token = getData("access_token");
    if (!access_token || isTokenExpired(access_token)) {
      access_token = await refreshToken("refresh_token");
    }
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const isTokenExpired = (token: string) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

export const refreshToken = async (refresh_token: string) => {
  try {
    const refresh = getData(refresh_token);
    if (!refresh) {
      throw new Error("No refresh token found");
    }
    if (isTokenExpired(refresh)) {
      throw new Error("Refresh token expired");
    }
    const response = await api.post(
      "/trainer/refresh",
      { refresh: true },
      {
        headers: {
          Authorization: `Bearer ${refresh}`,
        },
      }
    );
    const { access_token, new_refresh_token } = response.data;

    if (access_token) {
      saveData("access_token", access_token);
    }

    if (new_refresh_token) {
      saveData("refresh_token", new_refresh_token);
    }

    return access_token;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    throw error;
  }
};

export const loginTrainer = async (data: unknown) => {
  const response = await api.post("/trainer/login", data);
  const { access_token, refresh_token } = response.data;
  saveData("access_token", access_token);
  saveData("refresh_token", refresh_token);
  return response.status === 200;
};
export const logOut = async () => {
  try {
    deleteData("access_token");
    deleteData("refresh_token");

    console.log("Sesión expirada, redirigiendo al login...");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export const retrieveData = async (route: string) => {
  try {
    const response = await api.get(route);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos:", error, route);
    return null;
  }
};

export const postData = async (route: string, data: unknown) => {
  const response = await api.post(route, data);
  return response.data;
};

export const putData = async (route: string, data: unknown) => {
  const response = await api.put(route, data);
  return response.data;
};
