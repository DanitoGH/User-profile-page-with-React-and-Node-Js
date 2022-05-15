import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { useLocation } from "react-router-dom"

const PersistLogin = ({ publicRoutes }) => {
    const refresh = useRefreshToken()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    const { auth } = useAuth()

    useEffect(() => {
       if(publicRoutes?.includes(location.pathname)) return setIsLoading(false) // If the current route is public, don't refresh the token
        const verifyRefreshToken = async () => {
           try {
               await refresh();
           } catch (error) {
               console.error(error)
           }
           finally {
             setIsLoading(false)
           }
        }

        !auth?.accessToken? verifyRefreshToken() : setIsLoading(false)
    }, [])

    // do silent refresh every 14 minutes (840,000 milliseconds) to help keep the user logged in
    useEffect(() => {
       if(!isLoading && auth?.accessToken) {
        const id = setInterval(async () => {
           await refresh()
        }, 840000)

        // clear the interval when the component is unmounted
        return () => clearInterval(id)
       }         
    }, [isLoading])

    return (
        <>
            {isLoading
                ?<p>Loading...</p>
                : <Outlet/>
            }
        </>
    )
}

export default PersistLogin