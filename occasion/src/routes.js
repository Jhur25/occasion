// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// core components/views for Admin layout
import DashboardPage from "./views/Dashboard/Dashboard.js";
import GuestPage from "./components/Views/guest/Guest";
import CrewPage from "./components/Views/crew/Crew";

//import DowntimePage from "./views/Downtime/DowntimeMain.js";
const dashboardRoutes = [
  {
    path: "/stat",
    name: "Statistics",
    icon: Dashboard,
    component: <DashboardPage/>,
    layout: "/admin",
  },
  {
    path: "/guest",
    name: "Guest List",
    icon: Person,
    component: <GuestPage/>,
    layout: "/admin",
   },
  {
    path: "/crew",
    name: "Crew List",
    icon: Person,
    component: <CrewPage />,
    layout: "/admin",
  },
  // {
  //   path: "/vehicle",
  //   name: "Vehicle Management",
  //   icon: Person,
  //   component: VehiclePage,
  //   layout: "/admin",
  // },
  // {
  //   path: "/downtime",
  //   name: "Downtime Management",
  //   icon: Person,
  //   component: DowntimePage,
  //   layout: "/admin",
  // }
];

export default dashboardRoutes;
