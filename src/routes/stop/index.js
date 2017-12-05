import React from 'react';
import Layout from '../../components/Layout';
import StopPage from './StopPage';

const title = 'Stop';

async function action({ locale, params }) {
  const REST_HOST_NAME = 'http://belvue.dev'; // @todo set in .env
  const drupalLocale = locale.substring(0, 2); // @todo improve

  // Fetch the localized node.
  // - mp3 file attached to the node : include=field_mp3
  // - Paragraphs that alos contains mp3 files : include=field_mp3,field_audio_answer.field_mp3
  const endpoint = `${REST_HOST_NAME}/${drupalLocale}/jsonapi/node/audio/${params.stop_id}?include=field_mp3,field_audio_answer,field_audio_answer.field_mp3`;
  const node = await fetch(endpoint).then(response => response.json());
  if (!node) throw new Error('Failed to load the stop.');

  return {
    chunks: ['stop'],
    title,
    component: (
      <Layout>
        <StopPage
          title={title}
          stop={node}
          itinerary_id={params.itinerary_id}
        />
      </Layout>
    ),
  };
}

export default action;
