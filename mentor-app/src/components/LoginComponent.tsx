// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { AuthService } from '../services/AuthService';

// const LoginComponent: React.FC = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
//   const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
//   const navigate = useNavigate();

//   const onSubmit = async (data: { email: string; password: string }) => {
//     try {
//       await AuthService.login(data.email, data.password);
//       setSuccessMessage('Login successful!');
//       setErrorMessage(undefined);
//       navigate('/dashboard');
//     } catch (error) {
//       setErrorMessage('Login failed: Invalid credentials or server error');
//       setSuccessMessage(undefined);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-center">
//         <h2>Login! 👋</h2>
//         <p>Enter your details to access your account.</p>
//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <label htmlFor="email">Email</label>
//           <input {...register('email', { required: true })} id="email" placeholder="abc@gmail.com" />
//           {errors.email && <span>This field is required</span>}

//           <label htmlFor="password">Password</label>
//           <input {...register('password', { required: true })} id="password" placeholder="password" />
//           {errors.password && <span>This field is required</span>}

//           <button type="submit" className="btn btn-signin" disabled={!!(errors.email || errors.password)}>Log In</button>
//         </form>
//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//         {successMessage && <p className="success-message">{successMessage}</p>}
//         <p>If you are a student? <a href="/signup">Sign Up Now</a></p>
//       </div>
//     </div>
//   );
// };

// export default LoginComponent;
export {};