import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
 import { faUser, faUserGroup, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
 import { PROFILE_PICTURE_PLACEHOLDER } from "../../utils/constants"
 import './Navbar.css'
 import 'bootstrap/dist/js/bootstrap.bundle.min'

import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser"
import useLogout from '../../hooks/useLogout'

 const Navbar = () => {
    const { auth } = useAuth()
    const { data } = useUser()
    const [user, setUser] = useState()
  
    const logout = useLogout();
    const navigate = useNavigate()

    useEffect(() => {
      setUser(data)
    },[data])

    const buildUsername = () => {
      if (user) {
          return user?.name? user.name.toString().split(' ')[0] : 'User'
      }
    }

    const buildUserImage = () => {
      if (user) {
        return user?.photo? user.photo : PROFILE_PICTURE_PLACEHOLDER
      }
    }

    const handleLogout = async () => {
      await logout();
      navigate('/')
    }

    const DisplayDropdownMenu = () => {
      return(
        <form className="d-flex px-5">
        <div className="collapse navbar-collapse  d-flex" id="navbarNavDarkDropdown">
        <ul className="navbar-nav">
            <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
               { user && <img src={ buildUserImage() } width={30} height={30} className="rounded-3" alt="user" />}
               { user && <span className='p-2'>{ buildUsername() }</span> }
            </Link>
            <ul className="dropdown-menu" aria-labelledby="navbarDarkDropdownMenuLink">
                <li>
                <Link className="dropdown-item" to="/profile"> 
                  <FontAwesomeIcon icon={faUser} color="#828282"/> 
                  <span className='p-1'> My Profile</span>
                 </Link>
                </li>
                <li>
                <Link className="dropdown-item" to="#"> 
                  <FontAwesomeIcon icon={faUserGroup} color="#828282"/> 
                  <span className='p-1'> Group Chat</span>
                 </Link>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li>
                 <Link className="dropdown-item logout-button" to="#"> 
                   <FontAwesomeIcon icon={faArrowRightFromBracket} color="#EB5757"/> 
                    <span className='p-1 w-100' onClick={handleLogout}>Logout</span> 
                 </Link>
               </li>
           </ul>
          </li>
        </ul>
       </div>
     </form>
      )
    }

    return (
       <nav className="navbar navbar-expand-lg">
        <div className="container-fluid  px-5">
            <Link className="navbar-brand" to="#">devchanleges</Link>
          { auth?.accessToken && <DisplayDropdownMenu /> }
        </div>
      </nav>
     )
 }

 export default Navbar;
