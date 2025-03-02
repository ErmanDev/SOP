import { Outlet } from 'react-router-dom';
import { LoginForm } from '@/components/login-form';

function LoginPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6 lg:px-8 overflow-hidden overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">AGROPRO</h1>
          <div className="flex justify-center"></div>
        </div>
      </div>
      <LoginForm />
      <Outlet />
    </div>
  );
}

export default LoginPage;
