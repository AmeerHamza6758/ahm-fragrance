import PageSection from "../components/PageSection";

function ProductsPage() {
  return (
    <PageSection
      title="Product Management"
      description="Create, update and remove products with price, variants, category, tag and images."
      endpoint="GET /api/product/getProducts | POST /api/product/addProduct | PUT /api/product/updateProduct?id=:id | DELETE /api/product/deleteProduct/:id"
    />
  );
}

export default ProductsPage;
