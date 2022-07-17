import { 
    GET_GUEST,
    DELETE_GUEST,
    ADD_GUEST,
    UPDATE_GUEST,
    GUEST_ERROR,
    SET_GUEST,
    GET_GUESTS_LIST,
    GET_STAT
  } from '../types'

export default (state, action) => {
    switch(action.type) {

        case GET_STAT: 
        return {
            ...state,
            stat: action.payload,
            loading: false
        };
        case GET_GUESTS_LIST: 
            return {
                ...state,
                guestList: action.payload,
                loading: false
            };
        case GET_GUEST: 
            return {
                ...state,
                guest: action.payload,
                loading: false
            };
        case DELETE_GUEST: 
            return {
                ...state,
                result: action.payload,
                loading: false
            };
        case ADD_GUEST: 
             return {
                 ...state,
                 guestID: action.payload,
                 loading: false
             };
        case UPDATE_GUEST: 
            return {
                ...state,
                guestID: action.payload,
                loading: false
            };
        case SET_GUEST: 
            return {
                ...state,
                guest: action.payload,
                loading: false
            };
        case GUEST_ERROR: 
            return {
                ...state,
                guestID: action.payload,
                loading: false
            };
            
        default:
            return state;
    }
}