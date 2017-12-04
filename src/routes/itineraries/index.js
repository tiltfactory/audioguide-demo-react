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
import ItineraryListPage from './ItineraryListPage';

const title = 'Itineraries';

async function action({ fetch }) {
  const REST_HOST_NAME = 'http://belvue.dev'; // @todo set in .env
  const drupalLocale = 'fr'; // @todo extract from LanguageSwitcher value

  // Fetch the localized terms.
  // Sort by weight is the default value, but we keep this one explicitly.
  const endpoint = `${REST_HOST_NAME}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary?sort=weight`;
  const terms = await fetch(endpoint).then(response => response.json());
  if (!terms) throw new Error('Failed to load the itineraries.');

  return {
    chunks: ['itineraries'],
    title,
    component: (
      <Layout>
        <ItineraryListPage title={title} itineraries={terms.data} />
      </Layout>
    ),
  };
}

export default action;
