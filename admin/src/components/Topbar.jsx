function Topbar() {
  return (
    <header className="admin-topbar">
      <div>
        <h1>Admin Panel</h1>
        <p>Manage products, catalog, stock and orders</p>
      </div>
      <button className="action-btn" type="button">
        Add Product
      </button>
    </header>
  );
}

export default Topbar;
