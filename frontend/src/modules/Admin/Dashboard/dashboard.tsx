import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, TrendingUp, User2 } from 'lucide-react';
import { StatCardProps } from './types';
import { PersonIcon } from '@radix-ui/react-icons';

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 ">
      <h1 className="text-2xl font-bold">Sales Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<PersonIcon className="h-4 w-4" />}
          title="Total Revenue"
          value="0"
          trend={0}
        />

        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          title="Sales Today"
          value="0"
          trend={3.7}
        />
        <StatCard
          icon={<User2 className="h-4 w-4" />}
          title="Total Customers"
          value="0"
          trend={-2.5}
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          title="Monthly Payroll"
          value="0"
          trend={0}
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          title="Monthly Payroll"
          value="0"
          trend={0}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend = 0 }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend >= 0 ? 'text-green-500' : 'text-red-500'
          } flex items-center`}
        >
          {trend >= 0 ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          {Math.abs(trend)}% from last
        </p>
      </CardContent>
    </Card>
  );
}
