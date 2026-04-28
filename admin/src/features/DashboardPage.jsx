import StatCard from "../components/StatCard";

const stats = [
  { title: "Total Products", value: "0", hint: "Source: /api/product/getProducts" },
  { title: "Pending Orders", value: "0", hint: "Source: /api/order/checkout" },
  { title: "Low Stock Alerts", value: "0", hint: "Source: /api/stock/get?alerts=true" },
  { title: "FAQs", value: "0", hint: "Source: /api/faq/getAllFaq" },
];

function DashboardPage() {
  return (
    <section>
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="page-note">
        Connect real data with `dashboardApi` in `src/services/endpoints.js`.
      </div>
    </section>
  );
}

export default DashboardPage;
