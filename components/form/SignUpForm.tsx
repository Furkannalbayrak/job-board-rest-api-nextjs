'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../GoogleSignInButton';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  });

const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {

    // const response = await axios.post("/api/users", values);  gereğinden fazla bilgi gönderir

    const response = await axios.post("/api/users", {
      username: values.username,
      email: values.email,
      password: values.password
    });

    if (response.status === 200 || response.status === 201) {
      router.push(`/role-selection?email=${values.email}`);
    }
    else {
      toast.error("Error", {
        description: "Oops! Something went wrong",
        action: {
          label: "Close",
          onClick: () => console.log("Undo"),
        },
      })
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Kullanıcı Adı</FormLabel>
                <FormControl>
                  <Input
                    placeholder='johndoe'
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='mail@example.com'
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Şifre</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='••••••••'
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Şifre Tekrar</FormLabel>
                <FormControl>
                  <Input
                    placeholder='••••••••'
                    type='password'
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className='w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all' type='submit'>
          Kayıt Ol
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">veya</span>
        </div>
      </div>

      <GoogleSignInButton>Google ile Kayıt Ol</GoogleSignInButton>

      <p className='text-center text-sm text-gray-600 mt-6'>
        Zaten hesabınız var mı?&nbsp;
        <Link className='font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all' href='/sign-in'>
          Giriş Yap
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;