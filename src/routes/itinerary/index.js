import React from 'react';
import Layout from '../../components/Layout';
import ItineraryPage from './ItineraryPage';

async function action({ locale, params }) {
  const languageId = locale.substring(0, 2);
  const itineraryId = params.itinerary_id;

  return {
    chunks: ['itinerary'],
    title: 'Audioguide', // @todo get itinerary title
    component: (
      <Layout>
        <ItineraryPage
          languageId={languageId}
          itineraryId={itineraryId}
        />
      </Layout>
    ),
  };
}

export default action;
