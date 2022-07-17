import React, { useContext, useEffect ,useState} from 'react';
import GuestContext from '../../../contexts/guests/guestContext'
import SeatContext from '../../../contexts/seats/seatContext'
import "react-datepicker/dist/react-datepicker.css";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MenuItem,FormControl , InputLabel,Select } from '@material-ui/core';
const GuestDetails = (props) => {
    const {  closeModal, base, data, guestList } = props;
    const guestContext = useContext(GuestContext);
    const seatContext = useContext(SeatContext);
    const { guest, updateGuest,getGuestList, getGuest, updateGuestDetails, addGuest, loading } = guestContext;
    const { seatList, getSeatList, isSuccess } = seatContext;

    useEffect(() => {
        getSeatList();
        if(base === 2){
             getGuest(data.id); 
        }

    },[])

    const { id, name , role, seat, isPresent, isConfirm, dateConfirmation, isNew, companionID } = guest;

    const handleChange = (e, field) => {  
        let val;
        if(field === 'dateConfirmation'){
            val = e;
        }
        else{
            val = e.target.value;
        }
        updateGuest(val, field);
    };
    
    const saveGuest = async(e, base) =>{
        if(base === 1){
            await addGuest(guest);
        }else{
           await updateGuestDetails(guest);
        }
       await getGuestList();
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
                    label = "Guest ID"
                    name = "id"
                    value={ id }
                    maxLength={50} 
                    disabled={true}/>
                </td>
              <td className="p2px">
                  <TextField
                    className="form-control"
                    variant = "outlined"
                    label = "Guest Name"
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
                    defaultValue={"saft"}
                    onChange={(e) => handleChange(e,'role')} 
                    maxLength={50}/>
                </td>

            </tr>
            <tr>

              <td className="tableTD"> 
                    <div className="card mb5">
                        <div className="card-header">Confirm</div>
                        <div className="card-body pad-card">
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="radio"  onChange={ (e) => handleChange(e,'isConfirm') } value='true' name="confirm" checked={ isConfirm === "true" || isConfirm === true}/> Yes
                                </label>
                            </div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="radio"   onChange={ (e) => handleChange(e,'isConfirm') } value='false' name="confirm" checked={  isConfirm === "false"  || isConfirm === false}/> No
                                </label>
                            </div>
                        </div>
                    </div>
              </td>              

              <td className="tableTD"> 
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                            label="Confirmation Date"
                            inputFormat="MM/dd/yyyy"
                            value={dateConfirmation}
                            onChange={ (e) => handleChange(e,'dateConfirmation')}
                            renderInput={(params) => <TextField {...params} />}
                            disabled={isConfirm === "false"  || isConfirm === false ? true : false}
                            />
                </LocalizationProvider>
              </td>
              <td className="p2px"> 
                    <div className="card bx mb-3">
                            
                                <FormControl>
                                <InputLabel>Seat</InputLabel>
                                <Select  style={{minWidth: "180px"}} value={ seat || ''} onChange={(e) => handleChange(e, 'seat')}  >
                                    {seatList.map((seats, index) => (
                                        <option value={seats.id} disabled={seats.available === 0 ? true : false} >{seats.seatName} -- {seats.available} left</option>
                                        ))}
                                </Select>
                                </FormControl> 
                        

                    </div>
                </td>

            </tr>
            <tr style={{ borderTop:"1px solid black" }}>
            <td className="tbTD"> 
                    <div >
                        <div className="card-body pad-card">
                        <div style={{ marginBottom:"1rem" }}>Present</div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="radio"  onChange={ (e) => handleChange(e,'isPresent') } value='true' name="present"  checked={isPresent === "true" || isPresent === true}/> Yes
                                </label>
                            </div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="radio"   onChange={ (e) => handleChange(e,'isPresent') } value='false' name="present"  checked={isPresent === "false" || isPresent === false}/> No
                                </label>
                            </div>
                        </div>
                    </div>
                </td>
                <td className="tbTD"> 
                    <div>
                        <div className="card-body pad-card">
                        <div style={{ marginBottom:"1rem" }}>New Guest</div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="radio"  onChange={ (e) => handleChange(e,'isNew') } value='true' name="new" checked={isNew === "true" || isNew === true}/> Yes
                                </label>
                            </div>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="radio"   onChange={ (e) => handleChange(e,'isNew') } value='false' name="new" checked={isNew === "false" || isNew === false}/> No
                                </label>
                            </div>
                        </div>
                    </div>
                </td>
                <td className="tableTD"> 
                    <div className="card bx mb-3">
                            <FormControl>
                            <InputLabel>Companion</InputLabel>
                            <Select  style={{minWidth: "180px"}}  value={ companionID || '' } onChange={(e) => handleChange(e, 'companionID')}  >
                                {guestList.map((company, index) => (
                                    <option value={company.id} >{company.name}</option>
                                    ))}
                            </Select>
                            </FormControl> 
                    </div>
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
                  onClick={ (e)=> { closeModal()} }>
                  Cancel
                </button>  
                { base === 1 ?
                <button                          
                    variant="contained" 
                    className="btn btn-success default"
                    fullWidth
                    type = "submit"
                    onClick={ (e)=> { saveGuest(e,1)} }>
                    Add
                </button> :
                        <button                          
                        variant="contained" 
                        className="btn btn-success default"
                        fullWidth
                        type = "submit"
                        onClick={ (e)=> { saveGuest(e,2)} }>
                        Update
                    </button> 
                }
            </td>
            </tr>
          </table>
      
    </div>
  );
};
export default GuestDetails;