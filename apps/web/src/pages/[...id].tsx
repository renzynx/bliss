import { GetServerSideProps, NextPage } from 'next';
import { View as ViewType } from '@bliss/shared-types';
import Head from 'next/head';
import View from '#components/View';

const ViewPage: NextPage<{ raw: string; slug: string }> = ({ raw, slug }) => {
  const data: ViewType = JSON.parse(raw);

  return (
    <>
      <Head>
        {data && data.enabled === 'true' && (
          <>
            <link
              type="application/json+oembed"
              href={`${process.env.NEXT_PUBLIC_API_URL}/${slug}/oembed`}
            />
            <meta name="og:title" content={data.title} />
            <meta name="og:description" content={data.description} />
            <meta name="twitter:title" content={data.title} />
            <meta name="twitter:description" content={data.description} />
            <meta property="theme-color" content={data.color} />
            {data.type.includes('image') ? (
              <>
                <meta property="og:image" content={`${data.url}`} />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:image" content={data.url} />
              </>
            ) : data.type.includes('video') ? (
              <>
                <meta name="twitter:card" content="player" />
                <meta name="twitter:player" content={data.url} />
                <meta name="twitter:player:stream" content={data.url} />
                <meta
                  name="twitter:player:stream:content_type"
                  content={data.type}
                />
              </>
            ) : null}
          </>
        )}
        <title>Bliss | Uploaded by {data.username}</title>
      </Head>

      <View data={data} slug={slug} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = ctx.params.id[0];

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}`, {
    headers: {
      'x-bliss-data': 'true',
    },
  });

  const data = res.headers;

  if (!data.has('x-bliss-data'))
    return {
      notFound: true,
    };

  console.log(data);

  return {
    props: {
      raw: JSON.stringify({
        ...JSON.parse(data.get('x-bliss-data')),
        type: data.get('content-type'),
        size: data.get('content-length'),
      }),
      slug,
    },
  };
};

export default ViewPage;
