import React from 'react';
import { useForm } from 'react-hook-form';
import authService from "../../services/AuthService";
import '../../styles/adminDashboard.css';

const AddFaculty: React.FC = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    authService.createFaculty(data).then(() => {
      alert('Faculty added successfully!');
    });
  };

  return (
    <div className="admin-add-faculty-container">
      <h2>Add Faculty</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label>Name</label>
          <input {...register('name', { required: true })} />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input {...register('email', { required: true })} />
        </div>
        <button type="submit">Add Faculty</button>
      </form>
    </div>
  );
};

export default AddFaculty;
