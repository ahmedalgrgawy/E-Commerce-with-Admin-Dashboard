import { getAnalyticsData, getDailySalesData } from "../utils/analyticsUtil.js";

export const getAnalytics = async (req, res) => {
    try {

        const data = await getAnalyticsData();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate, endDate);

        return res.json({ data, dailySalesData });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}