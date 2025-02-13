import { Outlet } from "react-router-dom"
const PageLayout = () => {
  return (
    <div className="min-h-screen bg-white">
    <main className="max-w-6xl mx-auto px-4 py-16">
      <Outlet />
    </main>
  </div>
)}

export default PageLayout
