import React from 'react';
import Layout from '../../components/Layout';
import ItineraryPage from './ItineraryPage';

const title = 'Itinerary';

async function action({ locale, params }) {
  const REST_HOST_NAME = 'http://belvue.dev'; // @todo set in .env
  const drupalLocale = locale.substring(0, 2); // @todo improve

  // Fetch the localized itinerary term.
  const termEndpoint = `${REST_HOST_NAME}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary/${params.itinerary_id}?include=field_image`;
  const term = await fetch(termEndpoint).then(response => response.json());
  if (!term) throw new Error('Failed to load the itinerary.');
  // Fetch the translated node stops for this itinerary.
  const nodesEndpoint = `${REST_HOST_NAME}/${drupalLocale}/jsonapi/node/audio?sort=field_id&filter[field_audio_itinerary.uuid][value]=${params.itinerary_id}&include=field_image`;
  const nodes = await fetch(nodesEndpoint).then(response => response.json());
  if (!nodes) throw new Error('Failed to load the stops for the itinerary.');

  return {
    chunks: ['itinerary'],
    title,
    component: (
      <Layout>
        <ItineraryPage title={title} itinerary={term} stops={nodes} />
      </Layout>
    ),
  };
}

export default action;
