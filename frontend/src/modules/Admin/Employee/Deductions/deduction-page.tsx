import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sr-tabs";
import { Link, Outlet, useLocation } from "react-router-dom";
// import UsersList from "../users/user-list";
import DeductionList from "./deduction.lists";

const DeductionPage = () => {
  const location = useLocation();
  const currentTab = location.pathname.split("/").pop(); // Get current tab based on the route

  return (
    <Tabs defaultValue="deductions">
      <div className="flex items-center">
        <TabsList>
          <Link to={'deductions'}>
            <TabsTrigger value="deductions">Deductions</TabsTrigger>
            <TabsTrigger value="users-list">All</TabsTrigger>
          </Link>
            
          <Link to={"archive"}>
            <TabsTrigger value="aboutpage">Archive</TabsTrigger>
          </Link>
        </TabsList>
      </div>

        <TabsContent value={currentTab as string === "deduction" ? "deduction-list" : currentTab as string}>
          {currentTab === 'deductions' ? <DeductionList /> : <Outlet />}

        </TabsContent>
    </Tabs>
  )
}

export default DeductionPage
