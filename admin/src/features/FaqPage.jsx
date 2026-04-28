import PageSection from "../components/PageSection";

function FaqPage() {
  return (
    <PageSection
      title="FAQ"
      description="Manage frequently asked questions shown on the storefront home page."
      endpoint="GET /api/faq/getAllFaq | POST /api/faq/addFaq | PUT /api/faq/updateFaq?id=:id | DELETE /api/faq/deleteFaq/:id"
    />
  );
}

export default FaqPage;
