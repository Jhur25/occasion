import React, { useContext, useEffect ,useState} from 'react';

const AlertCrew = (props) => {
    const {  closeModal, base, data, deleteCrew } = props;

  return (
    <div>

      <table className="table table-borderless"><tbody>
      </tbody>
          <tr>
            <td className="resetTD">             
            </td> 
            <td className="resetTD">             
            </td> 
            <td className="resetTD">
                <button 
                  className="btn btn-primary default btnAddCrew"
                  fullWidth
                  type = "submit"   
                  onClick={ (e)=> { closeModal()} }>
                  Cancel
                </button>  
                <button              
                    className="btn btn-danger default btnAddCrew"
                    fullWidth
                    type = "submit"
                    onClick={ (e)=> { deleteCrew()} }>
                    Delete
                </button> 
            </td>
            </tr>
          </table>
      
    </div>
  );
};
export default AlertCrew