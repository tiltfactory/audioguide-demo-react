import React from 'react';
import Layout from '../../components/Layout';
import ItineraryListPage from './ItineraryListPage';

const title = 'Audioguide';

async function action({ locale }) {
  const languageId = locale.substring(0, 2);

  return {
    chunks: ['itineraries'],
    title,
    component: (
      <Layout>
        <ItineraryListPage title={title} languageId={languageId} />
      </Layout>
    ),
  };
}

export default action;
