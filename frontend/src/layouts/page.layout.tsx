import { Outlet } from 'react-router-dom';
const PageLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className=" mx-auto ">
        <Outlet />
      </main>
    </div>
  );
};

export default PageLayout;
