import { Outlet } from 'react-router-dom';
import ResetForm from '@/modules/Auth/reset-password/reset-form';

function ResetPage() {
  return (
    <div className="min-h-screen w-screen bg-[url(src/assets/background.jpg)] bg-center bg-cover overflow-hidden overflow-x-hidden">
      <div className="  ">
        <div className="text-center space-y-8"></div>
      </div>
      <ResetForm
        onSubmit={(credentials) => {
          console.log('Submitted credentials:', credentials);
        }}
      />
      <Outlet />
    </div>
  );
}

export default ResetPage;
