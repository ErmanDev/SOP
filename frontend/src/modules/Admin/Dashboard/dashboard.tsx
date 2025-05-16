import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, TrendingUp, User2 } from 'lucide-react';
import { StatCardProps } from './types';
import { PersonIcon } from '@radix-ui/react-icons';
import { Line } from 'react-chartjs-2';
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

export default function Dashboard() {
  // Chart data and options
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Example months
    datasets: [
      {
        label: 'Sales',
        data: [500, 700, 800, 600, 900, 1000], // Example data
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.5, // Smooth curves
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Total Customers',
        data: [50, 60, 70, 65, 80, 90], // Example data
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.5,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Total Revenue',
        data: [1000, 1500, 2000, 1800, 2500, 3000], // Example data
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.5,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          },
          color: '#4B5563', // Modern gray color
        },
      },
      title: {
        display: true,
        text: 'Performance Overview',
        font: {
          size: 18,
          family: 'Arial, sans-serif',
        },
        color: '#111827', // Darker gray for the title
      },
      tooltip: {
        backgroundColor: '#1F2937', // Dark background for tooltips
        titleFont: {
          size: 14,
          family: 'Arial, sans-serif',
        },
        bodyFont: {
          size: 12,
          family: 'Arial, sans-serif',
        },
        bodyColor: '#FFFFFF', // White text
        titleColor: '#FFFFFF',
        borderColor: '#6B7280', // Border for tooltips
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide grid lines for a cleaner look
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial, sans-serif',
          },
          color: '#6B7280', // Modern gray for axis labels
        },
      },
      y: {
        grid: {
          color: '#E5E7EB', // Light gray grid lines
          borderDash: [5, 5], // Dashed grid lines
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

      {/* Stat Cards Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<PersonIcon className="h-4 w-4" />}
          title="Total Revenue"
          value="₱0"
          trend={0}
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          title="Sales Today"
          value="₱0"
          trend={0}
        />
        <StatCard
          icon={<User2 className="h-4 w-4" />}
          title="Total Customers"
          value="0"
          trend={0}
        />
        <StatCard
          icon={<DollarSign className="h-6 w-6" />}
          title="Pending/Out of Delivery Orders"
          value="0"
          trend={0}
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          title="Return and Refund Items"
          value="₱0"
          trend={0}
        />
      </div>
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
          {Math.abs(trend)}% from last
        </p>
      </CardContent>
    </Card>
  );
}
