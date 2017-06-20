import { SET_PROFILE } from '../constants';

export default function runtime(state = {}, action) {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...state,
        audioProfileItem: action.payload.audioProfileItem,
      };
    default:
      return state;
  }
}
