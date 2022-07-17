import React, { useState, useReducer, useContext } from 'react'
import CrewContext from './crewContext'
import CrewReducer  from './crewReducer'
import axios from 'axios'

import { 
    GET_CREW,
    GET_CREW_LIST,
    DELETE_CREW,
    ADD_CREW,
    UPDATE_CREW,
    SET_CREW,
    CREW_ERROR,
 
} from '../types'

const CrewState = props => {

    const initialState = {
        crewList: [],
        crew: {},
        isSuccess: false,
        error: null,
        loading: true,
        result: null
     
    };
    const [state, dispatch] = useReducer(CrewReducer, initialState);
    //--------------------------Broadcast Limit-----------------------
    const getCrewList = async () => {  
            
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .get("https://localhost:7174/api/Crew/lov" , {}, config)
            .then(res =>  { 
                
                dispatch({
                    type: GET_CREW_LIST,
                    payload: res.data
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: CREW_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: CREW_ERROR,
                payload: error.message 
            })
        }
    };

    const updateCrew = async (value,field) => {   
        
        state.crew = {...state.crew,
        [field] : value };
        
        initialState.crew = state.crew;

        dispatch({
                type: SET_CREW,
                payload: initialState.crew
            })
    };

    
    //set crew
    const setCrew = async (data) => {   
        
        dispatch({
             type: GET_CREW,
            payload: data
         })
     };

   
    const getCrew = async (id) => {  
            
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .get("https://localhost:7174/api/Crew/" + id , {}, config)
            .then(res =>  { 
                
                dispatch({
                    type: GET_CREW,
                    payload: res.data[0]
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: CREW_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: CREW_ERROR,
                payload: error.message 
            })
        }
    };
   
    const deleteCrew = async (id) => {  
            
        try {
          const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        return await axios
            .delete("https://localhost:7174/api/Crew/" + id , {}, config)
            .then(res =>  { 
                
                dispatch({
                    type: DELETE_CREW,
                    payload: res.data
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: CREW_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: CREW_ERROR,
                payload: error.message 
            })
        }
    };
    const updateCrewDetails = async (data) => {  
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
            .put("https://localhost:7174/api/Crew/" , finalData, config)
            .then(res =>  { 
                
                dispatch({
                    type: UPDATE_CREW,
                    payload: res.data
                })
             }
            )
            .catch(err => {
                dispatch({
                    type: CREW_ERROR,
                    payload: err.message 
                })

            })  
            
        } catch (error) {
            dispatch({
                type: CREW_ERROR,
                payload: error.message 
            })
        }
    };

    const addCrew = async (data) => {       
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
                    .post("https://localhost:7174/api/Crew/" , finalData, config)
                    .then(res =>  { 
                        
                        dispatch({
                            type: ADD_CREW,
                            payload: res.data
                        })
                    }
                    )
                    .catch(err => {
                        dispatch({
                            type: CREW_ERROR,
                            payload: err.message 
                        })

                    })  
                
            } catch (error) {
                dispatch({
                    type: CREW_ERROR,
                    payload: error.message 
                })
            }
    };



    return (
        <CrewContext.Provider
            value={{
                
                error: state.error,
                loading: state.loading,
                isSuccess: state.isSuccess,
                crewList: state.crewList,
                crew: state.crew,
                result: state.result,
                getCrewList,
                updateCrew,
                getCrew,
                updateCrewDetails,
                addCrew,
                setCrew,
                deleteCrew
               
            }}
            >
            {props.children}
        </CrewContext.Provider>
    )
};

export default CrewState;