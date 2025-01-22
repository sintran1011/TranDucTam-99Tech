import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://interview.switcheo.com/",
});

export default apiClient;
