import React from 'react';
import Layout from '../../components/Layout';
import ItineraryListPage from './ItineraryListPage';

const title = 'Audioguide';

async function action({ locale }) {
  const languageId = locale.substring(0, 2);
  const data = await new Promise(resolve => {
    require.ensure(
      [],
      require => {
        try {
          resolve(require(`./about.${locale}.md`)); // eslint-disable-line import/no-dynamic-require
        } catch (e) {
          resolve(require('./about.md'));
        }
      },
      'about',
    );
  });

  return {
    chunks: ['itineraries'],
    title,
    component: (
      <Layout>
        <ItineraryListPage title={title} languageId={languageId} {...data} />
      </Layout>
    ),
  };
}

export default action;
