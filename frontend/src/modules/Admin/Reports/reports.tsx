import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';
import {
  Download,
  FileText,
  TrendingDown,
  TrendingUp,
  Users,
  DollarSign,
  Package,
} from 'lucide-react';

// Sample data for reports
const salesData = [
  { name: 'Jan', sales: 4000, profit: 2400 },
  { name: 'Feb', sales: 3000, profit: 1398 },
  { name: 'Mar', sales: 2000, profit: 9800 },
  { name: 'Apr', sales: 2780, profit: 3908 },
  { name: 'May', sales: 1890, profit: 4800 },
  { name: 'Jun', sales: 2390, profit: 3800 },
  { name: 'Jul', sales: 3490, profit: 4300 },
];

const inventoryData = [
  { name: 'Products', value: 400 },
  { name: 'Categories', value: 300 },
  { name: 'Suppliers', value: 300 },
  { name: 'Low Stock', value: 200 },
];

const payrollData = [
  { name: 'Jan', total: 250000, paid: 230000 },
  { name: 'Feb', total: 280000, paid: 270000 },
  { name: 'Mar', total: 300000, paid: 290000 },
  { name: 'Apr', total: 320000, paid: 310000 },
  { name: 'May', total: 350000, paid: 340000 },
  { name: 'Jun', total: 380000, paid: 370000 },
  { name: 'Jul', total: 400000, paid: 390000 },
];

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: number;
}

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>('sales');
  const [dateRange, setDateRange] = useState<string>('monthly');

  const handleExport = () => {
    let dataToExport;
    let fileName;

    switch (selectedReport) {
      case 'sales':
        dataToExport = salesData;
        fileName = `sales_report_${dateRange}_${
          new Date().toISOString().split('T')[0]
        }.csv`;
        break;
      case 'inventory':
        dataToExport = inventoryData;
        fileName = `inventory_report_${dateRange}_${
          new Date().toISOString().split('T')[0]
        }.csv`;
        break;
      case 'payroll':
        dataToExport = payrollData;
        fileName = `payroll_report_${dateRange}_${
          new Date().toISOString().split('T')[0]
        }.csv`;
        break;
      default:
        return;
    }

    // Convert data to CSV format
    const headers = Object.keys(dataToExport[0]);
    const csvContent = [
      headers.join(','),
      ...dataToExport.map((row) =>
        headers.map((header) => row[header]).join(',')
      ),
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatCards = () => {
    switch (selectedReport) {
      case 'sales':
        return (
          <>
            <StatCard
              icon={<DollarSign className="h-4 w-4" />}
              title="Total Sales"
              value="₱45,231.89"
              trend={0}
            />
            <StatCard
              icon={<FileText className="h-4 w-4" />}
              title="Total Orders"
              value="2,350"
              trend={0}
            />
            <StatCard
              icon={<DollarSign className="h-4 w-4" />}
              title="Average Order Value"
              value="₱1,200"
              trend={0}
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Profit Margin"
              value="32.5%"
              trend={0}
            />
          </>
        );
      case 'inventory':
        return (
          <>
            <StatCard
              icon={<Package className="h-4 w-4" />}
              title="Total Products"
              value="1,234"
              trend={0}
            />
            <StatCard
              icon={<Package className="h-4 w-4" />}
              title="Low Stock Items"
              value="45"
              trend={0}
            />
            <StatCard
              icon={<DollarSign className="h-4 w-4" />}
              title="Inventory Value"
              value="₱234,567"
              trend={0}
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Stock Turnover"
              value="4.2x"
              trend={0}
            />
          </>
        );
      case 'payroll':
        return (
          <>
            <StatCard
              icon={<Users className="h-4 w-4" />}
              title="Total Employees"
              value="45"
              trend={0}
            />
            <StatCard
              icon={<DollarSign className="h-4 w-4" />}
              title="Total Payroll"
              value="₱450,000"
              trend={0}
            />
            <StatCard
              icon={<DollarSign className="h-4 w-4" />}
              title="Average Salary"
              value="₱10,000"
              trend={0}
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4" />}
              title="Payroll Efficiency"
              value="98.5%"
              trend={0}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderChart = () => {
    switch (selectedReport) {
      case 'sales':
        return (
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Sales & Profit Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" />
                    <Bar dataKey="profit" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 'inventory':
        return (
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 'payroll':
        return (
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Payroll Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={payrollData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" />
                    <Bar dataKey="paid" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <select
            className="border rounded-md px-3 py-2"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            selectedReport === 'sales'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setSelectedReport('sales')}
        >
          Sales Report
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            selectedReport === 'inventory'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setSelectedReport('inventory')}
        >
          Inventory Report
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            selectedReport === 'payroll'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setSelectedReport('payroll')}
        >
          Payroll Report
        </button>
      </div>

      {/* Stat Cards Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {renderStatCards()}
      </div>

      {/* Chart Section */}
      <div className="grid gap-4 grid-cols-1">{renderChart()}</div>
    </div>
  );
}

function StatCard({ icon, title, value, trend = 0 }: StatCardProps) {
  return (
    <Card className="w-full h-full">
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
          {Math.abs(trend)}% from last period
        </p>
      </CardContent>
    </Card>
  );
}
