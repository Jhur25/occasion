import React, {Fragment, useContext, useEffect, useState} from 'react'

import GuestContext from '../../../contexts/guests/guestContext'
//import TuneIcon from '@mui/material';
import { MDBDataTable } from 'mdbreact';

//import {tableIcons} from '../../controls/TableIcons'
import Popup from '../../../components/controls/Popup'
import GuestDetails from './GuestDetails';



export default function Guest(props) { 
    const [finalData, setfinalData] = useState({});
    const table = {
        columns: [
          // {
          //   label: 'Guest ID', 
          //   field: 'id',
          //   sort: 'asc',
          //   width: 20
          // },
          {
            label: 'Guest Name', 
            field: 'name',
            sort: 'asc',
            width: 270
          },
          {
            label: 'Seat', 
            field: 'seatName',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Role', 
            field: 'role',
            sort: 'asc',
            width: 100
          },
          {
            label:  'Queue', 
            field: 'number',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Present', 
            field: 'isPresent',
            sort: 'asc',
            width: 150
          },
          {
            label:  'Confirm', 
            field: 'isConfirm',
            sort: 'asc',
            width: 100
          },
          {
            label:   'Confirmation Date',
             field: 'dateConfirmation',
            sort: 'asc',
            width: 100
          },
          {
            label:  'New Guest', 
            field: 'isNew',
            sort: 'asc',
            width: 100
          },
          {
            label:  'With', 
            field: 'companionID',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Action',
            field: 'action'
          }
        ]
    };
    const [openPopup, setOpenPopup] = useState(false)
    const guestContext = useContext(GuestContext); 
    const {
        getGuestList,
        updateGuest,
        guestList,
        error,
        setGuest,
        updateGuestDetails,
        loading  } = guestContext; 


    useEffect( () => {
        getGuestList(); 
        if(guestList !== []){
            const data = [];
            for(let i = 0; i < guestList.length; i++){
                    data.push({...guestList[i], 
                        dateConfirmation: getDate(guestList[i].dateConfirmation),
                        isConfirm: guestList[i].isConfirm === true ? 'Yes' : 'No',
                        isNew: guestList[i].isNew === true ? 'Yes' : 'No',
                        companionID: guestList[i].companionID === null ? 'None' : guestList[i].companionID,
                        isPresent: new Date().getDate() === 29 && guestList[i].isPresent == true ? 'Yes' : 'N/A',
                        action : <div> <button className="btn btn-primary" onClick={() => Edit(guestList[i], 2)}>Update</button> <button className={guestList[i].isPresent === true ? "btn btn-success"  : "btn btn-danger" } onClick={() => Confirm(guestList[i])} disabled={guestList[i].isPresent === true ? true : false}>{guestList[i].isPresent === true ? "Confirmed"  : "Confirm" }</button> </div>  })
            } 

            setfinalData({...table, rows : data});
        }

    },[guestList.length])

    const [popUpTitle, setPopUpTitle] = useState('');
    const [guestInfo, setGuestInfo] = useState({});
    const [open, setOpen] = React.useState(false);
    const [Base, setBase] = useState(0);

    const getDate = (value) => {
        let newDate =  new Date(value);
        let date = newDate.getDate().toString().length === 2 ? newDate.getDate() : '0' + newDate.getDate(); //Current Date
        let mon =  newDate.getMonth() + 1
        let month =  mon.toString().length === 2 ? mon : '0' + mon ;//Current Month
        let year = newDate.getFullYear(); //Current Year

        return  month + '-' + date + '-' + year 
    }   

    const openInPopup = item => {
        setOpenPopup(true)
    }

    const Edit = (rowData, base) => {
        setGuestInfo(rowData);
        setBase(base);
         if(base === 2){
            setPopUpTitle('Edit Guest - ' + rowData.name)
            
        }else{  
          setGuest({})
            setPopUpTitle('Add Guest ')
        }
        openInPopup(rowData)
    }
    
    const Confirm = async (rowData) => {
        const data = {...rowData, isPresent: true }
        await  updateGuestDetails(data);
        await getGuestList(); 
     }

     const closeModal = async () => {
        setOpenPopup(false);
        await getGuestList(); 
    }
  
    return (
        <Fragment>   

            <div className="content-wrapper"
                style={{minHeight: "200px", backgroundColor:"white"}}
            >          
                <section className="content">
             
                   {   !loading && guestList ? (    
                            <div className="container-fluid"  style={{paddingTop:"20px"}}>
                    <MDBDataTable
                    bordered
                    hover
                    small
                    data={finalData}
                    className="mj"
                    />
                    <table align='right'> 
                          <tr>
                            <td className="resetTD">             
                            </td> 
                            <td className="resetTD">
                               
                                <button                          
                                    variant="contained" 
                                    className="btn btn-warning default"
                                    fullWidth
                                    type = "submit"
                                    onClick={ (e)=> { Edit(e,1)} }>
                                    Add Guest
                                </button> 
                            </td>
                            </tr>
                    </table> 
                        </div> ) : ( null )
                    }
       
                        
                </section>
                <Popup
                    
                    title= {popUpTitle}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                   <GuestDetails                   
                        closeModal = {closeModal}
                        base ={Base}
                        data = {guestInfo}
                        guestList ={guestList}
                    />  
                    
                    
                    
                </Popup>
            </div>
           
        </Fragment>
    )
}

