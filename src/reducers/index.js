import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import intl from './intl';
import profile from './profile';
import audio from './audio';

export default function createRootReducer({ apolloClient }) {
  return combineReducers({
    apollo: apolloClient.reducer(),
    user,
    runtime,
    intl,
    profile,
    audio,
  });
}
