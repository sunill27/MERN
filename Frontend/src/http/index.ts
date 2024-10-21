import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json", //Sending data format to backend
    Accept: "application/json", //Receiving data format from backend
  },
});

const APIAuthenticated = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json", //Sending data format to backend
    Accept: "application/json", //Receiving data format from backend
    Authorization: `${localStorage.getItem("token")}`,
    // Authorization: localStorage.getItem("token"),
  },
});
export { API, APIAuthenticated };
