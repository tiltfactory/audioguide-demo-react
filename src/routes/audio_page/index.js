import React from 'react';
import { REST_HOST_NAME } from '../../constants';
import Layout from '../../components/Layout';
import AudioContentPage from '../../components/AudioContentPage';

export default {

  path: '/audio/:id',

  async action({ params }) {
    // @todo add language
    // Using include to get all the related entities in one request :
    // - mp3 file attached to the node : include=field_mp3
    // - Paragraphs that alos contains mp3 files : include=field_mp3,field_audio_answer.field_mp3
    const nodeEndpoint = `${REST_HOST_NAME}/jsonapi/node/audio/${params.id}?include=field_mp3,field_audio_answer,field_audio_answer.field_mp3`;
    const nodeResponse = await fetch(nodeEndpoint).then(response => response.json());
    const data = { node: nodeResponse };

    return {
      title: nodeResponse.data.attributes.title,
      chunk: 'audio_page',
      component: <Layout><AudioContentPage {...data} /></Layout>,
    };
  },

};
