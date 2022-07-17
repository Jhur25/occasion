import React, {Fragment, useContext, useEffect, useState} from 'react'

import CrewContext from '../../../contexts/crew/crewContext'
//import TuneIcon from '@mui/material';
import { MDBDataTable } from 'mdbreact';

//import {tableIcons} from '../../controls/TableIcons'
import Popup from '../../controls/Popup'
import CrewDetails from './CrewDetails';
import AlertCrew from './AlertCrew';



export default function Crew(props) { 
    const [finalData, setfinalData] = useState({});
    const table = {
        columns: [
          {
            label: 'Crew ID', 
            field: 'id',
            sort: 'asc',
            width: 20
          },
          {
            label: 'Crew Name', 
            field: 'name',
            sort: 'asc',
            width: 270
          },
          {
            label: 'Role', 
            field: 'role',
            sort: 'asc',
            width: 100
          },
          {
            label: 'Action',
            field: 'action'
          }
        ]
    };
    const crewContext = useContext(CrewContext); 
    const {
        getCrewList,
        crewList,
        error,
        setCrew,
        deleteCrew,
        updateCrewDetails,
        loading  } = crewContext; 
      const [refreshKey, setRefreshKey] = useState(0);

    useEffect( () => {
      
        getCrewList(); 
        if(crewList !== []){
            const data = [];
            for(let i = 0; i < crewList.length; i++){
                    data.push({...crewList[i], 
                        action : <div style={{margin:'auto', width:'50%'}}> <button className="btn btn-primary btnCrew" onClick={() => Edit(crewList[i], 2)}>Update</button> <button className="btn btn-danger btnCrew" onClick={() => Delete(crewList[i])} >Delete</button> </div>  })
            } 
            setfinalData({...table, rows : data});
        }

    },[crewList.length])

    const [popUpTitle, setPopUpTitle] = useState('');
    const [openPopup, setOpenPopup] = useState(false)
    const [crewInfo, setCrewInfo] = useState({});
    const [open, setOpen] = React.useState(false);
    const [Base, setBase] = useState(0);
    const [popUpAlert, setPopUpAlert] = useState('');
    const [openAlert, setOpenAlert] = useState(false)
    const [crewIdNum, setcrewIdNum] = useState(0);
    const openInPopup = item => {
        setOpenPopup(true)
    }
    const openInAlert = item => {
      setOpenAlert(true)
    }

    const Edit = (rowData, base) => {
        setCrewInfo(rowData);
        setBase(base);
         if(base === 2){
            setPopUpTitle('Edit Crew - ' + rowData.name)
            
        }else{  
             setCrew({});
            setPopUpTitle('Add Crew ')
        }
        openInPopup(rowData)
    }
    
    const Delete = async (rowData) => {
      setPopUpAlert("Are you sure you want to delete this crew?")
      openInAlert()
      setcrewIdNum(rowData.id)
        // await  deleteCrew(rowData.id);
        //  await getCrewList(); 
     }
         
    const DeleteCrew = async () => {
        await  deleteCrew(crewIdNum);
        await getCrewList(); 
        setOpenAlert(false)
     }

     const closeModal = async () => {
       await getCrewList(); 
        setOpenPopup(false) 
    }
  
    return (
        <Fragment>   
    <table align='right'> 
                          <tr>
                            <td className="resetTD">             
                            </td> 
                            <td className="btnTD">
                               
                                <button                          
                                    variant="contained" 
                                    className="btn btn-warning default btnAddCrew"
                                    fullWidth
                                    type = "submit"
                                    onClick={ (e)=> { Edit(e,1)} }>
                                    Add Crew
                                </button> 
                            </td>
                            </tr>
                    </table> 
            <div className="content-wrapper"
                style={{minHeight: "200px", backgroundColor:"white"}}
            >          
                <section className="content">
             
                   {   !loading && crewList ? (    
                            <div className="container-fluid"  style={{paddingTop:"20px"}}>
                    <MDBDataTable
                    striped
                    bordered
                    small
                    data={finalData}
                    className="jhur"
                    />
                
                        </div> ) : ( null )
                    }
       
                        
                </section>
                <Popup
                    
                    title= {popUpTitle}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                   <CrewDetails                   
                        closeModal = {closeModal}
                        base ={Base}
                        data = {crewInfo}
                        crewList ={crewList}
                    />  
                                    
                </Popup>
                <Popup
                    
                    title= {popUpAlert}
                    openPopup={openAlert}
                    setOpenPopup={setOpenAlert}
                >
                  <AlertCrew                   
                        closeModal = {setOpenAlert}
                        base ={Base}
                        deleteCrew ={DeleteCrew}
                    />  
                  </Popup>
            </div>
           
        </Fragment>
    )
}

