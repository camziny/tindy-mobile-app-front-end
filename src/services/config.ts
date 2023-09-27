import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const BASE_URL = "http://localhost:3000/";
const TIME_OUT = 30000;
export const TINDY_TOKEN_NAME = "tindy_user_token";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TINDY_TOKEN_NAME);
    return token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};

export const saveToken = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log("error in saveToken", error);
    throw error;
  }
};

axiosInstance.interceptors.request.use(async (req) => {
  try {
    const access_token = await AsyncStorage.getItem(TINDY_TOKEN_NAME);
    if (access_token) {
      req.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return req;
  } catch (error) {
    console.log("Error in request interceptor:", error);
    throw error;
  }
});

export const fetcher = async (url: string) => {
  let retries = 3;
  console.log(`Fetching data from URL: ${url}`);

  while (retries > 0) {
    try {
      const response = await axiosInstance.get(url);
      console.log("Fetched Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch Error:", error, "for URL:", url);
      retries--;
    }
  }

  throw new Error("Failed to fetch data after retries.");
};

export default axiosInstance;
