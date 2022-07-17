import React,  {Fragment, useContext, useEffect, useState} from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Group from "@material-ui/icons/Group";
import MeetingRoom from "@material-ui/icons/HomeWork";
import TableChart from "@material-ui/icons/TableChart";
import Invitation from "@material-ui/icons/MailOutline";
import New from "@material-ui/icons/NewReleasesOutlined";
import Check from "@material-ui/icons/Check";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
// core components
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Danger from "./../../components/Typography/Danger.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardIcon from "./../../components/Card/CardIcon.js";
import CardFooter from "./../../components/Card/CardFooter.js";

import styles from "./../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import GuestContext from '../../contexts/guests/guestContext'
import SeatContext from '../../contexts/seats/seatContext'
const useStyles = makeStyles(styles);

export default function Dashboard() {
  const guestContext = useContext(GuestContext); 
  const seatContext = useContext(SeatContext); 
  const { loading, getStat, stat  } = guestContext; 
  const {  getSeatList, seatList  } = seatContext;

  const classes = useStyles();

  useEffect(() => {
     getStat(); 
    getSeatList();
    console.log(seatList)
  },[])
  const { total, confirmed, attended, newGuest } = stat;
  return (
    <div>
      <h5 style={{color:"black"}}>Guests</h5>
      <GridContainer>

        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
              <Invitation/>
              </CardIcon>
              <p className={classes.cardCategory}><b style={{ color: "black"}}>Guest Count</b></p>
              <h3 className={classes.cardTitle}>{total}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  Manage Guest
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Check />
              </CardIcon>
              <p className={classes.cardCategory}><b style={{ color: "black"}}>Confirmed Guest</b></p>
              <h3 className={classes.cardTitle}>{confirmed}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Manage Guest
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Group/>
              </CardIcon>
              <p className={classes.cardCategory}><b style={{ color: "black"}}>Attended Guest</b></p>
              <h3 className={classes.cardTitle}>{attended}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Manage Guest
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <New />
              </CardIcon>
              <p className={classes.cardCategory}><b style={{ color: "black"}}>New Guest</b></p>
              <h3 className={classes.cardTitle}>{newGuest}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Manage Users
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <MeetingRoom />
              </CardIcon>
              <p className={classes.cardCategory}><b style={{ color: "black"}}>Total Guest Attended</b></p>
              <h3 className={classes.cardTitle}>{newGuest + attended }</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Manage Users
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      {/* <GridContainer>
        <GridItem xs={12} sm={6} md={2}>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <New />
              </CardIcon>
              <p className={classes.cardCategory}><b style={{ color: "black"}}>New Guest</b></p>
              <h3 className={classes.cardTitle}>{newGuest}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Manage Users
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <MeetingRoom />
              </CardIcon>
              <p className={classes.cardCategory}><b style={{ color: "black"}}>Total Guest Attended</b></p>
              <h3 className={classes.cardTitle}>{newGuest + attended }</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Manage Users
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={2}>
        </GridItem>
      </GridContainer> */}
      <div> 
      <h5 style={{color:"black",marginBottom: '5px'}}>Seats</h5>
        <GridContainer>
          
        {seatList.map((seat, index) => (

              <GridItem xs={12} sm={6} md={3}>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success" style={{padding:'0px'}}>
                    <TableChart/>
                    </CardIcon>
                    <p className={classes.cardCategory}><b style={{ color: "black"}}>{seat.seatName}</b></p>
                    <h7 className={classes.cardTitle}>{seat.available} left</h7>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      <Danger >
                        <Warning style={{top:'-1px'}} />
                      </Danger>
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        Capacity : {seat.capacity}
                      </a>
                    </div>
                  </CardFooter>
                </Card>
              </GridItem>
            
            ))
          }
        </GridContainer>
        </div>
    </div>
  );
}
