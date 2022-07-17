import React, { useState, useReducer, useContext } from 'react'
import SeatContext from './seatContext'
import SeatReducer  from './seatReducer'
import axios from 'axios'

import { 
    GET_SEAT,
    GET_SEATS_LIST,
    DELETE_SEAT,
    ADD_SEAT,
    UPDATE_SEAT,
    SET_SEAT,
    SEAT_ERROR
 
} from '../types'

const SeatState = props => {

    const initialState = {
        seatList: [],
        seat: {},
        isSuccess: false,
        error: null,
        loading: true,
        result: null
     
    };
    const [state, dispatch] = useReducer(SeatReducer, initialState);
    //--------------------------Broadcast Limit-----------------------
    const getSeatList = async () => {  
            
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .get("https://localhost:7174/api/Seat/lov" , {}, config)
            .then(res =>  { 
                
                dispatch({
                    type: GET_SEATS_LIST,
                    payload: res.data
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: SEAT_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: SEAT_ERROR,
                payload: error.message 
            })
        }
    };

    const updateSeat = async (value,field) => {   
        
        state.seat= {...state.seat,
        [field] : value };
        
        initialState.seat = state.seat;

        dispatch({
                type: SET_SEAT,
                payload: initialState.seat
            })
    };
   
    const getSeat = async (id) => {  
            
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .get("https://localhost:7174/api/Seat/" + id , {}, config)
            .then(res =>  { 
                
                dispatch({
                    type: GET_SEAT,
                    payload: res.data[0]
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: SEAT_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: SEAT_ERROR,
                payload: error.message 
            })
        }
    };

    const updateSeatDetails = async (data) => {  
            
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .put("https://localhost:7174/api/Seat/" , data, config)
            .then(res =>  { 
                
                dispatch({
                    type: UPDATE_SEAT,
                    payload: res.data
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: SEAT_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: SEAT_ERROR,
                payload: error.message 
            })
        }
    };

    return (
        <SeatContext.Provider
            value={{
                
                error: state.error,
                loading: state.loading,
                isSuccess: state.isSuccess,
                seatList: state.seatList,
                seat: state.seat,
                result: state.result,
                getSeatList,
                updateSeat,
                getSeat,
                updateSeatDetails
               
            }}
            >
            {props.children}
        </SeatContext.Provider>
    )
};

export default SeatState;