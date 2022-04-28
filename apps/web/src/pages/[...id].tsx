import { GetServerSideProps, NextPage } from 'next';
import { View as ViewType } from '@bliss/shared-types';
import Head from 'next/head';
import View from '#components/View';

const ViewPage: NextPage<{ data: ViewType }> = ({ data }) => {
  return (
    <>
      <Head>
        {data && (
          <>
            <link
              type="application/json+oembed"
              href={`${process.env.NEXT_PUBLIC_API_URL}/${data.slug}/oembed`}
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

      <View data={data} slug={data.slug} />
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

  const headers = res.headers;

  if (!headers.has('x-bliss-data'))
    return {
      notFound: true,
    };

  const data = {
    ...JSON.parse(headers.get('x-bliss-data')),
    type: headers.get('content-type'),
    size: headers.get('content-length'),
    slug,
  };

  return {
    props: {
      data,
    },
  };
};

export default ViewPage;
