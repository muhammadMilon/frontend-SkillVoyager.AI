import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-skill-voyager-ai.vercel.app",
  headers: {
    "Content-Type": "application/json"
  }
});

const useAxiosSecure = () => {
  return axiosSecure; // The name must match the variable defined above
};

export default useAxiosSecure;