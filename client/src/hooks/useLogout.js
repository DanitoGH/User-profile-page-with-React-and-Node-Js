import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";
import { USER_LOGOUT_MUTATION  } from "../graphql/Mutations";
import { NotificationManager } from 'react-notifications';

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => { 
        setAuth({});
        try {
            await axiosPrivate.post('',{
                query: USER_LOGOUT_MUTATION,
                 withCredentials: true 
            }).then(res => {
                const data = res.data
                if(data?.errors) {
                   throw new Error(res?.data?.errors[0]?.message)
                } 
            })
        } catch (err) {
            if(err.message !== 'No Content'){
                NotificationManager.error(err.message, 'Logout Error', 3000);
            }
        }
    }
    return logout;
    
}

export default useLogout;