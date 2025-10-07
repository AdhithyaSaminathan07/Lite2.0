'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const router = useRouter();

  // Demo credentials
  const DEMO_CREDENTIALS = {
    email: 'demo@billzzy.com',
    password: 'demo123'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check against demo credentials
      if (formData.email === DEMO_CREDENTIALS.email && formData.password === DEMO_CREDENTIALS.password) {
        // Successful login - store auth state
        if (typeof window !== 'undefined') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', formData.email);
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setErrors({ general: 'Invalid email or password. Use demo credentials.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill demo credentials for testing
  const fillDemoCredentials = () => {
    setFormData({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password
    });
    setErrors({});
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
          Email Address
        </label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your email"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 text-left">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Link 
            href="/auth?mode=forgot" 
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Forgot password?
          </Link>
        </div>
        <input 
          id="password" 
          name="password" 
          type="password" 
          autoComplete="current-password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your password"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 text-left">{errors.password}</p>
        )}
      </div>

      {/* General Error Message */}
      {errors.general && (
        <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200">
          {errors.general}
        </div>
      )}

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full px-4 py-3 text-white font-semibold bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Signing in...
          </div>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Demo Credentials Section */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800 text-center mb-2">
          <strong>Demo Credentials:</strong>
        </p>
        <div className="text-xs text-blue-700 space-y-1">
          <p>Email: <strong>{DEMO_CREDENTIALS.email}</strong></p>
          <p>Password: <strong>{DEMO_CREDENTIALS.password}</strong></p>
        </div>
        <button
          type="button"
          onClick={fillDemoCredentials}
          disabled={isLoading}
          className="w-full mt-3 px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded border border-blue-300 hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          Auto-fill Demo Credentials
        </button>
      </div>
    </form>
  );
}