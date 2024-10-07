import Order from "../models/order.model.js";
import Product from "../models/products.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null, // Group by null to get total sales
                totalSales: { $sum: 1 }, // Sum the total sales
                totalMoney: { $sum: "$totalAmount" }, // Sum the total money
            },
        },
    ]);

    const { totalSales, totalMoney } = salesData[0] || { totalSales: 0, totalMoney: 0 };

    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalMoney
    };
}

export const getDailySalesData = async (startDate, endDate) => {
    try {

        const dailySalesData = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: 1 },
                    totalMoney: { $sum: "$totalAmount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const dateArr = getDatesInRanges(startDate, endDate);

        return dateArr.map((date, index) => {
            const dailySales = dailySalesData.find(dailySale => dailySale._id === date);
            return {
                date,
                totalSales: dailySales?.totalSales || 0,
                totalMoney: dailySales?.totalMoney || 0
            };
        });
    } catch (error) {
        throw error;
    }

}

const getDatesInRanges = (startDate, endDate) => {

    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}