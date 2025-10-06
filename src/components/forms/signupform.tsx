// src/components/forms/SignUpForm.tsx

import React from 'react';
import Link from 'next/link';

export default function SignUpForm() {
  // NOTE: This is a placeholder. All form logic (state, handleSubmit, etc.) goes here.
  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left mb-1">
          Full Name
        </label>
        <input 
          id="name" 
          name="name" 
          type="text" 
          required 
          // CRITICAL: w-full for responsiveness
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
          Email Address
        </label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          // CRITICAL: w-full for responsiveness
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1">
          Password
        </label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          // CRITICAL: w-full for responsiveness
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button 
        type="submit" 
        // CRITICAL: w-full for responsiveness
        className="w-full px-4 py-2 text-white font-semibold bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
      >
        Create Account
      </button>
    </form>
  );
}