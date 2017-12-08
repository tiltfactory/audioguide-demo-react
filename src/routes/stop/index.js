import React from 'react';
import Layout from '../../components/Layout';
import StopPage from './StopPage';
import { JSON_API_URL } from '../../constants/env';

async function action({ locale, params }) {
  const drupalLocale = locale.substring(0, 2); // @todo improve

  // Fetch the localized node.
  // - mp3 file attached to the node : include=field_mp3
  // - Paragraphs that alos contains mp3 files : include=field_mp3,field_audio_answer.field_mp3
  const endpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/node/audio/${params.stop_id}?include=field_image,field_mp3,field_audio_answer,field_audio_answer.field_mp3`;
  const node = await fetch(endpoint).then(response => response.json());
  if (!node) throw new Error('Failed to load the stop.');
  // Set page name from the current stop.
  const title = `Stop - ${node.data.attributes.title}`;

  // Get the stops list to find previous and next stops if any.
  const nodesEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/node/audio?sort=field_id&filter[field_audio_itinerary.uuid][value]=${params.itinerary_id}&include=field_image`;
  const nodes = await fetch(nodesEndpoint).then(response => response.json());
  if (!nodes) throw new Error('Failed to load the stops for the itinerary.');
  let previousStopId = null;
  let nextStopId = null;
  const currentStopIndex = nodes.data
    .map(stop => stop.id)
    .indexOf(params.stop_id);
  if (currentStopIndex > 0) {
    previousStopId = nodes.data[currentStopIndex - 1].id;
  }
  if (currentStopIndex < nodes.data.length - 1) {
    nextStopId = nodes.data[currentStopIndex + 1].id;
  }

  // Fetch the localized itinerary term.
  const termEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary/${params.itinerary_id}?include=field_image,field_background_image`;
  const term = await fetch(termEndpoint).then(response => response.json());
  if (!term) throw new Error('Failed to load the itinerary.');

  return {
    chunks: ['stop'],
    title,
    component: (
      <Layout>
        <StopPage
          title={title}
          stop={node}
          previousStopId={previousStopId}
          nextStopId={nextStopId}
          itinerary={term}
        />
      </Layout>
    ),
  };
}

export default action;
