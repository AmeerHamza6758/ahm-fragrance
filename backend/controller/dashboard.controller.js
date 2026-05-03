const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Stock = require('../models/stock.model');

const dashboardController = {
  getGraphData: async (req, res) => {
    try {
      // 1. Sales vs Returns (Count of items in delivered vs refunded orders)
      const salesVsReturns = await Order.aggregate([
        { $match: { orderStatus: { $in: ['delivered', 'refunded'] } } },
        {
          $group: {
            _id: '$orderStatus',
            totalItems: {
              $sum: {
                $reduce: {
                  input: '$products',
                  initialValue: 0,
                  in: { $add: ['$$value', '$$this.quantity'] }
                }
              }
            }
          }
        }
      ]);

      // 2. Revenue vs Refunded (Sum of totalAmount)
      const revenueData = await Order.aggregate([
        { $match: { orderStatus: { $in: ['delivered', 'refunded'] } } },
        {
          $group: {
            _id: '$orderStatus',
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);

      // 3. Total Users per Month (Group all users if no recent ones found, or just show last 12 months)
      const usersPerMonth = await User.aggregate([
        {
          $group: {
            _id: {
              month: { $month: { $ifNull: ['$createdAt', new Date()] } },
              year: { $year: { $ifNull: ['$createdAt', new Date()] } }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      // Format data for recharts
      const formattedSales = [
        { name: 'Sales', count: salesVsReturns.find(d => d._id === 'delivered')?.totalItems || 0 },
        { name: 'Returns', count: salesVsReturns.find(d => d._id === 'refunded')?.totalItems || 0 }
      ];

      const formattedRevenue = [
        { name: 'Revenue', value: revenueData.find(d => d._id === 'delivered')?.totalAmount || 0 },
        { name: 'Refunded', value: revenueData.find(d => d._id === 'refunded')?.totalAmount || 0 }
      ];

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedUsers = usersPerMonth.map(d => ({
        name: `${monthNames[d._id.month - 1]} ${d._id.year}`,
        users: d.count
      }));

      // If no users found at all, provide a placeholder so the chart isn't empty
      if (formattedUsers.length === 0) {
        formattedUsers.push({ name: 'No Data', users: 0 });
      }

      res.json({
        success: true,
        data: {
          salesVsReturns: formattedSales,
          revenueVsRefunded: formattedRevenue,
          usersPerMonth: formattedUsers
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // Existing stats for backward compatibility
  getDashboardStats: async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();
      const totalPendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
      const lowStockCount = await Stock.countDocuments({ quantity: { $lt: 5 } }); // Assuming 5 is low

      res.json({
        success: true,
        totalProducts,
        totalPendingOrders,
        lowStockCount
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};

module.exports = dashboardController;
