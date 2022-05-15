import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faCamera, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useForm, Controller } from "react-hook-form";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { PROFILE_PICTURE_PLACEHOLDER } from "../../utils/constants"
import useUser from '../../hooks/useUser';
import useAuth from "../../hooks/useAuth";
import { axiosPrivate } from "../../api/axios";
import { UPDATE_USER_MUTATION } from "../../graphql/Mutations";
import './styles/profile-edit.css'

const ProfileEdit  = () =>  {
  const navigate = useNavigate()
  const [profilePhoto, setProfilePhoto] = useState(PROFILE_PICTURE_PLACEHOLDER)
  const { auth } = useAuth()
  const [user, setUser] = useState({})
  const { data } = useUser()
  const [busy, setBusy] = useState(false)
  
  const { handleSubmit, reset, control, formState: { errors }} = useForm({
    defaultValues: {
      name: user.name || '',
      bio: user.bio || '',
      phone: user.phone || '',
      email: user.email || '',
    }
  });

  // set user data to state
  useEffect(() => {
      if (data) {
        setUser(data)
        reset(data)
    }
  }, [data]);
  
  // set user data to state
  useEffect(() => {
    if(user.photo) setProfilePhoto(user.photo)
  }, [user]);

   const urlPatternValidation = URL => {
     const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');    
     return regex.test(URL);
   }

  const onProfileImageChange = (e) => {
    const imageUrl = e.target.value.trim()
    const isValid = urlPatternValidation(imageUrl);
    if(isValid){
      setProfilePhoto(e.target.value)
    }else {
      setProfilePhoto(profilePhoto)
    }
  }

  const onSubmit = async ({ name, bio, email, phone, password }) => {
    setBusy(true)
    try {
        await axiosPrivate.post('', {
          query: UPDATE_USER_MUTATION,
            variables: {
              id: auth.id,
              input: {
                name,
                bio,
                email,
                phone,
                photo: profilePhoto,
                password
              }
            },
          withCredentials: true
          }).then(res => {
              const data = res.data
              if(!data?.errors) {
                navigate('/profile')
              } else {
                 throw new Error(res?.data?.errors[0]?.message)
              } 
              setBusy(false)
          })
    } catch (err) {
        setBusy(false)
       NotificationManager.error(err.message, 'Update Error', 3000);
    }
  }

  return (
      <div className="container">
        <div className="row justify-content-md-center">
        <div className="col-12 col-md-8">
        <div className="mb-4 mt-3">
          <Link to='/profile'>
             <FontAwesomeIcon icon={faAngleLeft}  className="back-arrow"/> Back
          </Link>
        </div>
        <div className="card card-reset">
          <div className="card-body">
              <div className="col text-start">
                <h5 className="card-title">Change Info</h5>
                <p className="card-text profile-sub-title-reset">Changes will be reflected to every services</p>
              </div>
            <div className="row d-flex">
                <div className="col-2 text-md-start align-self-center mt-4">
                   {profilePhoto && <img src={profilePhoto}
                    width={72} height={72}  className="rounded-3 profile-image-preview" alt={user.name} /> }
                
                   <FontAwesomeIcon icon={faCamera}  
                      className="edit-camera-icon"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                   />
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Profile photo</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <div className="mb-3">
                          <label htmlFor="profilePhotoUrl" className="form-label">Enter Image URL</label>
                            <input 
                               type="url" 
                               className="form-control"
                               id="profilePhotoUrl" 
                               placeholder="Enter new image url"
                               onChange={(e) => onProfileImageChange(e)}
                             />
                        </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Done</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="col-2 text-start align-self-center">
                <h4 className='user-info-label pt-2'>CHANGE PHOTO</h4>
            </div>
           <form onSubmit={handleSubmit(onSubmit)}>
            <div className='col-12'>
              <div className="mt-4 col-6">
                <label htmlFor="nameFormControlInput" className="form-label user-info-label">Name *</label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required', minLength: {
                    value: 3,
                    message: 'Name must be at least 3 characters'
                  }
                  , maxLength: {
                    value: 30,
                    message: 'Name must be at most 30 characters'
                  }}}
                  render={({ field }) => 
                    <input
                        {...field} 
                        type="text"
                        className="form-control"
                        autoComplete='off'
                        id="nameFormControlInput" 
                        placeholder="Enter your name..."
                    />
                 }
                /> 
              {errors?.name && <span className="text-danger">{errors.name.message}</span>}
              </div>
              <div className="mt-3  col-6">
                <label htmlFor="bioFormControlInput" className="form-label user-info-label">Bio *</label>
                 <Controller
                    name="bio"
                    control={control}
                    rules={{ required: 'Bio is required', minLength: {
                      value: 10,
                      message: 'Bio must be at least 10 characters'
                      }, maxLength: {
                        value: 100,
                        message: 'Bio must be at most 100 characters'
                     },
                    }}
                    render={({ field }) => 
                    <textarea
                        {...field}
                        autoComplete='off'
                        className="form-control" 
                        id="bioFormControlInput"
                        rows="4"
                        placeholder='Enter your bio...'
                      />
                  }
               />
               {/* errors will return when field validation fails  */}
              {errors.bio && <span className="text-danger">{errors.bio.message}</span>}
              </div>
              <div className="mt-3  col-6" >
                <label htmlFor="phoneFormControlInput" className="form-label user-info-label">Phone</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: false, minLength: {
                    value: 10,
                     message: 'Phone number must be at least 10 digits'
                  }
                   }}
                  render={({ field }) => 
                      <input
                        {...field}
                        type="text"
                        className="form-control"
                        autoComplete='off'
                        id="phoneFormControlInput"
                        placeholder="Enter your phone..."
                      />
                    }
                />
               {/* errors will return when field validation fails  */}
               {errors?.phone && <span className="text-danger">{errors.phone.message}</span>}
              </div>
              <div className="mt-3  col-6">
                <label htmlFor="emailFormControlInput" className="form-label user-info-label">Email *</label>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: 'Email is required', 
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 
                    message: 'Please enter a valid emaill addresss' } 
                  }}
                  render={({ field }) => 
                      <input
                        {...field}
                        type="email"
                        className="form-control"
                        autoComplete='off'
                        id="emailFormControlInput"
                        placeholder="Enter your email..."
                    />
                    }
                />
                {/* errors will return when field validation fails  */}
                {errors?.email && <span className="text-danger">{errors.email.message}</span>}
              </div>
              <div className="mt-3  col-6">
                <label htmlFor="passwordFormControlInput" className="form-label user-info-label">Password</label>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: false, minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }}}
                  render={({ field }) => 
                      <input
                        {...field}
                        type="text"
                        className="form-control"
                        autoComplete='off'
                        id="passwordFormControlInput"
                        placeholder="Enter new password..." 
                    />
                    }
                />
                 {/* errors will return when field validation fails  */}
                 {errors?.password && <span className="text-danger">{errors.password.message}</span>}
              </div>
              <div className="mt-4  col-6">
                <button type="submit" className="btn btn-primary  button-style">
                  { busy ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save" }
                </button>
             </div>
          </div>
         </form>
        </div>
        </div>
      </div>
     </div>
    </div>
    <NotificationContainer />
   </div>
  )
}

export default ProfileEdit;