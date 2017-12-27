import React from 'react';
import Layout from '../../components/Layout';
import ItineraryPage from './ItineraryPage';
import { CONSUMER_ID, JSON_API_URL } from '../../constants/env';

async function action({ locale, params }) {
  const drupalLocale = locale.substring(0, 2); // @todo improve

  // Fetch the localized itinerary term.
  // @todo replace throws error
  const itineraryTermEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary/${params.itinerary_id}?_consumer_id=${CONSUMER_ID}&include=field_image,field_background_image`;
  const itineraryTerm = await fetch(itineraryTermEndpoint).then(response =>
    response.json(),
  );
  if (!itineraryTerm) throw new Error('Failed to load the itinerary.');

  // Fetch the child itineraries from the current parent itinerary if any.
  // @todo currently, there is an issue on getting the parent / child relationship
  // so we are getting all available terms.
  const childItineraryTermsEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary?_consumer_id=${CONSUMER_ID}&sort=weight&include=field_image`;
  let childItineraryTerms = {};
  try {
    childItineraryTerms = await fetch(
      childItineraryTermsEndpoint,
    ).then(response => response.json());
  } catch (error) {
    // @todo improve error management with PropTypes
  }

  // Set page name from the current itinerary.
  const title = itineraryTerm.data.attributes.name;

  // Fetch the translated node stops for this itinerary.
  // @todo replace throws error
  const itineraryStopNodesEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/node/audio?_consumer_id=${CONSUMER_ID}&sort=field_weight&filter[field_audio_itinerary.uuid][value]=${params.itinerary_id}&include=field_image`;
  const itineraryStopNodes = await fetch(
    itineraryStopNodesEndpoint,
  ).then(response => response.json());
  if (!itineraryStopNodes)
    throw new Error('Failed to load the stops for the itinerary.');

  // Fetch all the available translated node stops that are not part of the
  // current itinerary.
  const stopNodesEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/node/audio?_consumer_id=${CONSUMER_ID}&sort=field_weight&include=field_image&filter[not-current-itinerary][condition][path]=field_audio_itinerary.uuid&filter[not-current-itinerary][condition][operator]=NOT%20IN&filter[not-current-itinerary][condition][value][]=${params.itinerary_id}`;
  let stopNodes = {};
  try {
    stopNodes = await fetch(stopNodesEndpoint).then(response =>
      response.json(),
    );
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
          externalStops={stopNodes}
        />
      </Layout>
    ),
  };
}

export default action;
