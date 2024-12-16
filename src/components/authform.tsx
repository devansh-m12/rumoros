'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: FormField[];
  submitLabel: string;
  loadingLabel: string;
  validationSchema: z.ZodObject<any>;
  onSubmit: (values: any) => Promise<void>;
  linkText: string;
  linkHref: string;
  defaultValues: Record<string, string>;
  successMessage?: string;
}

export default function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  loadingLabel,
  validationSchema,
  onSubmit,
  linkText,
  linkHref,
  defaultValues,
  successMessage,
}: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit(values);
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="relative h-full w-full max-w-md bg-black px-8 py-12 md:h-auto md:rounded-2xl md:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
        <div className="absolute left-0 top-0 h-16 w-16 rounded-tl-2xl border-l-2 border-t-2 border-white/10" />
        <div className="absolute bottom-0 right-0 h-16 w-16 rounded-br-2xl border-b-2 border-r-2 border-white/10" />

        <div className="relative space-y-8">
          <div className="space-y-2">
            <h2 className="text-center text-3xl font-bold tracking-tight text-white">
              {title}
            </h2>
            <p className="text-center text-sm text-gray-400">{subtitle}</p>
          </div>

          {successMessage && (
            <div className="animate-fade-in rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-gray-300 backdrop-blur-sm">
              {successMessage}
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(handleSubmit)(e);
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {fields.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">
                          {field.label}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...formField}
                            type={field.type}
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete}
                            className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-200 focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20"
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-400" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative flex w-full justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-medium transition-all duration-300 ${
                    loading
                      ? 'bg-white/10 text-transparent'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  } focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50`}
                >
                  {/* Animated dots for loading state */}
                  {loading && (
                    <div className="absolute left-1/2 flex -translate-x-1/2 space-x-1">
                      <div className="h-2 w-2 animate-[bounce_1s_infinite_0ms] rounded-full bg-white"></div>
                      <div className="h-2 w-2 animate-[bounce_1s_infinite_200ms] rounded-full bg-white"></div>
                      <div className="h-2 w-2 animate-[bounce_1s_infinite_400ms] rounded-full bg-white"></div>
                    </div>
                  )}
                  <span className={loading ? 'invisible' : 'visible'}>
                    {submitLabel}
                  </span>
                </button>
              </div>
            </form>
          </Form>

          <div className="text-center text-sm">
            <Link
              href={linkHref}
              className="font-medium text-blue-400 transition-colors duration-200 hover:text-blue-500"
            >
              {linkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}