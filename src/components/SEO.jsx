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
  const defaultTitle = 'Tatevik Petrosyan | UI/UX & Icon Designer Portfolio';
  const defaultDescription = 'UI/UX Designer & Icon Designer specializing in creating intuitive, beautiful interfaces and comprehensive design systems. View my portfolio of mobile apps, web designs, and icon systems.';
  const defaultImage = `${siteUrl}/og-image.jpg`;
  const defaultKeywords = 'UI/UX Designer, Icon Designer, Product Designer, Portfolio, Design Systems, Mobile App Design, Web Design, Figma, User Experience, User Interface, Tatevik Petrosyan';

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
