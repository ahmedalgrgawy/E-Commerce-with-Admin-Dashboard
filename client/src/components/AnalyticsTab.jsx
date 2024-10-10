import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import axiosInstance from "../lib/axiosInstance";
import AnalyticsCard from "./AnalyticsCard ";
import LoadingSpinner from "./LoadingSpinner";

export const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {

        const response = await axiosInstance.get("/analytics");

        setAnalyticsData(response.data.analyticsData);

        setDailySalesData(response.data.dailySalesData);

      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <AnalyticsCard
          title='Total Users'
          value={analyticsData.users}
          icon={Users}
          color='from-emerald-500 to-teal-700'
        />
        <AnalyticsCard
          title='Total Products'
          value={analyticsData.products}
          icon={Package}
          color='from-emerald-500 to-green-700'
        />
        <AnalyticsCard
          title='Total Sales'
          value={analyticsData.totalSales}
          icon={ShoppingCart}
          color='from-emerald-500 to-cyan-700'
        />
        <AnalyticsCard
          title='Total Revenue'
          value={`$${analyticsData.totalMoney}`}
          icon={DollarSign}
          color='from-emerald-500 to-lime-700'
        />
      </div>

      <div>
        <h1 className="text-center text-4xl font-bold my-8">Daily Sales</h1>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {dailySalesData.map((data, index) => (
          <div key={index}>
            <AnalyticsCard
              title={data.date}
              value={data.totalSales}
              icon={DollarSign}
              color='from-emerald-500 to-lime-700'
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsTab
