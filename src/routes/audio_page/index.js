import React from 'react';
import { REST_HOST_NAME } from '../../constants';
import Layout from '../../components/Layout';
import AudioContentPage from '../../components/AudioContentPage';

export default {

  path: '/audio/:id',

  async action({ params }) {
    // @todo add language
    const nodeEndpoint = `${REST_HOST_NAME}/jsonapi/node/audio/${params.id}`;
    const nodeResponse = await fetch(nodeEndpoint).then(response => response.json());
    // @todo condition to previous fetch
    // @todo generalize
    const mp3UUID = nodeResponse.data.relationships.field_mp3.data.id;
    const imageUUID = nodeResponse.data.relationships.field_image.data.id;
    let fileEndpoint = `${REST_HOST_NAME}/jsonapi/file/file/${mp3UUID}`;
    const mp3Response = await fetch(fileEndpoint).then(response => response.json());
    fileEndpoint = `${REST_HOST_NAME}/jsonapi/file/file/${imageUUID}`;
    const imageResponse = await fetch(fileEndpoint).then(response => response.json());
    const data = { node: nodeResponse, mp3File: mp3Response, imageFile: imageResponse };

    return {
      title: nodeResponse.data.attributes.title,
      chunk: 'audio_page',
      component: <Layout><AudioContentPage {...data} /></Layout>,
    };
  },

};
