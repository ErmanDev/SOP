import axios from "axios";
import IUser from "../user.interface";

const render_url = import.meta.env.VITE_render_url;
 
const addUser = async (user:  Partial<IUser>) => {
  try {

      return await axios({
        method: "POST",
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/user/create_user`,
        data: user
      });
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      console.log(err.response?.data.error);
      throw new Error(`${err.response?.data.error}`);
    }
  }
}

const getAllUsers = async () => {
  try{
    return await axios({
      method: "GET",
      url: `${import.meta.env.VITE_SERVER_URL}/api/v1/user/`,
    });
  } catch (err) {
    if (err instanceof axios.AxiosError) {
      console.log(err.response?.data.error);
      throw new Error(`${err.response?.data.error}`);
    }
  }
}

const getAllUser = async () => {
  try {
    const response = await axios.get(`${render_url}/api/users/fetchUserDetails`);
    return response.data; // ✅ Return the full response to handle it properly
  } catch (err) {
    console.error("Error fetching users:", err);
    return { data: [] }; // ✅ Prevents crashes
  }
};


export {
  addUser,
  getAllUsers,
  getAllUser
};

