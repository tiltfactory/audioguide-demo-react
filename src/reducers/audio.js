import { SET_ITEM } from '../constants';
import { SET_LIST } from '../constants';

export default function runtime(state = {}, action) {
  switch (action.type) {
    case SET_ITEM:
      return {
        ...state,
        audioItem: action.payload.audioItem,
      };
    case SET_LIST:
      return {
        ...state,
        audioList: action.payload.audioList,
      };
    default:
      return state;
  }
}
