import React from 'react';
import { REST_HOST_NAME } from '../../constants';
import Layout from '../../components/Layout';
import AudioProfileList from '../../components/AudioProfileList';

export default {

  path: '/',

  async action({ locale }) {
    // Get the static Markdown content
    const staticContent = await new Promise((resolve) => {
      require.ensure([], (require) => {
        try {
          resolve(require(`./audio_profile_list.${locale}.md`)); // eslint-disable-line import/no-dynamic-require
        } catch (e) {
          resolve(require('./audio_profile_list.md'));
        }
      }, 'audio_list');
    });

    // Match Drupal langcode
    // @todo improve or avoid this
    const drupalLocale = locale.substring(0, 2);
    // Fetch the localized terms.
    // Sort by weight is the default value, but we keep this one explicitly.
    const endpoint = `${REST_HOST_NAME}/jsonapi/taxonomy_term/audio_profile?sort=weight&filter[langcode][value]=${drupalLocale}`;
    const termsResponse = await fetch(endpoint).then(response => response.json());
    // Wrap static and Drupal content
    const data = { staticContent, audioProfileList: termsResponse };

    return {
      title: staticContent.title,
      chunk: 'audio_profiles',
      component: <Layout><AudioProfileList {...data} /></Layout>,
    };
  },
};