import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  User2,
  Users,
} from 'lucide-react';
import { StatCardProps } from './types';
import { PersonIcon } from '@radix-ui/react-icons';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardData {
  totalRevenue: string;
  salesToday: string;
  totalCustomers: number;
  pendingOrders: number;
  returnItems: string;
  revenueChange: number;
  salesTodayChange: number;
  customerChange: number;
  orderChange: number;
  returnChange: number;
  customerStats: {
    total: number;
    silver: number;
    gold: number;
    platinum: number;
  };
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: '₱0',
    salesToday: '₱0',
    totalCustomers: 0,
    pendingOrders: 0,
    returnItems: '₱0',
    revenueChange: 0,
    salesTodayChange: 0,
    customerChange: 0,
    orderChange: 0,
    returnChange: 0,
    customerStats: {
      total: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
    },
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const fetchDashboardData = async () => {
    try {
      const salesResponse = await axios.get(
        'http://localhost:5000/api/sales/dashboard'
      );
      setDashboardData(salesResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/chart');
      setChartData(response.data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDashboardData();
    fetchChartData();

    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
      fetchChartData();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          },
          color: '#4B5563',
        },
      },
      title: {
        display: true,
        text: 'Performance Overview',
        font: {
          size: 18,
          family: 'Arial, sans-serif',
        },
        color: '#111827',
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: {
          size: 14,
          family: 'Arial, sans-serif',
        },
        bodyFont: {
          size: 12,
          family: 'Arial, sans-serif',
        },
        bodyColor: '#FFFFFF',
        titleColor: '#FFFFFF',
        borderColor: '#6B7280',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial, sans-serif',
          },
          color: '#6B7280',
        },
      },
      y: {
        grid: {
          color: '#E5E7EB',
          borderDash: [5, 5],
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial, sans-serif',
          },
          color: '#6B7280',
        },
      },
    },
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Sales Overview</h1>

      {/* Modern Chart Section */}
      <div className="w-full h-96">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Customer Stats Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Customer Overview</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="h-4 w-4" />}
            title="Total Customers"
            value={dashboardData.customerStats.total.toString()}
            trend={dashboardData.customerChange}
          />
          <StatCard
            icon={<User2 className="h-4 w-4" />}
            title="Silver Members"
            value={dashboardData.customerStats.silver.toString()}
            trend={0}
            className="bg-gray-100"
          />
          <StatCard
            icon={<User2 className="h-4 w-4" />}
            title="Gold Members"
            value={dashboardData.customerStats.gold.toString()}
            trend={0}
            className="bg-yellow-50"
          />
          <StatCard
            icon={<User2 className="h-4 w-4" />}
            title="Platinum Members"
            value={dashboardData.customerStats.platinum.toString()}
            trend={0}
            className="bg-purple-50"
          />
        </div>
      </div>

      {/* Sales Stats Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Sales Statistics</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<PersonIcon className="h-4 w-4" />}
            title="Total Revenue"
            value={dashboardData.totalRevenue}
            trend={dashboardData.revenueChange}
          />
          <StatCard
            icon={<DollarSign className="h-4 w-4" />}
            title="Sales Today"
            value={dashboardData.salesToday}
            trend={dashboardData.salesTodayChange}
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Pending/Out of Delivery Orders"
            value={dashboardData.pendingOrders.toString()}
            trend={dashboardData.orderChange}
          />
          <StatCard
            icon={<DollarSign className="h-4 w-4" />}
            title="Return and Refund Items"
            value={dashboardData.returnItems}
            trend={dashboardData.returnChange}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  trend = 0,
  className = '',
}: StatCardProps) {
  return (
    <Card className={`w-full h-full ${className}`}>
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
