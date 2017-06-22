/* eslint-disable import/prefer-default-export */

import { SET_ITEM } from '../constants';

export function setItem({ current, prev, next }) {
  return {
    type: SET_ITEM,
    payload: {
      current,
      prev,
      next,
    },
  };
}
