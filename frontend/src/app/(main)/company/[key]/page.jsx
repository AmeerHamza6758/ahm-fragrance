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

        <style jsx>{`
          .company-hero {
            position: relative;
            height: 40vh;
            min-height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #1a1716;
            text-align: center;
            color: white;
          }
          .company-hero-overlay {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, rgba(126, 82, 92, 0.15) 0%, transparent 70%);
          }
          .company-hero-content {
            position: relative;
            z-index: 10;
          }
          .company-hero-title {
            font-size: 3.5rem;
            font-weight: 300;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
          }
          .company-hero-divider {
            width: 80px;
            height: 1px;
            background: #7e525c;
            margin: 0 auto;
          }
          .cms-rich-content {
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.8;
            color: #4a4a4a;
            font-size: 1.1rem;
          }
          .cms-rich-content :global(h1), 
          .cms-rich-content :global(h2), 
          .cms-rich-content :global(h3) {
            color: #1a1716;
            margin-top: 2.5rem;
            margin-bottom: 1.5rem;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .cms-rich-content :global(p) {
            margin-bottom: 1.5rem;
          }
          .cms-rich-content :global(ul) {
            list-style: none;
            padding-left: 0;
            margin-bottom: 2rem;
          }
          .cms-rich-content :global(li) {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.8rem;
          }
          .cms-rich-content :global(li::before) {
            content: "";
            position: absolute;
            left: 0;
            top: 0.7em;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #7e525c;
          }
        `}</style>
      </main>
    );
  } catch (error) {
    console.error("CMS Load Error:", error);
    return notFound();
  }
}
