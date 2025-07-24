
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEOHead = ({
  title = "Custom Name Pendants | Personalized Jewelry | Attiry",
  description = "Handcrafted personalized jewelry for couples and loved ones. Custom name pendants, personalized necklaces, and unique jewelry gifts. Each piece tells your unique story.",
  keywords = "custom name pendants, personalized jewelry, name necklace, handcrafted jewelry, custom jewelry gifts, couple jewelry, personalized gifts",
  image = "https://attiry-pendant-craft.lovable.app/hero-pendant.jpg",
  url = "https://attiry-pendant-craft.lovable.app/",
  type = "website"
}: SEOHeadProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Attiry",
    "description": "Custom name pendants and personalized jewelry",
    "url": url,
    "logo": "https://attiry-pendant-craft.lovable.app/favicon.ico",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": []
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Attiry" />
      <meta property="og:image" content={image} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
