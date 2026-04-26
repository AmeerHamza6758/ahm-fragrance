import PageSection from "../components/PageSection";

function BrandsPage() {
  return (
    <PageSection
      title="Brands"
      description="Manage fragrance brands and metadata displayed with products."
      endpoint="GET /api/brand/getBrand | POST /api/brand/creatBrand | PUT /api/brand/updateBrand?id=:id | DELETE /api/brand/deleteBrand?id=:id"
    />
  );
}

export default BrandsPage;
