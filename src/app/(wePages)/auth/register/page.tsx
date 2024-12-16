'use client';

import { z } from 'zod';
import AuthForm from '@/components/authform';
import { useRouter } from 'next/navigation';

// Validation schema for registration
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  email: z.string()
    .email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
});

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof registerSchema>) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Registration failed');
    }

    // Redirect to login page after successful registration
    router.push('/auth/login');
  };

  return (
    <AuthForm
      title="Create an account"
      subtitle="Enter your details to create your account"
      fields={[
        {
          name: 'username',
          label: 'Username',
          type: 'text',
          placeholder: 'Enter your username',
          autoComplete: 'username',
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
          autoComplete: 'email',
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
          autoComplete: 'new-password',
        },
      ]}
      submitLabel="Create account"
      loadingLabel="Creating account..."
      validationSchema={registerSchema}
      onSubmit={handleSubmit}
      linkText="Already have an account? Sign in"
      linkHref="/auth/login"
      defaultValues={{
        username: '',
        email: '',
        password: '',
      }}
      successMessage="Account created successfully! Redirecting to login..."
    />
  );
}
