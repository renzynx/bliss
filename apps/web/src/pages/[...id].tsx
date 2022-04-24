import { GetServerSideProps, NextPage } from 'next';
import { View as ViewType } from '@bliss/shared-types';
import Head from 'next/head';
import View from '#components/View';

const ViewPage: NextPage<{ data: ViewType; slug: string }> = ({
  data,
  slug,
}) => {
  return (
    <>
      <Head>
        {data.enabled && (
          <>
            <meta property="og:site_name" content={data.siteName} />
            <meta property="og:title" content={data.title} />
            <meta property="og:description" content={data.description} />
            <meta property="theme-color" content={data.color} />
          </>
        )}
        <meta property="og:url" content={`/${slug}`} />
        {data.type.includes('image') ? (
          <>
            <meta
              property="og:image"
              content={`${process.env.NEXT_PUBLIC_API_URL}/${slug}`}
            />
            <meta property="twitter:card" content="summary_large_image" />
          </>
        ) : data.type.includes('video') ? (
          <>
            <meta property="og:type" content="video.other" />
            <meta
              property="og:video"
              content={`${process.env.NEXT_PUBLIC_API_URL}/${slug}`}
            />
            <meta
              property="og:video:url"
              content={`${process.env.NEXT_PUBLIC_API_URL}/${slug}`}
            />
            <meta
              property="og:video:secure_url"
              content={`${process.env.NEXT_PUBLIC_API_URL}/${slug}`}
            />
            <meta property="og:video:type" content={data.type} />
          </>
        ) : null}
        <meta property="og:type" content={data.type} />

        <title>Uploaded by {data.username}</title>
      </Head>

      <View data={data} slug={slug} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params.id[0];

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/view/${slug}`);

  const data = await res.json();

  if (data.error)
    return {
      notFound: true,
    };

  return {
    props: {
      data,
      slug,
    },
  };
};

export default ViewPage;
