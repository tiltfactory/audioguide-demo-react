/* eslint-disable import/prefer-default-export */

import { SET_PROFILE } from '../constants';

export function setProfile({ audioProfileItem }) {
  return {
    type: SET_PROFILE,
    payload: {
      audioProfileItem,
    },
  };
}
