import SignUpForm from '@/components/form/SignUpForm';

const page = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-10 pb-20'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Kayıt Ol</h1>
          <p className="text-sm text-gray-500 mt-2">
            Hemen hesabınızı oluşturun ve ilanlara göz atın
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default page;