/* eslint-disable import/prefer-default-export */

import { SET_ITEM, SET_LIST } from '../constants';

export function setItem({ audioItem }) {
  return {
    type: SET_ITEM,
    payload: {
      audioItem,
    },
  };
}

export function setList({ audioList }) {
  return {
    type: SET_LIST,
    payload: {
      audioList,
    },
  };
}
