import axios from "axios";

const BASE_URL = "http://localhost:8000"

export const axiosApi = axios.create({
    baseURL: BASE_URL,
});

export const axiosApiPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${document.cookie.split("; ").find((row) => row.startsWith("access_token"))?.split("=")[1]}`,
    },
});
