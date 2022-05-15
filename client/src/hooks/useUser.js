import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import { GET_USER  } from "../graphql/Queries";
import useAuth from "./useAuth";
import { NotificationManager } from 'react-notifications';

const useUser = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate()
    const [user, setUser] = useState({});

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
       
        const getUser = async () => {
            if(!auth?.id) return;
            try {
                const response = await axiosPrivate.post('',{
                query: GET_USER,
                variables: {
                    id: auth?.id
                },
                   signal: controller.signal,
                    withCredentials: true 
                })
                if(isMounted) {
                    setUser(response.data.data.getUser) 
                }
            } catch (err) {
                const errorMsg = err?.response?.data?.message
                NotificationManager.error(errorMsg, 'Token Refresh Error', 3000);
            }
        }
        getUser();

        return () => { 
            isMounted = false;
            controller.abort();
        }
    },[])

    return {
        data : user
     }
}

export default useUser