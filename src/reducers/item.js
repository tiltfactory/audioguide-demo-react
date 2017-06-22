import { SET_ITEM } from '../constants';

export default function runtime(state = {}, action) {
  switch (action.type) {
    case SET_ITEM:
      return {
        ...state,
        current: action.payload.current,
        previous: action.payload.previous,
        next: action.payload.next,
      };
    default:
      return state;
  }
}
