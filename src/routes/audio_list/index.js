import React from 'react';
import { REST_HOST_NAME } from '../../constants';
import Layout from '../../components/Layout';
import AudioContentList from '../../components/AudioContentList';

export default {

  path: '/',

  async action({ locale }) {
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

    // Match Drupal langcode
    // @todo improve this
    const drupalLocale = locale.substring(0, 2);
    // Fetch the nodes
    const endpoint = `${REST_HOST_NAME}/jsonapi/node/audio?sort=title&filter[langcode][value]=${drupalLocale}`;
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
