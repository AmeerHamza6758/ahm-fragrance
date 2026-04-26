import PageSection from "../components/PageSection";

function OrdersPage() {
  return (
    <PageSection
      title="Orders"
      description="Track customer checkout and cancel flow. This module should list orders and update statuses."
      endpoint="GET /api/order/checkout (auth) | POST /api/order/create (auth) | PUT /api/order/:id/cancel (auth)"
    />
  );
}

export default OrdersPage;
