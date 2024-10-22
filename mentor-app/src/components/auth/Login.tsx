import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import '../../styles/login.css';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    authService.login(data).then((response) => {
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);

        if (response.role === 'Admin') {
          navigate('/admin');
        } else if (response.role === 'Faculty') {
          navigate('/faculty');
        } else if (response.role === 'Student') {
          navigate('/student');
        }
      } else {
        setErrorMessage('Invalid credentials, please try again.');
      }
    }).catch((error) => {
      setErrorMessage('Login failed: ' + error.message);
    });
  };
  return (
    <div className="login-container">
      <div className="login-center">
        <h2>Login! 👋</h2>
        <p>Enter your details to access your account.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input {...register('email', { required: 'Email is required' })} placeholder="abc@gmail.com" />
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          <label>Password</label>
          <input type="password" {...register('password', { required: 'Password is required' })} placeholder="password" />
          {errors.password && <p className="error-message">{errors.password.message}</p>}

          <button type="submit" className="btn btn-signin">Log In</button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p>If you are a student, <a href="/signup">Sign Up Now</a></p>
      </div>
    </div>
  );
};

export default Login;
