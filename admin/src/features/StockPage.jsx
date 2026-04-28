import PageSection from "../components/PageSection";

function StockPage() {
  return (
    <PageSection
      title="Stock"
      description="Monitor inventory and low stock alerts. Use operation add/deduct to update quantity."
      endpoint="GET /api/stock/get?getAll=true | GET /api/stock/get?alerts=true | POST /api/stock/manage (auth)"
    />
  );
}

export default StockPage;
