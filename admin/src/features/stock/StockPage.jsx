import React, { useState } from "react";
import "../../styles/admin.css";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import { useGetStock } from "../../services/hooks/stock";
import { GrView } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/http";

function StockPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const entriesPerPage = 10;

  const { data: stockRes, isLoading, isError } = useGetStock(currentPage, entriesPerPage, statusFilter, search);

  const stocks = stockRes?.data?.data || [];
  const summary = stockRes?.data?.summary || { total: 0, lowStock: 0, outOfStock: 0 };
  const totalEntries = stockRes?.data?.pagination?.totalItems || 0;
  const totalPages = stockRes?.data?.pagination?.totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Never" : date.toLocaleDateString();
  };

  return (
    <div className="stock-page-container">
      {/* Header */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Stock Registry</h1>
          <p className="catalog-subtitle">
            Maintain your artisanal fragrance inventory with botanical precision.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stock-summary-grid">
        <div className="summary-card">
          <label>Total Essences</label>
          <div className="summary-value">{summary.total}</div>
        </div>
        <div className="summary-card warning">
          <label>Low Stock Alerts</label>
          <div className="summary-value">{summary.lowStock}</div>
        </div>
        <div className="summary-card critical">
          <label>Depleted Stock</label>
          <div className="summary-value">{summary.outOfStock}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="inline-filters-container">
         <div className="filter-group">
            <input 
              type="text" 
              placeholder="Search fragrances..." 
              className="styled-input-small" 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
         </div>
         <div className="filter-group">
            <select 
              className="styled-select-small"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Inventory</option>
              <option value="inStock">Healthy Stock</option>
              <option value="lowStock">Low Stock</option>
              <option value="outOfStock">Depleted</option>
            </select>
         </div>
      </div>

      {/* Table */}
      <div className="catalog-table">
        <div className="catalog-table-header stock-registry-grid-layout">
          <div className="header-cell">Product & Category</div>
          <div className="text-center">Inventory</div>
          <div className="text-center">ML</div>
          <div className="text-center">Threshold</div>
          <div className="text-center">Stock Value</div>
          <div className="text-center">Last Restock</div>
          <div className="text-center">Status</div>
          <div className="text-center">Actions</div>
        </div>

        {isLoading ? (
          <Loader text="Analyzing inventory levels..." />
        ) : isError ? (
          <div className="error-state">
             <p>Failed to retrieve the stock registry.</p>
          </div>
        ) : stocks.length === 0 ? (
          <div className="empty-state">No inventory found matching your filters.</div>
        ) : (
          stocks.map((stock) => {
            const isLow = stock.quantity <= stock.lowStockThreshold && stock.quantity > 0;
            const isOut = stock.quantity === 0;
            const history = stock.stockHistory || [];
            const price = stock.variantPrice || 0;
            const stockValue = stock.quantity * price;
            
            return (
              <div className="catalog-row stock-registry-grid-layout" key={stock._id}>
                <div className="product-cell">
                  <img
                    src={stock.productId?.images?.[0]?.url || (stock.productId?.images?.[0]?.path ? `${API_BASE_URL}/${stock.productId.images[0].path.replace(/\\/g, '/')}` : "/image/placeholder.png")}
                    alt={stock.productId?.name}
                    className="product-thumbnail"
                  />
                  <div className="product-info-wrapper">
                    <span className="user-name">{stock.productId?.name || "Unknown Product"}</span>
                    <div className="product-meta-tags">
                       <span className="meta-tag category">{stock.productId?.category || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                   <span className={`stock-count ${isOut ? 'critical' : isLow ? 'warning' : ''}`}>
                     {stock.quantity}
                   </span>
                </div>

                <div className="text-center">
                   <span className="reserved-count">{stock.variantSize || 'N/A'}</span>
                </div>

                <div className="text-center">
                   <span className="threshold-count">{stock.lowStockThreshold}</span>
                </div>

                <div className="text-center">
                   <span className="stock-value">Rs. {stockValue.toLocaleString()}</span>
                </div>

                <div className="justify-center">
                  {formatDate(stock.lastRestockedAt)}
                </div>

                <div className="status-cell text-center">
                  <span className={`status-badge ${isOut ? 'status-inactive' : isLow ? 'status-pending' : 'status-active'}`}>
                    {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>

                <div className="actions justify-center">
                  <GrView
                    className="action-icon-btn view"
                    size={18}
                    onClick={() => navigate(`/stock/view/${stock.productId?._id}`)}
                    title="View Details"
                  />
                </div>
              </div>
            );
          })
        )}

        {totalEntries > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalEntries={totalEntries}
            startEntry={(currentPage - 1) * entriesPerPage + 1}
            endEntry={Math.min(currentPage * entriesPerPage, totalEntries)}
          />
        )}
      </div>

    </div>
  );
}

export default StockPage;
