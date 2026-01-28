import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Tatevik Petrosyan',
  structuredData,
}) => {
  const siteUrl = 'https://tatevikpetrosyan.com'; // Update with your actual domain
  const defaultTitle = 'Tatevik Petrosyan | UI/UX, Icon & Logo Designer';
  const defaultDescription = 'Portfolio of Tatevik Petrosyan, a specialist in UI/UX design, custom iconography, and brand identity. Creating intuitive digital experiences and scalable design systems.';
  const defaultImage = `${siteUrl}/images/about/profile.jpg`;
  const defaultKeywords = 'UI/UX Designer, Icon Design, Logo Designer, Product Design, Web Design Portfolio, Custom Icons, Design Systems';

  const seo = {
    title: title ? `${title} | Tatevik Petrosyan` : defaultTitle,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: url ? `${siteUrl}${url}` : siteUrl,
    keywords: keywords || defaultKeywords,
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seo.url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content="Tatevik Petrosyan Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
