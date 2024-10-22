import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/AuthService';
import '../../styles/signup.css';

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  role: string;
}

const Signup: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>({
    defaultValues: { role: 'Student' }
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupFormInputs> = (data) => {
    data.role = 'Student';
    console.log('signup Data',data);
    authService.signup(data).then(response => {
      if (response) {
        setSuccessMessage('You have successfully signed up!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMessage('Signup failed. Please try again.');
      }
    }).catch(() => {
      setErrorMessage('Signup failed: Server error or invalid data');
    });
  };

  return (
    <div className="auth-signup-container">
      <div className="auth-center">
        <h2>Sign Up! 👋</h2>
        <p>Create your account by filling in the details below.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Name</label>
          <input
            {...register('name', { required: 'Name is required', minLength: 2 })}
            placeholder="Your Name"
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}

          <label>Email</label>
          <input
            {...register('email', { required: 'Email is required', pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })}
            placeholder="example@gmail.com"
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required', minLength: 8 })}
            placeholder="Password"
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
          
          <button type="submit" className="btn btn-signup">Sign Up</button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <p>Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
};

export default Signup;
