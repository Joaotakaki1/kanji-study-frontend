import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import apiClient from '../lib/apiClient';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormInputs = z.infer<typeof RegisterSchema>;

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setSubmitError('');
      const response = await apiClient.post('/api/v1/auth/register', data);
      
      // If registration is successful, automatically log the user in
      if (response.status === 201 && response.data.user) {
        try {
          const loginResponse = await apiClient.post('/api/v1/auth/login', {
            email: data.email,
            password: data.password,
          });
          
          // Auto-login the user and redirect to dashboard
          login(loginResponse.data.token, loginResponse.data.user);
          router.push('/dashboard');
        } catch {
          // If auto-login fails, redirect to login page with success message
          router.push({
            pathname: '/login',
            query: { success: 'Account created! Please log in.' },
          });
        }
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError('email', { type: 'manual', message: 'Invalid data. Please check your inputs.' });
        } else if (status === 409) {
          setError('email', { type: 'manual', message: 'Email already in use.' });
        } else {
          setSubmitError('Registration failed. Please try again.');
        }
      } else {
        setSubmitError('Network error. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full border px-3 py-2 rounded"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full border px-3 py-2 rounded"
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full border px-3 py-2 pr-10 rounded"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
