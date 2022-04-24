import { GetServerSideProps, NextPage } from 'next';
import { View as ViewType } from '@bliss/shared-types';
import Head from 'next/head';
import View from '#components/View';

const ViewPage: NextPage<{ data: ViewType; slug: string }> = ({
  data,
  slug,
}) => {
  console.log(data);

  return (
    <>
      <Head>
        {data && data.enabled && (
          <>
            <link
              type="application/json+oembed"
              href={`${process.env.NEXT_PUBLIC_API_URL}/view/${slug}/oembed`}
            />
            <meta property="og:site_name" content={data.siteName} />
            <meta property="theme-color" content={data.color} />
            <meta property="twitter:card" content="summary_large_image" />
          </>
        )}
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
