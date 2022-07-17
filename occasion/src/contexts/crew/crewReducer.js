import { 
    GET_CREW,
    GET_CREW_LIST,
    DELETE_CREW,
    ADD_CREW,
    UPDATE_CREW,
    SET_CREW,
    CREW_ERROR
  } from '../types'

export default (state, action) => {
    switch(action.type) {

        case GET_CREW_LIST: 
            return {
                ...state,
                crewList: action.payload,
                loading: false
            };
        case GET_CREW: 
            return {
                ...state,
                crew: action.payload,
                loading: false
            };
        case DELETE_CREW: 
            return {
                ...state,
                result: action.payload,
                loading: false
            };
        case ADD_CREW:
             return {
                 ...state,
                 crewID: action.payload,
                 loading: false
             };
        case UPDATE_CREW: 
            return {
                ...state,
                crewID: action.payload,
                loading: false
            };
        case SET_CREW: 
            return {
                ...state,
                crew: action.payload,
                loading: false
            };
        case CREW_ERROR: 
            return {
                ...state,
                crewID: action.payload,
                loading: false
            };
            
        default:
            return state;
    }
}