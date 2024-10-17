// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { AuthService } from '../services/AuthService'; // Adjust import based on your structure

// const SignupComponent: React.FC = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
//   const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
//   const navigate = useNavigate();

//   const onSubmit = async (data: { name: string; email: string; password: string; role: string }) => {
//     try {
//       await AuthService.signup(data);
//       setSuccessMessage('You have successfully signed up!');
//       setTimeout(() => navigate('/login'), 2000);
//       setErrorMessage(undefined);
//     } catch (error) {
//       setErrorMessage(`Signup failed: ${error.message}`);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-center">
//         <h2>Sign Up! 👋</h2>
//         <p>Create your account by filling in the details below.</p>
//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <label htmlFor="name">Name</label>
//           <input {...register('name', { required: true })} id="name" placeholder="Your Name" />
//           {errors.name && <span>Name is required.</span>}

//           <label htmlFor="email">Email</label>
//           <input {...register('email', { required: true })} id="email" placeholder="example@gmail.com" />
//           {errors.email && <span>Please enter a valid email address.</span>}

//           <label htmlFor="password">Password</label>
//           <input {...register('password', { required: true })} id="password" placeholder="Password" />
//           {errors.password && <span>Password is required.</span>}

//           <button type="submit" className="btn btn-signup" disabled={!!(errors.name || errors.email || errors.password)}>Sign Up</button>
//         </form>

//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//         {successMessage && <p className="success-message">{successMessage}</p>}
//         <p>Already have an account? <a href="/login">Log In</a></p>
//       </div>
//     </div>
//   );
// };

// export default SignupComponent;
export {};
