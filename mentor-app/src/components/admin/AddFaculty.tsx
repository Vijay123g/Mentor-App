import React from 'react';
import { useForm } from 'react-hook-form';
import authService from "../../services/AuthService";
import '../../styles/addFaculty.css';
import { AxiosError } from 'axios';

const AddFaculty: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const onSubmit = async (data: any) => {
    const formData = { ...data, role: 'Faculty' };
    setErrorMessage(null);

    try {
        await authService.createFaculty(data);
        alert('Faculty added successfully!');
    } catch (error: unknown) {
        if (isAxiosError(error) && error.response) {
            if (error.response.status === 422) {
                setErrorMessage('Failed to add faculty. Please check the input.');
            } else {
                setErrorMessage('Something went wrong. Please try again later.');
            }
        } else {
            setErrorMessage('Something went wrong. Please try again later.');
        }
    }
};


const isAxiosError = (error: unknown): error is AxiosError => {
    return (error as AxiosError).isAxiosError !== undefined;
};


  return (
    <div className="admin-add-faculty-container">
      <h2>Add Faculty</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-field">
    <label>Name</label>
    <input {...register('name', { required: 'Name is required' })} />
    {errors.name && <p style={{ color: 'red' }}>{(errors.name as any).message}</p>}
</div>
<div className="form-field">
    <label>Email</label>
    <input {...register('email', { 
        required: 'Email is required', 
        pattern: { value: /^\S+@\S+$/, message: 'Invalid email format' } 
    })} />
    {errors.email && <p style={{ color: 'red' }}>{(errors.email as any).message}</p>}
</div>
<div className="form-field">
    <label>Password</label>
    <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters long' } })} />
    {errors.password && <p style={{ color: 'red' }}>{(errors.password as any).message}</p>}
</div>
        <button type="submit">Add Faculty</button>
      </form>
    </div>
  );
};

export default AddFaculty;
