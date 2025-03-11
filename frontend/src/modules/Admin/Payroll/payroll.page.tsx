import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/sr-tabs';
import { useState } from 'react';
// import ManagerList from "./asm.payrol";
import TechinicianList from './fts.payroll';
import PayrollList from './payroll.list';

const PayrollPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="managers">Area Sales Manager</TabsTrigger>
          <TabsTrigger value="technicians">Field Technicians</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all">
        <PayrollList />
      </TabsContent>

      {/* <TabsContent value="managers">
        <ManagerList />
      </TabsContent> */}

      <TabsContent value="technicians">
        <TechinicianList />
      </TabsContent>
    </Tabs>
  );
};

export default PayrollPage;
