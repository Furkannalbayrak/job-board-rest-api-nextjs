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
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { toast } from "sonner"

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have than 8 characters'),
});

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    // zodResolver(FormSchema): Formun içindeki her tuş vuruşunu Zod şemasına göre denetler. Eğer e-posta geçersizse, onSubmit fonksiyonun asla çalışmaz.
    resolver: zodResolver(FormSchema),

    // Formun ilk açılışındaki halidir. Next.js gibi SSR (Server Side Rendering) kullanan yapılarda boş bile olsa bunları tanımlamak "controlled component" hatalarını önler.
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {

    //Bu kod lib/auth.ts içindeki "async authorize(credentials) { }" burayı çalıştırıyor. email ve passwordu oraya fırlatıyor
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      toast.error("Error", {
        description: "Oops! Something went wrong",
        action: {
          label: "Close",
          onClick: () => console.log("Undo"),
        },
      })
    }
    else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='session-form space-y-6'>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='ornek@sirket.com'
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-gray-700 font-medium">Şifre</FormLabel>
                </div>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='••••••••'
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />
        </div>

        <Button className='w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all' type='submit'>
          Giriş Yap
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

      <GoogleSignInButton>Google ile Devam Et</GoogleSignInButton>

      <p className='text-center text-sm text-gray-600 mt-6'>
        Hesabınız yok mu?&nbsp;
        <Link className='font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all' href='/sign-up'>
          Kayıt Ol
        </Link>
      </p>
    </Form>
  );
};

export default SignInForm;