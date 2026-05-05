const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Stock = require('../models/stock.model');

const dashboardController = {
  getGraphData: async (req, res) => {
    try {
      // 1. Sales vs Returns (Count of items in delivered vs refunded orders)
      const salesVsReturns = await Order.aggregate([
        { $match: { orderStatus: { $in: ['delivered', 'refunded', 'returned', 'payment refunded'] } } },
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
        { $match: { orderStatus: { $in: ['delivered', 'refunded', 'returned', 'payment refunded'] } } },
        {
          $group: {
            _id: '$orderStatus',
            totalAmount: { $sum: '$totalAmount' }
          }
        }
      ]);

      // 3. Total Users per Month
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
        { name: 'Returns', count: salesVsReturns.filter(d => ['refunded', 'returned', 'payment refunded'].includes(d._id)).reduce((acc, curr) => acc + curr.totalItems, 0) }
      ];

      const formattedRevenue = [
        { name: 'Revenue', value: revenueData.find(d => d._id === 'delivered')?.totalAmount || 0 },
        { name: 'Refunded', value: revenueData.filter(d => ['refunded', 'returned', 'payment refunded'].includes(d._id)).reduce((acc, curr) => acc + curr.value, 0) }
      ];

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedUsers = usersPerMonth.map(d => ({
        name: `${monthNames[d._id.month - 1]} ${d._id.year}`,
        users: d.count
      }));

      // If no users found, provide placeholder
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

  getLedgerData: async (req, res) => {
    try {
      const ledger = await Order.aggregate([
        {
          $group: {
            _id: {
              month: { $month: { $ifNull: ['$createdAt', new Date()] } },
              year: { $year: { $ifNull: ['$createdAt', new Date()] } }
            },
            totalOrders: { $sum: 1 },
            refundedOrders: { 
              $sum: { $cond: [{ $in: ['$orderStatus', ['refunded', 'returned', 'payment refunded']] }, 1, 0] } 
            },
            deliveredOrders: { 
              $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] } 
            },
            grossRevenue: { 
              $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, '$totalAmount', 0] } 
            },
            refundsAmount: { 
              $sum: { $cond: [{ $in: ['$orderStatus', ['refunded', 'returned', 'payment refunded']] }, '$totalAmount', 0] } 
            }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
      ]);

      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      const formattedLedger = ledger.map(d => ({
        month: `${monthNames[d._id.month - 1]} ${d._id.year}`,
        order: d.totalOrders,
        refunded: d.refundedOrders,
        deliverd: d.deliveredOrders,
        gross: d.grossRevenue.toLocaleString(),
        refunds: d.refundsAmount.toLocaleString(),
        net: (d.grossRevenue - d.refundsAmount).toLocaleString()
      }));

      res.json({
        success: true,
        data: formattedLedger
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getDashboardStats: async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();
      const totalPendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
      const lowStockCount = await Stock.countDocuments({
        $expr: {
          $and: [
            { $lte: ['$quantity', '$lowStockThreshold'] },
            { $gt: ['$quantity', 0] }
          ]
        }
      });

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
