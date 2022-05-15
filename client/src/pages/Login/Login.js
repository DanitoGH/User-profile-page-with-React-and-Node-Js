import React, { useState } from "react"
import './Login.css'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
 import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
 import { faFacebook, faGoogle, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'
 import { NotificationContainer, NotificationManager } from 'react-notifications';

 import useAuth from "../../hooks/useAuth";
import { axiosPrivate } from "../../api/axios";
import { LOGIN_USER_MUTATION } from "../../graphql/Mutations";

const Login = () =>  {
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/profile"
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [busy, setBusy] = useState(false)


  const onSubmit = async ({ email , password }) => {
       setBusy(true)
      try {
          await axiosPrivate.post('', {
            query: LOGIN_USER_MUTATION,
            variables: { 
              input: { email, password }
            },
           }).then(res => {
              const data = res.data
              if(!data?.errors) {
                 const { id, accessToken, lastLogin } =  res?.data?.data?.userLogin
                 setAuth({ id, accessToken, lastLogin })
                 navigate( from, { replace: true } )
              } else {
                 throw new Error(res?.data?.errors[0]?.message)
              } 
              setBusy(false)
           })
      } catch (err) {
          setBusy(false)
          NotificationManager.error(err.message, 'Login Error', 3000);
      }
   }
  
   return (
      <form className='auth-inner' onSubmit={handleSubmit(onSubmit)}>
        <h3 className='text-start login-title'>Login</h3>
        <div className="input-group mb-3">
         <span className="input-group-text" id="basic-addon1">
            <FontAwesomeIcon icon={faEnvelope} color="#828282"/>
         </span>
          <input
            className="form-control form-inputs"
            type="email"
            placeholder="Email"
            autoComplete='off'
            {...register("email", 
              { required: 'Email is required', 
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 
              message: 'Please enter a valid emaill addresss' }}
            )}
          />
          {/* errors will return when field validation fails  */}
          {errors?.email && <span className="text-danger">{errors.email.message}</span>}
        </div>
        <div className="input-group mb-4"> 
         <span className="input-group-text" id="basic-addon1">
            <FontAwesomeIcon icon={faLock} color="#828282"/>
         </span>
          <input
            type="password"
            className="form-control  form-inputs"
            placeholder="Password"
            autoComplete='off'
            {...register("password", { required: 'Password is required', minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
             }},
            )}
          />
          {/* errors will return when field validation fails  */}
          {errors.password && <span className="text-danger">{errors.password.message}</span>}
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary  register-button">
            {busy? "Please wait..." : "Login"}
          </button>
        </div>
        <div className="container">
        <div className="row">
          <div className='text-center'>
            <p className='mt-4 continue-with-social-text'>or continue with these social profile</p>
            <ul className="social-network social-circle">
              <li>
                  <a href="#" className="icoFacebook" title="Facebook">
                     <FontAwesomeIcon icon={faGoogle} color="#828282"/>
                </a>
               </li>
               <li> <a href="#" className="icoFacebook" title="Facebook">
                     <FontAwesomeIcon icon={faFacebook} color="#828282"/>
                </a>
              </li>
              <li><a href="#" className="icoTwitter" title="Twitter">
                  <FontAwesomeIcon icon={faTwitter} color="#828282"/>
                </a></li>
                <li><a href="#" className="icoTwitter" title="Twitter">
                  <FontAwesomeIcon icon={faGithub} color="#828282"/>
                </a></li>
            </ul>
          </div>
        </div>
      </div>
        <p className="forgot-password text-center mt-3 already-a-member">
           Don't have an account yet? <Link to="/register">Register</Link>
        </p>
        <NotificationContainer/>
      </form>
    )
  }

  export default Login;