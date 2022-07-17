import logo from './logo.svg';
import './App.css';
import Guest from './../src/components/Views/guest/Guest'
import GuestState from './contexts/guests/guestState';
import SeatState from './contexts/seats/seatState';
import CrewState from './contexts/crew/crewState';
import { Container } from '@material-ui/core';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import { createBrowserHistory } from "history";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GuestPage from "./components/Views/guest/Guest";
import CrewPage from "./components/Views/crew/Crew";
// core components
import Admin from "./layouts/Admin";
import Dashboard from "./views/Dashboard/Dashboard";

import "./assets/css/material-dashboard-react.css?v=1.9.0";
const hist = createBrowserHistory();

function App() {
  return (
  
  <div>  
      
      <BrowserRouter>
          <CrewState>
            <SeatState>
              <GuestState>
                  <Routes>
                      <Route path="/" element={<Admin />}>
                          <Route path="/admin/stat" element={<Dashboard />} ></Route>
                          <Route path="/admin/guest" element={<GuestPage />} ></Route>
                          <Route path="/admin/crew" element={<CrewPage />} ></Route>
                      </Route>
                  </Routes>
                  </GuestState>
              </SeatState>
          </CrewState>
        </BrowserRouter>
      </div>
    // <Container>
    //    <SeatState>
    //     <GuestState>
    //         <Guest />

    //     </GuestState>
    //   </SeatState>
    // </Container>
  );
}

export default App;
