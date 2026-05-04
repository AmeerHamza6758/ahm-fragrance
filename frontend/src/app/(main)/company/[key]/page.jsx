import { getCMSContent } from "@/lib/api/endpoints/cms";
import { notFound } from "next/navigation";

export default async function CompanyPage({ params }) {
  const { key } = params;
  
  const keyMap = {
    'privacy-policy': 'privacy-policy',
    'about-us': 'about-us',
    'terms-of-service': 'terms-service',
    'shipping-returns': 'shipping-returns'
  };

  const dbKey = keyMap[key] || key;
  
  try {
    const data = await getCMSContent(dbKey);
    
    if (!data || !data.content) {
      return notFound();
    }

    return (
      <main className="company-dynamic-page">
        <section className="company-hero">
          <div className="company-hero-overlay"></div>
          <div className="company-hero-content">
            <h1 className="company-hero-title">{data.title}</h1>
            <div className="company-hero-divider"></div>
          </div>
        </section>

        <section className="company-content-body">
          <div className="container mx-auto px-6 py-16">
            <div 
              className="cms-rich-content"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("CMS Load Error:", error);
    return notFound();
  }
}
