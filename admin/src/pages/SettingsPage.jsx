function SettingsPage() {
  return (
    <section className="page-section">
      <div className="page-section-header">
        <div>
          <h2>Settings</h2>
          <p>Configure API URL, admin profile and role-based permissions for your team.</p>
        </div>
      </div>
      <div className="endpoint-chip">VITE_API_URL=http://localhost:4000</div>
    </section>
  );
}

export default SettingsPage;
