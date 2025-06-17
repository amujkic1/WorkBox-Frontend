import React, { useState } from 'react'
import '../assets/sb-admin-2.css'
import registerGif from '../assets/images/3.gif';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Login = () => {

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [errorMessage, setErrorMessage] = useState('');
const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();
  fetch('http://localhost:8080/auth/authenticate', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({email, password})
  })
  .then(async response => {
    if(response.ok){
      const { token } = await response.json()
      console.log("Login successfull")
      Cookies.set("token", token)
 
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role;

      switch (role) {
        case 'HR':
          navigate('/hr');
          break;
        case 'FINANCE_MANAGER':
          navigate('/finance');
          break;
        case 'BUSINESS_MANAGER':
          navigate('/business');
          break;
        default:
          navigate('/');
      } 

    } else {
      return response.json().then(data => {
        console.error(data.message)
        setErrorMessage('Failed to login. Please try again.')
        throw new Error(data.message)
      })
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    setErrorMessage('Failed to login. Please try again.');
  });
}

  return (
    <div className="bg-gradient-primary" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                 
                  <div className="col-lg-5 d-none d-lg-block p-3 mt-5">
                   <img
                     src={registerGif}
                     alt="Registration visual"
                     className="img-fluid"
                     style={{ maxHeight: '100%', objectFit: 'cover' }}
                   />
                 </div>
                 
                 
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                      </div>
                      <form className="user" onSubmit={handleLogin}>
                        <div className="form-group">
                          <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="form-control form-control-user"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Enter Email Address..."
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder="Password"
                          />
                        </div>
                        <div className="form-group">
                          <div className="custom-control custom-checkbox small">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck"
                            />
                            <label className="custom-control-label" htmlFor="customCheck">
                              Remember Me
                            </label>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-user btn-block">
                          Login
                        </button>
                        <hr />
                        
                      </form>
                      <hr />
                      <div className="text-center">
                        <a className="small" href="#">Forgot Password?</a>
                      </div>
                      <div className="text-center">
                        <a className="small" href="#">Create an Account!</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                {errorMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"
                  onClick={() => setErrorMessage('')}>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
