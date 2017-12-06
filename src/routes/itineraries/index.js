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
import { JSON_API_URL } from '../../constants/env';

const title = 'Itineraries';

async function action({ locale, fetch }) {
  const drupalLocale = locale.substring(0, 2); // @todo improve

  // Fetch the localized terms.
  // Sort by weight is the default value, but we keep this one explicitly.
  const endpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary?sort=weight&include=field_image`;
  const terms = await fetch(endpoint).then(response => response.json());
  if (!terms) throw new Error('Failed to load the itineraries.');

  return {
    chunks: ['itineraries'],
    title,
    component: (
      <Layout>
        <ItineraryListPage title={title} itineraries={terms} />
      </Layout>
    ),
  };
}

export default action;
