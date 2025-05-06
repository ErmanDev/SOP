import { Outlet } from 'react-router-dom';
import ForgotPasswordForm from './forgot-password-form';

function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-screen bg-[url(src/assets/background.jpg)] bg-center bg-cover overflow-hidden overflow-x-hidden">
      <div className="  ">
        <div className="text-center space-y-8"></div>
      </div>
      <ForgotPasswordForm />
      <Outlet />
    </div>
  );
}

export default ForgotPasswordPage;
