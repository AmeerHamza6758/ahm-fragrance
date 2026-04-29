import PageSection from "../components/PageSection";
import "../styles/admin.css"

function OrdersPage() {
  return (
    <div className="orders">

      {/* Header */}
      <div className="orders-header">
        <h1 className="orders-title">Order Registry</h1>
        <p className="orders-subtitle">
          Managing the factory journey of our clients.
        </p>
      </div>

      {/* Filters */}
      <div className="orders-filters">

        <input
          type="text"
          placeholder="Search orders, customers, or tracking IDs..."
          className="orders-search"
        />

        <div className="filters-right">
          <select className="filter-select">
            <option>Status: All</option>
          </select>

          <select className="filter-select">
            <option>Date: Last 30 Days</option>
          </select>

          <button className="filter-btn">⚙</button>
        </div>
      </div>

      {/* Table */}
      <div className="orders-table">

        <div className="orders-table-header">
          <span>Order ID</span>
          <span>Date</span>
          <span>Customer</span>
          <span>Total (PKR)</span>
          <span>Order Status</span>
          <span>Payment</span>
          <span>Actions</span>
        </div>

        {/* Row 1 */}
        <div className="orders-row">
          <span>#AHM-9284</span>
          <span>Oct 24, 2023</span>
          <span>Evelyn Thorne</span>
          <span>24,500</span>
          <span className="status-shipped">Shipped</span>
          <span className="payment-paid">Paid</span>
          <span>•••</span>
        </div>

        {/* Row 2 */}
        <div className="orders-row">
          <span>#AHM-9285</span>
          <span>Oct 24, 2023</span>
          <span>Julian Vane</span>
          <span>18,200</span>
          <span className="status-pending">Pending</span>
          <span className="payment-pending">Pending</span>
          <span>•••</span>
        </div>

        {/* Expanded Detail */}
        <div className="order-details">

          {/* Left */}
          <div className="order-composition">
            <h3>Order Composition</h3>

            <div className="composition-item">
              <div>
                <h4>Oud Royale</h4>
                <p>100ML Selection</p>
              </div>
              <span style={{marginTop:"60px"}}>PKR 12,500</span>
            </div>

            <div className="composition-item">
              <div>
                <h4 style={{}}>Velvet Peony</h4>
                <p>50ML Selection</p>
              </div>
              <span style={{marginTop:"60px"}}>PKR 5,700</span>
            </div>
          </div>

          {/* Right */}
          <div className="customer-info">
            <h3 style={{paddingTop:"20px"}}>Customer Information</h3>

            <p><strong>Full Name:</strong> Julian Vane</p>
            <p><strong>Phone:</strong> 0304-XXXXXXX</p>
            <p><strong>Email:</strong> j.vane@editorial.com</p>
            <p><strong>Address:</strong>Suite 402, Sterling heights, Phase 6, DHA, Karachi, Pakistan</p>
            <p><strong>Postal Code:</strong> 75500</p>
            <p><strong>Delivery Charges:</strong> PKR 500</p>
          </div>

        </div>
        <div className="orders-row">
         <span>#AHM-9286</span>
         <span>Oct 23, 2023</span>
         <span>Clara Beaumont</span>
         <span>36,800</span>
         <span className="status-confirmed">Confirmed</span>
         <span className="payment-paid">Paid</span>
         <span>•••</span>
        </div>
        <div className="orders-row">
         <span>#AHM 9287</span>
         <span>Oct 23, 2023</span>
         <span>Marcus Chen</span>
         <span>12,250</span>
         <span className="status-deliver">Delivered</span>
         <span className="payment">Paid</span>
         <span>•••</span>
        </div>
        <div className="orders-row">
         <span>#AHM-9288</span>
         <span>Oct 22, 2023</span>
         <span>Aria Sterling</span>
         <span>9,500</span>
         <span className="status-can">Cancelled</span>
         <span className="payment-fail">Failed</span>
         <span>•••</span>
        </div>
        <div className="orders-row">
         <span>#AHM-9289</span>
         <span>Oct 21, 2023</span>
         <span>Zephyr Khan</span>
         <span>15,000</span>
         <span className="status-refund">Refunded</span>
         <span className="payment-refund">Refunded</span>
         <span>•••</span>
        </div>
      </div>
        <div className="pagination">
      <div className="pagination-124">
         <p>SHOWING 1 TO 6 OF 48 ENTRIES</p>
      </div>
      <div>
        <button>{"<"}</button>
        <button className="active-page">1</button>
        <button>2</button>
        <button>3</button>
        <button>{">"}</button>
      </div>
    </div>
    </div>
  );
}
export default OrdersPage;

