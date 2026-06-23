import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import PagingReducer from './PagingReducer';

export default combineReducers({
    user: UserReducer,
    paging: PagingReducer,
});