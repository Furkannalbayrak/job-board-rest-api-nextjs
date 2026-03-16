import SignInForm from '@/components/form/SignInForm';

const page = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border mb-28 border-gray-100'>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Giriş Yap</h1>
          <p className="text-sm text-gray-500 mt-2">Hesabınıza erişmek için bilgilerinizi girin</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
};

export default page;