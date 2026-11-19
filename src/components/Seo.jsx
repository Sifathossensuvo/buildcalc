import { Helmet } from 'react-helmet-async';

export default function Seo({ meta }) {
  const { title, description, canonical, image, type = 'website', jsonLd = [], noindex } = meta;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="BuildCalc" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(j)}</script>
      ))}
    </Helmet>
  );
}
