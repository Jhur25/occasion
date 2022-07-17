import { 
    GET_SEAT,
    DELETE_SEAT,
    ADD_SEAT,
    UPDATE_SEAT,
    SEAT_ERROR,
    SET_SEAT,
    GET_SEATS_LIST
  } from '../types'

export default (state, action) => {
    switch(action.type) {
        
        case GET_SEATS_LIST: 
            return {
                ...state,
                seatList: action.payload,
                isSuccess: true
            };
        case GET_SEAT: 
            return {
                ...state,
                seat: action.payload,
                loading: false
            };
        case DELETE_SEAT: 
            return {
                ...state,
                result: action.payload,
                loading: false
            };
        case ADD_SEAT: 
             return {
                 ...state,
                 seatID: action.payload,
                 loading: false
             };
        case UPDATE_SEAT: 
            return {
                ...state,
                seatID: action.payload,
                loading: false
            };
        case SET_SEAT: 
            return {
                ...state,
                seat: action.payload,
                loading: false
            };
        case SEAT_ERROR: 
            return {
                ...state,
                seatID: action.payload,
                loading: false
            };
            
        default:
            return state;
    }
}