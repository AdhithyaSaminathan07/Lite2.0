
// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react';

// export function LoginForm() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
//   const router = useRouter();
//   const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.currentTarget; setFormData(prev => ({ ...prev, [name]: value })); if (errors[name as keyof typeof errors]) { setErrors(prev => ({ ...prev, [name]: undefined })); } };
//   const validateForm = () => { const newErrors: { email?: string; password?: string } = {}; if (!formData.email) { newErrors.email = 'Email is required'; } else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Email is invalid'; } if (!formData.password) { newErrors.password = 'Password is required'; } else if (formData.password.length < 6) { newErrors.password = 'Password must be at least 6 characters'; } setErrors(newErrors); return Object.keys(newErrors).length === 0; };
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setIsLoading(true);
//     setErrors({});
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       if (formData.email === DEMO_CREDENTIALS.email && formData.password === DEMO_CREDENTIALS.password) {
//         if (typeof window !== 'undefined') {
//           localStorage.setItem('isAuthenticated', 'true');
//           localStorage.setItem('userEmail', formData.email);
//         }
//         router.push('/dashboard');
//       } else {
//         setErrors({ general: 'Invalid email or password. Use demo credentials.' });
//       }
//     } catch { // <<< FIXED: Removed unused 'error' variable from the catch block.
//       setErrors({ general: 'An error occurred. Please try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fillDemoCredentials = () => { setFormData({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password }); setErrors({}); };

//   const handleGoogleSignIn = async () => {
//     setIsLoading(true);
//     await signIn('google', { callbackUrl: '/dashboard' });
//   };

//   return (
//     <form className="space-y-6" onSubmit={handleSubmit} noValidate>
//       {/* ... The rest of your JSX remains exactly the same ... */}
//       <div> <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1"> Email Address </label> <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${ errors.email ? 'border-red-500' : 'border-gray-300' }`} placeholder="Enter your email" disabled={isLoading} /> {errors.email && ( <p className="mt-1 text-sm text-red-600 text-left">{errors.email}</p> )} </div> <div> <div className="flex items-center justify-between mb-1"> <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Password </label> <Link href="/auth?mode=forgot" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium" > Forgot password? </Link> </div> <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${ errors.password ? 'border-red-500' : 'border-gray-300' }`} placeholder="Enter your password" disabled={isLoading} /> {errors.password && ( <p className="mt-1 text-sm text-red-600 text-left">{errors.password}</p> )} </div> {errors.general && ( <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200"> {errors.general} </div> )} <button type="submit" disabled={isLoading} className="w-full px-4 py-3 text-white font-semibold bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed" > {isLoading ? ( <div className="flex items-center justify-center"> <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> Signing in... </div> ) : ( 'Sign In' )} </button>
//       <div className="relative flex py-2 items-center">
//         <div className="flex-grow border-t border-gray-300"></div>
//         <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
//         <div className="flex-grow border-t border-gray-300"></div>
//       </div>
//       <button
//         type="button"
//         onClick={handleGoogleSignIn}
//         disabled={isLoading}
//         className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.582-3.443-11.113-8.06l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.988,35.617,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
//         Sign in with Google
//       </button>
//       <div className="p-4 bg-blue-50 rounded-lg border border-blue-200"> <p className="text-xs text-blue-800 text-center mb-2"> <strong>Demo Credentials:</strong> </p> <div className="text-xs text-blue-700 space-y-1"> <p>Email: <strong>{DEMO_CREDENTIALS.email}</strong></p> <p>Password: <strong>{DEMO_CREDENTIALS.password}</strong></p> </div> <button type="button" onClick={fillDemoCredentials} disabled={isLoading} className="w-full mt-3 px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded border border-blue-300 hover:bg-blue-200 transition-colors disabled:opacity-50" > Auto-fill Demo Credentials </button> </div>
//     </form>
//   );
// }


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const router = useRouter();
  const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // --- START OF FIX ---
  // This handleSubmit function has been replaced to use next-auth's secure signIn method,
  // which works reliably on all devices, including mobile.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    // Use the 'signIn' function from next-auth for a secure, cookie-based session.
    const result = await signIn('credentials', {
      redirect: false, // Set to false to handle success/error manually in the component.
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      // If next-auth returns an error, it means authentication failed.
      setErrors({ general: 'Invalid email or password. Use demo credentials.' });
      setIsLoading(false); // Stop loading on failure
    } else if (result?.ok) {
      // If the result is ok and there's no error, the sign-in was successful.
      router.push('/dashboard');
    }
  };
  // --- END OF FIX ---


  const fillDemoCredentials = () => {
    setFormData({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
    setErrors({});
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {/* The rest of your JSX remains exactly the same */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1"> Email Address </label>
        <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${ errors.email ? 'border-red-500' : 'border-gray-300' }`} placeholder="Enter your email" disabled={isLoading} />
        {errors.email && ( <p className="mt-1 text-sm text-red-600 text-left">{errors.email}</p> )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Password </label>
          <Link href="/auth?mode=forgot" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium" > Forgot password? </Link>
        </div>
        <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${ errors.password ? 'border-red-500' : 'border-gray-300' }`} placeholder="Enter your password" disabled={isLoading} />
        {errors.password && ( <p className="mt-1 text-sm text-red-600 text-left">{errors.password}</p> )}
      </div>
      {errors.general && ( <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200"> {errors.general} </div> )}
      <button type="submit" disabled={isLoading} className="w-full px-4 py-3 text-white font-semibold bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed" >
        {isLoading ? ( <div className="flex items-center justify-center"> <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> Signing in... </div> ) : ( 'Sign In' )}
      </button>
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" >
        <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.582-3.443-11.113-8.06l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.988,35.617,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
        Sign in with Google
      </button>
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800 text-center mb-2"> <strong>Demo Credentials:</strong> </p>
        <div className="text-xs text-blue-700 space-y-1">
          <p>Email: <strong>{DEMO_CREDENTIALS.email}</strong></p>
          <p>Password: <strong>{DEMO_CREDENTIALS.password}</strong></p>
        </div>
        <button type="button" onClick={fillDemoCredentials} disabled={isLoading} className="w-full mt-3 px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded border border-blue-300 hover:bg-blue-200 transition-colors disabled:opacity-50" > Auto-fill Demo Credentials </button>
      </div>
    </form>
  );
}