import React, { useEffect, useState } from "react";
import './styles/profile.css'
import { Link } from "react-router-dom";
import moment from 'moment';
import { PROFILE_PICTURE_PLACEHOLDER } from "../../utils/constants"
import useUser from '../../hooks/useUser'

 const Profile = () =>  {
   const [profilePhoto] = useState(PROFILE_PICTURE_PLACEHOLDER)
   const [user, setUser] = useState({})
   const { data } = useUser()

   useEffect(() => {
      if (data) {
        setUser(data)
      }
   }, [data]);

   return (
     <div className="container">
      <div className="row justify-content-md-center">
      <div className="col-md-8 mb-2 text-center">
        <h3 className='page-header-text'>Personal info</h3>
        <p  className='page-header-subtext'>Basic info, like your name and photo</p>
        { user?.lastLogin && <p className="last-seen-date">Last seen: <b>{ user && moment(parseInt(user.lastLogin)).format("DD MMM YYYY, hh:mm A") }</b></p> }
      </div>
      <div className="col-12 col-md-8">
       <div className="card card-reset">
        <div className="card-body">
          <div className="row">
            <div className="col text-start">
               <h5 className="card-title">Profile</h5>
               <p className="card-text profile-sub-title-reset">Some info may be visible to other people</p>
            </div>
            <div className="col text-end">
               <Link className="btn btn-outline-secondary edit-button-reset" to='/edit-profile'> Edit</Link>
            </div>
          </div>
         </div>
        <ul className="list-group list-group-flush">
            <li className="list-group-item reset-list-group-item-border">
             <div className="row d-flex">
                <div className="col-4 text-start align-self-center">
                   <h4 className='user-info-label pt-2'>PHOTO</h4>
                </div>
                <div className="col-8 text-end text-sm-end text-md-start align-self-center">
                  { user.photo && <img src={user.photo? user.photo : profilePhoto} width={72} height={72}  className="rounded-3 profile-image" alt="user" />}
              </div>
             </div>
            </li>
            <li className="list-group-item reset-list-group-item-border">
              <div className="row d-flex">
                  <div className="col-4 text-start align-self-center">
                    <h4 className='user-info-label pt-2'>NAME</h4>
                  </div>
                  <div className="col-8 text-end text-sm-end  text-md-start align-self-center">
                   <h5  className='user-info-data pt-3'> {user.name? user.name : "Not Available" }</h5>
                </div>
              </div>
            </li>
            <li className="list-group-item reset-list-group-item-border">
              <div className="row d-flex">
                  <div className="col-4 text-start align-self-center">
                    <h4 className='user-info-label pt-2'>BIO</h4>
                  </div>
                  <div className="col-8 text-end text-sm-end  text-md-start align-self-center">
                   <h5  className='user-info-data pt-3'>{user.bio? user.bio : "Not Available" }</h5>
                </div>
              </div>
            </li>
            <li className="list-group-item reset-list-group-item-border">
              <div className="row d-flex">
                  <div className="col-4 text-start align-self-center">
                    <h4 className='user-info-label pt-2'>PHONE</h4>
                  </div>
                  <div className="col-8 text-end text-sm-end  text-md-start align-self-center">
                   <h5  className='user-info-data pt-3'>{user.phone? user.phone : "Not Available" }</h5>
                </div>
              </div>
            </li>
            <li className="list-group-item reset-list-group-item-border">
              <div className="row d-flex">
                  <div className="col-4 text-start align-self-center">
                    <h4 className='user-info-label pt-2'>EMAIL</h4>
                  </div>
                  <div className="col-8 text-end text-sm-end  text-md-start align-self-center">
                   <h5  className='user-info-data pt-3'>{user.email? user.email : "Not Available" }</h5>
                </div>
              </div>
            </li>
            <li className="list-group-item reset-list-group-item-border">
            <div className="row d-flex">
                <div className="col-4 text-start align-self-center">
                  <h4 className='user-info-label pt-2'>PASSWORD</h4>
                </div>
                <div className="col-8 text-end text-sm-end  text-md-start align-self-center">
                  <h5  className='user-info-data pt-2'>************</h5>
              </div>
            </div>
         </li>
        </ul>
       </div>
     </div>
    </div>
   </div>
   )
}

export default Profile