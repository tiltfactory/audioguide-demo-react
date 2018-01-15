import React from 'react';
import Layout from '../../components/Layout';
import ItineraryPage from './ItineraryPage';
import { CONSUMER_ID, JSON_API_URL } from '../../constants/env';

async function action({ locale, params }) {
  const drupalLocale = locale.substring(0, 2); // @todo improve

  // Fetch the localized itinerary term.
  const itineraryTermEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary/${
    params.itinerary_id
  }?_consumer_id=${CONSUMER_ID}&include=field_image,field_background_image`;
  let itineraryTerm = {};
  let title = {};
  try {
    const response = await fetch(itineraryTermEndpoint, { method: 'GET' });
    itineraryTerm = await response.json();
    // Set page name from the current itinerary.
    title = itineraryTerm.data.attributes.name;
  } catch (error) {
    // @todo improve error management with PropTypes
  }

  // Fetch the child itineraries from the current parent itinerary if any.
  // @todo currently, there is an issue on getting the parent / child relationship
  // so we are getting all available terms.
  const childItineraryTermsEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary?_consumer_id=${CONSUMER_ID}&sort=weight&include=field_image`;
  let childItineraryTerms = {};
  try {
    const response = await fetch(childItineraryTermsEndpoint, {
      method: 'GET',
    });
    childItineraryTerms = await response.json();
  } catch (error) {
    // @todo improve error management with PropTypes
  }

  // Fetch the translated node stops for this itinerary.
  const itineraryStopNodesEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/node/audio?_consumer_id=${CONSUMER_ID}&sort=field_weight&filter[field_audio_itinerary.uuid][value]=${
    params.itinerary_id
  }&include=field_image`;
  let itineraryStopNodes = {};
  try {
    const response = await fetch(itineraryStopNodesEndpoint, {
      method: 'GET',
    });
    itineraryStopNodes = await response.json();
  } catch (error) {
    // @todo improve error management with PropTypes
  }

  // Fetch all the available translated node stops that are not part of the
  // current itinerary.
  const externalStopNodesEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/node/audio?_consumer_id=${CONSUMER_ID}&sort=field_weight&include=field_image&filter[not-current-itinerary][condition][path]=field_audio_itinerary.uuid&filter[not-current-itinerary][condition][operator]=NOT%20IN&filter[not-current-itinerary][condition][value][]=${
    params.itinerary_id
  }`;
  let externalStopNodes = {};
  try {
    const response = await fetch(externalStopNodesEndpoint, {
      method: 'GET',
    });
    externalStopNodes = await response.json();
  } catch (error) {
    // @todo improve error management with PropTypes
  }

  return {
    chunks: ['itinerary'],
    title,
    component: (
      <Layout>
        <ItineraryPage
          title={title}
          itinerary={itineraryTerm}
          childItineraries={childItineraryTerms}
          itineraryStops={itineraryStopNodes}
          externalStops={externalStopNodes}
        />
      </Layout>
    ),
  };
}

export default action;
