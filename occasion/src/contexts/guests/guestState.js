import React, { useState, useReducer, useContext } from 'react'
import GuestContext from './guestContext'
import GuestReducer  from './guestReducer'
import axios from 'axios'

import { 
    GET_GUEST,
    GET_GUESTS_LIST,
    DELETE_GUEST,
    ADD_GUEST,
    UPDATE_GUEST,
    SET_GUEST,
    GUEST_ERROR,
    GET_STAT
 
} from '../types'

const GuestState = props => {

    const initialState = {
        guestList: [],
        guest: {},
        isSuccess: false,
        error: null,
        loading: true,
        result: null,
        stat:{}
     
    };
    const [state, dispatch] = useReducer(GuestReducer, initialState);
    //--------------------------Broadcast Limit-----------------------
    const getGuestList = async () => {  
            
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .get("https://localhost:7174/api/Guest/lov" , {}, config)
            .then(res =>  { 
                
                dispatch({
                    type: GET_GUESTS_LIST,
                    payload: res.data
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: GUEST_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: GUEST_ERROR,
                payload: error.message 
            })
        }
    };

    const updateGuest = async (value,field) => {   
        
        state.guest= {...state.guest,
        [field] : value };
        
        initialState.guest = state.guest;

        dispatch({
                type: SET_GUEST,
                payload: initialState.guest
            })
    };
   
    const getGuest = async (id) => {  
            
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .get("https://localhost:7174/api/Guest/" + id , {}, config)
            .then(res =>  { 
                
                dispatch({
                    type: GET_GUEST,
                    payload: res.data[0]
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: GUEST_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: GUEST_ERROR,
                payload: error.message 
            })
        }
    };

    const setGuest = async (data) => {   
        
        dispatch({
             type: GET_GUEST,
            payload: data
         })
     };

    const updateGuestDetails = async (data) => {  
            var dt = new Date(data.dateConfirmation);
            const finalData ={...data, isPresent: data.isPresent === 'true' || data.isPresent === true ? true : false,
                isNew: data.isNew === 'true' || data.isNew === true ? true : false,
                isConfirm: data.isConfirm === 'true' || data.isConfirm === true ? true : false,
                dateConfirmation: new Date(data.dateConfirmation)
            }
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .put("https://localhost:7174/api/Guest/" , finalData, config)
            .then(res =>  { 
                
                dispatch({
                    type: UPDATE_GUEST,
                    payload: res.data
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: GUEST_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: GUEST_ERROR,
                payload: error.message 
            })
        }
    };

    const addGuest = async (data) => {       
        try {
                var dt = new Date(data.dateConfirmation);
                const finalData ={...data, isPresent: data.isPresent === 'true' || data.isPresent === true ? true : false,
                    isNew: data.isNew === 'true' || data.isNew === true ? true : false,
                    isConfirm: data.isConfirm === 'true' || data.isConfirm === true ? true : false,
                    dateConfirmation: new Date(data.dateConfirmation),
                    id: 0
                }
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                return await axios
                    .post("https://localhost:7174/api/Guest/" , finalData, config)
                    .then(res =>  { 
                        
                        dispatch({
                            type: ADD_GUEST,
                            payload: res.data
                        })
                    }
                    )
                    .catch(err => {
                        dispatch({
                            type: GUEST_ERROR,
                            payload: err.message 
                        })

                    })  
                
            } catch (error) {
                dispatch({
                    type: GUEST_ERROR,
                    payload: error.message 
                })
            }
    };

    const getStat = async () => {  
            
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .get("https://localhost:7174/api/Stat/lov" , {}, config)
            .then(res =>  { 
                
                dispatch({
                    type: GET_STAT,
                    payload: res.data[0]
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: GUEST_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: GUEST_ERROR,
                payload: error.message 
            })
        }
    };


    return (
        <GuestContext.Provider
            value={{
                
                error: state.error,
                loading: state.loading,
                isSuccess: state.isSuccess,
                guestList: state.guestList,
                guest: state.guest,
                result: state.result,
                stat: state.stat,
                getGuestList,
                updateGuest,
                getGuest,
                updateGuestDetails,
                addGuest,
                getStat,
                setGuest
               
            }}
            >
            {props.children}
        </GuestContext.Provider>
    )
};

export default GuestState;