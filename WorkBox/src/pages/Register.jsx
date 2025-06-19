import React, { useState } from 'react';
import '../assets/sb-admin-2.css';
import registerGif from '../assets/images/3.gif';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Repeat password is required'),
  role: yup.string().required('Role is required'),
});

const Register = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const { firstName, lastName, email, password, role } = data;

    const requestBody = {
      firstName,
      lastName,
      username: 'user', 
      email,
      password,
      role,
    };

    fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (response.ok) {
          const { token } = await response.json();
          Cookies.set('token', token);
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
          const data = await response.json();
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('Registration error:', error);
        setErrorMessage('Failed to register. Please try again.');
      });
  };

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
                  <div className="col-lg-7">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                      </div>

                      <form className="user" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group row">
                          <div className="col-sm-6 mb-3 mb-sm-0">
                            <input
                              type="text"
                              {...register('firstName')}
                              className="form-control form-control-user"
                              placeholder="First Name"
                            />
                            <p className="text-danger small">{errors.firstName?.message}</p>
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="text"
                              {...register('lastName')}
                              className="form-control form-control-user"
                              placeholder="Last Name"
                            />
                            <p className="text-danger small">{errors.lastName?.message}</p>
                          </div>
                        </div>

                        <div className="form-group">
                          <input
                            type="email"
                            {...register('email')}
                            className="form-control form-control-user"
                            placeholder="Email Address"
                          />
                          <p className="text-danger small">{errors.email?.message}</p>
                        </div>

                        <div className="form-group row">
                          <div className="col-sm-6 mb-3 mb-sm-0">
                            <input
                              type="password"
                              {...register('password')}
                              className="form-control form-control-user"
                              placeholder="Password"
                            />
                            <p className="text-danger small">{errors.password?.message}</p>
                          </div>
                          <div className="col-sm-6">
                            <input
                              type="password"
                              {...register('repeatPassword')}
                              className="form-control form-control-user"
                              placeholder="Repeat Password"
                            />
                            <p className="text-danger small">{errors.repeatPassword?.message}</p>
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-sm-12 mb-3 mb-sm-0">
                            
                          <select
                                className="form-select"
                                defaultValue=""
                                {...register('role')}
                              >
                                <option value="" disabled hidden>Select your role</option>
                                <option value="BUSINESS_MANAGER">Business manager</option>
                                <option value="FINANCE_MANAGER">Finance manager</option>
                                <option value="HR">Human resources</option>
                              </select>


                            <p className="text-danger small">{errors.role?.message}</p>
                          </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-user btn-block">
                          Register Account
                        </button>
                        <hr />
                      </form>

                      <hr />
                      <div className="text-center">
                        <a className="small" href="#">Forgot Password?</a>
                      </div>
                      <div className="text-center">
                        <a className="small" href="/">Already have an account? Login!</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                {errorMessage}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setErrorMessage('')}
                ></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
