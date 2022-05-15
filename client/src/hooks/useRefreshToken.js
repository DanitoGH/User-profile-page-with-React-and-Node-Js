import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";
import { REFRESH_AUTH_TOKEN_QUERY  } from "../graphql/Queries";
import { NotificationManager } from 'react-notifications';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
       const res = await axiosPrivate.post('',{
          query: REFRESH_AUTH_TOKEN_QUERY,
           withCredentials: true 
        })
        const data = res.data
        if(!data?.errors) {
            const { id, accessToken, lastLogin } =  res?.data?.data?.refreshToken
            setAuth(prev => { 
                return { ...prev, id: id, accessToken: accessToken, lastLogin: lastLogin }
            })
             return accessToken
        } else {
           const message = res?.data?.errors[0]?.message
           NotificationManager.error(message, 'Token Refresh Error', 3000);
        } 
    }
    return refresh
}

export default useRefreshToken