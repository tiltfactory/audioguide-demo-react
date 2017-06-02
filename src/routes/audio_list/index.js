import React from 'react';
import { REST_HOST_NAME } from '../../constants';
import Layout from '../../components/Layout';
import AudioContentList from '../../components/AudioContentList';

export default {

  // Optional parameter (React Router v4)
  path: '/audio_list/:audio_profile?',

  async action({ locale, params }) {
    // Get the static Markdown content
    const staticContent = await new Promise((resolve) => {
      require.ensure([], (require) => {
        try {
          resolve(require(`./audio_list.${locale}.md`)); // eslint-disable-line import/no-dynamic-require
        } catch (e) {
          resolve(require('./audio_list.md'));
        }
      }, 'audio_list');
    });

    console.log(params);

    // Match Drupal langcode
    // @todo improve or avoid this
    const drupalLocale = locale.substring(0, 2);
    // Fetch the nodes, filter by audio profile if parameter is available
    let endpoint = `${REST_HOST_NAME}/jsonapi/node/audio?sort=title&filter[langcode][value]=${drupalLocale}`;
    if (params.audio_profile !== undefined) {
      endpoint = `${REST_HOST_NAME}/jsonapi/node/audio?sort=title&filter[langcode][value]=${drupalLocale}&filter[field_audio_profile.uuid][value]=${params.audio_profile}`;
    }
    const nodesResponse = await fetch(endpoint).then(response => response.json());

    // Wrap static and Drupal content
    const data = { staticContent, audioList: nodesResponse };

    return {
      title: staticContent.title,
      chunk: 'audio_list',
      component: <Layout><AudioContentList {...data} /></Layout>,
    };
  },
};
