import React, { useContext, useEffect ,useState} from 'react';
import CrewContext from '../../../contexts/crew/crewContext'
import "react-datepicker/dist/react-datepicker.css";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MenuItem,FormControl , InputLabel,Select } from '@material-ui/core';
const CrewDetails = (props) => {
    const {  closeModal, base, data, crewList } = props;
    const crewContext = useContext(CrewContext);
    const { crew,  getCrewList, updateCrew, getCrew, updateCrewDetails, addCrew, loading } = crewContext;

    useEffect(() => {
        if(base === 2){
            getCrew(data.id); 
            
        }

    },[])

    const { id, name , role, seatNo} = crew;

    const handleChange = (e, field) => {  
        let val = e.target.value;
        updateCrew(val, field);
    };
    
    const saveCrew = async (e, base) =>{
        if(base === 1){
           await addCrew(crew);
        }else{
            await updateCrewDetails(crew);
        }

        closeModal();
    }
    const clear =(e, base) =>{
        handleChange(e,'name');
        handleChange(e,'role');
        closeModal();
    }
  return (
    <div>

      <table className="table table-borderless"><tbody>
   
            <tr>
                <td className="p2px">
                  <TextField
                    className="form-control"
                    variant = "outlined"
                    label = "Crew ID"
                    name = "id"
                    value={ id }
                    maxLength={50} 
                    disabled={true}/>
                </td>
              <td className="p2px">
                  <TextField
                    className="form-control"
                    variant = "outlined"
                    label = "Crew Name"
                    name = "name"
                    value={ name || "" }
                    onChange={(e) => handleChange(e,'name')} 
                    maxLength={50} />
                </td>
              <td className="p2px">
                <TextField            
                    className="form-control" 
                    variant = "outlined"
                    label = "Role"
                    name = "role"
                    value={  role || "" }
                    onChange={(e) => handleChange(e,'role')} 
                    maxLength={50}/>
                </td>

            </tr>
        
      </tbody>
          <tr>
            <td className="resetTD">             
            </td> 
            <td className="resetTD">             
            </td> 
            <td className="resetTD">
                <button 
                  className="btn btn-danger default"
                  fullWidth
                  type = "submit"   
                  onClick={ (e)=> { clear()} }>
                  Cancel
                </button>  
                { base === 1 ?
                <button                          
                    variant="contained" 
                    className="btn btn-success default"
                    fullWidth
                    type = "submit"
                    onClick={ (e)=> { saveCrew(e,1)} }>
                    Add
                </button> :
                        <button                          
                        variant="contained" 
                        className="btn btn-success default"
                        fullWidth
                        type = "submit"
                        onClick={ (e)=> { saveCrew(e,2)} }>
                        Update
                    </button> 
                }
            </td>
            </tr>
          </table>
      
    </div>
  );
};
export default CrewDetails;