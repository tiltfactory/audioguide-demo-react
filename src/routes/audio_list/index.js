import React from 'react';
import { REST_HOST_NAME } from '../../constants';
import Layout from '../../components/Layout';
import AudioContentList from '../../components/AudioContentList';

export default {

  // Optional parameter (React Router v4)
  path: '/audio_list/:audio_profile?',

  async action({ locale, params }) {
    // Match Drupal langcode
    // @todo improve or avoid this
    const drupalLocale = locale.substring(0, 2);
    // Fetch the nodes, filter by audio profile if parameter is available
    let endpoint = `${REST_HOST_NAME}/${drupalLocale}/jsonapi/node/audio?sort=field_id`;
    if (params.audio_profile !== undefined) {
      endpoint = `${REST_HOST_NAME}/${drupalLocale}/jsonapi/node/audio?sort=field_id&filter[field_audio_profile.uuid][value]=${params.audio_profile}`;
    }
    const nodesResponse = await fetch(endpoint).then(response => response.json());

    // Wrap static and Drupal content
    // @todo handle profile for getting back to the profile list
    const data = { audioList: nodesResponse };

    return {
      title: '', // @todo set title from the audio profile
      chunk: 'audio_list',
      component: <Layout><AudioContentList {...data} /></Layout>,
    };
  },
};
