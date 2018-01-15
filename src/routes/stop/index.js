import React from 'react';
import Layout from '../../components/Layout';
import StopPage from './StopPage';
import { JSON_API_URL } from '../../constants/env';

async function action({ locale, params, fetch }) {
  const drupalLocale = locale.substring(0, 2); // @todo improve

  // Fetch the localized node.
  // - mp3 file attached to the node : include=field_mp3
  // - Paragraphs that alos contains mp3 files : include=field_mp3,field_audio_answer.field_mp3
  const stopNodeEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/node/audio/${
    params.stop_id
  }?include=field_image,field_mp3,field_audio_answer,field_audio_answer.field_mp3`;
  let node = {};
  try {
    const response = await fetch(stopNodeEndpoint, {
      method: 'GET',
    });
    node = await response.json();
  } catch (error) {
    // @todo improve error management with PropTypes
  }

  // Get the stops list to find previous and next stops if any.
  const stopNodesEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/node/audio?sort=field_weight&filter[field_audio_itinerary.uuid][value]=${
    params.itinerary_id
  }&include=field_image`;
  let nodes = {};
  let previousStopId = null;
  let nextStopId = null;
  try {
    const response = await fetch(stopNodesEndpoint, {
      method: 'GET',
    });
    nodes = await response.json();
    const currentStopIndex = nodes.data
      .map(stop => stop.id)
      .indexOf(params.stop_id);
    if (currentStopIndex > 0) {
      previousStopId = nodes.data[currentStopIndex - 1].id;
    }
    if (currentStopIndex < nodes.data.length - 1) {
      nextStopId = nodes.data[currentStopIndex + 1].id;
    }
  } catch (error) {
    // @todo improve error management with PropTypes
  }

  // Fetch the localized itinerary term.
  const termEndpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary/${
    params.itinerary_id
  }?include=field_image,field_background_image`;
  let term = {};
  try {
    const response = await fetch(termEndpoint, {
      method: 'GET',
    });
    term = await response.json();
  } catch (error) {
    // @todo improve error management with PropTypes
  }

  // Set page name from the current stop.
  const title = `${term.data.attributes.name} - ${node.data.attributes.title}`;

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
