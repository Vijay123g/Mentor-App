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

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    authService.login(data).then(response => {
      console.log('data and response',data,response);
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        navigate(`/${response.role}/dashboard`);
      } else {
        setErrorMessage('Invalid login credentials');
      }
    }).catch(() => {
      setErrorMessage('Login failed: Server error or invalid credentials');
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
