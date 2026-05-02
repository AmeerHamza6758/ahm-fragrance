import React, { useState } from "react";
import "../../styles/admin.css";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import { useGetStock, useManageStock } from "../../services/hooks/stock";
import { FiEdit } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

function StockPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [editingStock, setEditingStock] = useState(null); // {productId, name, currentQuantity}
  const [updateAmount, setUpdateAmount] = useState("");
  const [operation, setOperation] = useState("add");
  const entriesPerPage = 10;

  const { data: stockRes, isLoading, isError } = useGetStock(currentPage, entriesPerPage, statusFilter);
  const manageStockMutation = useManageStock();

  const stocks = stockRes?.data?.data || [];
  const summary = stockRes?.data?.summary || { total: 0, lowStock: 0, outOfStock: 0 };
  const totalEntries = stockRes?.data?.pagination?.totalItems || 0;
  const totalPages = stockRes?.data?.pagination?.totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUpdateStock = () => {
    if (!updateAmount || isNaN(updateAmount)) return;
    
    manageStockMutation.mutate({
      productId: editingStock.productId,
      quantity: parseInt(updateAmount),
      operation: operation,
      reason: "manual_admin_update"
    }, {
      onSuccess: () => {
        setEditingStock(null);
        setUpdateAmount("");
      }
    });
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
        <div className="catalog-table-header stock-grid-layout">
          <span>Product Details</span>
          <span>Current Level</span>
          <span>Previous</span>
          <span>Last Restock</span>
          <span className="text-center">Status</span>
          <span className="text-center">Actions</span>
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
            
            return (
              <div className="catalog-row stock-grid-layout" key={stock._id}>
                <div className="product-cell">
                  <span className="user-name">{stock.productId?.name}</span>
                  <span className="user-email">ID: {stock.productId?._id}</span>
                </div>

                <div className="stock-level-cell">
                   <span className={`stock-count ${isOut ? 'critical' : isLow ? 'warning' : ''}`}>
                     {stock.quantity} Units
                   </span>
                </div>

                <span>{stock.stockHistory?.[stock.stockHistory.length - 2]?.newQuantity || 0}</span>

                <span>{formatDate(stock.lastRestockedAt)}</span>

                <div className="status-cell justify-center">
                  <span className={`status-badge ${isOut ? 'status-inactive' : isLow ? 'status-pending' : 'status-active'}`}>
                    {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>

                <div className="actions justify-center">
                  <FiEdit
                    className="action-icon edit-icon"
                    size={18}
                    style={{ color: "#7E525C", cursor: "pointer" }}
                    onClick={() => setEditingStock({
                      productId: stock.productId?._id,
                      name: stock.productId?.name,
                      currentQuantity: stock.quantity
                    })}
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

      {/* Stock Management Modal */}
      {editingStock && (
        <div className="stock-modal-overlay">
          <div className="stock-modal">
            <div className="modal-header">
              <h3>Manage Inventory</h3>
              <IoClose 
                size={24} 
                className="close-icon" 
                onClick={() => setEditingStock(null)} 
              />
            </div>
            <div className="modal-body">
              <div className="product-summary">
                <label>Fragrance</label>
                <p>{editingStock.name}</p>
                <label>Current Stock</label>
                <p>{editingStock.currentQuantity} Units</p>
              </div>

              <div className="management-controls">
                <div className="op-toggle">
                  <button 
                    className={operation === 'add' ? 'active' : ''} 
                    onClick={() => setOperation('add')}
                  >Add Stock</button>
                  <button 
                    className={operation === 'deduct' ? 'active' : ''} 
                    onClick={() => setOperation('deduct')}
                  >Deduct Stock</button>
                </div>
                
                <div className="input-group">
                  <label>Quantity to {operation}</label>
                  <input 
                    type="number"
                    placeholder="e.g. 50"
                    className="styled-input"
                    value={updateAmount}
                    onChange={(e) => setUpdateAmount(e.target.value)}
                  />
                </div>

                <button 
                  className="save-btn"
                  onClick={handleUpdateStock}
                  disabled={manageStockMutation.isPending}
                >
                  {manageStockMutation.isPending ? "Updating..." : "Confirm Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockPage;
