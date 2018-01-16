/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
// import { itinerariesFetch } from '../../actions/itineraries';
import Layout from '../../components/Layout';
import ItineraryListPage from './ItineraryListPage';
import { JSON_API_URL } from '../../constants/env';

const title = 'Audioguide'; // @todo make it translatable

async function action({ locale, fetch, store }) {
  const drupalLocale = locale.substring(0, 2); // @todo improve

  // Fetch the localized terms.
  // Sort by weight is the default value, but we keep this one explicitly.
  function fetchItineraries() {
    // redux action
    return dispatch => {
      dispatch({ type: 'ITENERARIES_FETCH' });
      const endpoint = `${JSON_API_URL}/${drupalLocale}/jsonapi/taxonomy_term/audio_itinerary?filter[field_is_parent][value]=1&filter[langcode][value]=${drupalLocale}&sort=weight&include=field_image,field_background_image`;
      return fetch(endpoint) // return promise
        .then(resp => resp.json())
        .then(itineraries =>
          dispatch({
            type: 'ITENERARIES_FETCH',
            payload: itineraries,
            error: false,
          }),
        )
        .catch(error =>
          dispatch({ type: 'ITENERARIES_FETCH', payload: error, error: true }),
        );
    };
  }

  // Try to get the itineraries from the Redux store
  let itineraries = store.getState().itineraries;
  if (
    Object.keys(itineraries).length === 0 &&
    itineraries.constructor === Object
  ) {
    console.log('No data. fetch now.');
    await store.dispatch(fetchItineraries());
    console.log('-- STORE --');
    console.log(store.getState()); // itineraries = {}
    itineraries = store.getState().itineraries;
    console.log('-- ROUTE --');
    console.log(itineraries);
  } else {
    console.log('Already got the data. Do not fetch.');
  }

  return {
    chunks: ['itineraries_redux_router'],
    title,
    component: (
      <Layout>
        <ItineraryListPage title={title} itineraries={itineraries} />
      </Layout>
    ),
  };
}

export default action;
