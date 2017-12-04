/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import StopListPage from './StopListPage';

const title = 'Itinerary';

async function action({ locale, params }) {
  const REST_HOST_NAME = 'http://belvue.dev'; // @todo set in .env
  const drupalLocale = locale.substring(0, 2); // @todo improve

  // Fetch the localized terms.
  const endpoint = `${REST_HOST_NAME}/${drupalLocale}/jsonapi/node/audio?sort=field_id&filter[field_audio_itinerary.uuid][value]=${params.itinerary_id}`;
  const nodes = await fetch(endpoint).then(response => response.json());
  if (!nodes) throw new Error('Failed to load the stops for the itinerary.');

  return {
    chunks: ['itinerary'],
    title,
    component: (
      <Layout>
        <StopListPage title={title} stops={nodes.data} />
      </Layout>
    ),
  };
}

export default action;
