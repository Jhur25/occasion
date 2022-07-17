import React, { useEffect, useState,useRef, useContext } from 'react'
import {MuiPickersUtilsProvider, KeyboardTimePicker} from '@material-ui/pickers';
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment'
import * as d3 from 'd3'
//import data from "components/userData.js"
// Style
import "./Downtime.scss";
//import DowntimeContext from 'contexts/downtimeContext/DowntimeContext';


const DowntimeMain = (props)=>{
const width = 500;
const padding = 20;
let max = 472;
const maxSelected = 480;
const recWidth = 120;
const recHeight = 21.5;
const min = 20;
const recY = 11.2;
const svgRef = useRef();
const svgSelectedRef = useRef();
const [record, setData]=useState([])
const [times, setTIme]=useState([])
const [downtimeEntry, setdowntimeEntry]=useState([])
const [finalDowntimeEntry, setFinalDowntimeEntry]=useState([])
const [lastTime, setLastTime]=useState(null);
const [firstTime, setFirstTime]=useState(null);
const setTime = useRef({});
const setAxis = useRef([]);
const setSeletedData = useRef([]);
const xScaleGlobal = useRef(null);
const enableBtn = useRef(false);
const shiftTime = useRef([]);
const shiftStart = useRef(null);
const shiftEnd = useRef(null);
const setWidth = useRef({});
const [isDisable, setDisable]=useState(true)
const xScaleSelectedGlobal = useRef(null);

const dateTimetoDateOnly = (value, base) => {
    let d = new Date();
    if (base ===  1) {
        d = moment(value).add(1, "days").toDate();;
    } else if (base === 2) {
        d = moment(value).subtract(1, "days").toDate();;
    } else {
        d = value;
    }

    var year = d.getFullYear();
    var mes = d.getMonth()+1;
    var dia = d.getDate();
    var fecha = year+"-"+mes+"-"+dia;
    return fecha;
}

//CHANGE TIME IN TEXTBOX
const handleChange = (value, base) =>{   
    let baseforlapsetimeline = 0;
    if(base ===1 ){
        setFirstTime(value);       
        if(!isNaN(value) && value !== null){
            const secondsST = value.getHours();
            if(lastTime){
                if (secondsST <= 23 && lastTime.getHours() <= 2 && secondsST > lastTime.getHours() ) {
                    baseforlapsetimeline = 2;
                } 
                const date = dateTimetoDateOnly(lastTime, baseforlapsetimeline); 
                const newVal = new Date(`${date} ${value.getHours()}:${value.getMinutes()}`);
                console.log(newVal);
                changeSelectedTime(newVal,null,1);
            }
        }
    }
    else{
        setLastTime(value);
        if(!isNaN(value) && value !== null){  
            const secondsLT = value.getHours(); 
            if(firstTime){
                if (secondsLT <= 2 && firstTime.getHours() <= 23) {
                    baseforlapsetimeline = 1;
                }
                const date = dateTimetoDateOnly(firstTime, baseforlapsetimeline);
                const newVal = new Date(`${date} ${value.getHours()}:${value.getMinutes()}`);
                console.log(newVal);
                changeSelectedTime(null,newVal,1)
            }
        }
    }


}
//CHANGE SELECTED TIME IN ZOOM TIMELINE
const changeSelectedTime = (FT,LT,base) =>{  
    
    FT = FT == null ? firstTime: FT;
    LT = LT ==  null ? lastTime : LT;
    if(FT && LT || (FT !== "Invalid date" && LT !== "Invalid date")){ 
        var secondsST = FT.getTime() / 1000;
        var secondsET = LT.getTime() / 1000;       
        
        if(secondsST < secondsET ){

                if(base === 0){
                    for(var i = 0; i < finalDowntimeEntry.length; i++){
                        var StopReason =  finalDowntimeEntry[i].StopReason; 
                        var dateStart = new Date(finalDowntimeEntry[i].StartTime);
                        var dateEnd = new Date(finalDowntimeEntry[i].EndTime);
                        var ftStart = new Date(FT);
                        var secondsST = dateStart.getTime() / 1000;
                        var secondsET = dateEnd.getTime() / 1000;
                        var secondsxET = ftStart.getTime() / 1000;

                        if(secondsxET > secondsST && secondsxET < secondsET ){
                            if(StopReason !== "Running"){
                                FT = finalDowntimeEntry[i].StartTime;
                                break;   
                            }
                        }
                    }

                    for(var i = 0; i < finalDowntimeEntry.length; i++){
                        var StopReason =  finalDowntimeEntry[i].StopReason; 
                        var dateStart = new Date(finalDowntimeEntry[i].StartTime);
                        var dateEnd = new Date(finalDowntimeEntry[i].EndTime);
                        var ltEnd = new Date(LT);
                        var secondsST = dateStart.getTime() / 1000;
                        var secondsET = dateEnd.getTime() / 1000;
                        var secondsxET = ltEnd.getTime() / 1000;

                        if(secondsxET > secondsST && secondsxET < secondsET ){
                            if(StopReason !== "Running"){
                                LT = finalDowntimeEntry[i].EndTime;
                                break;  
                            } 
                        }
                    }
                } 
                const StartHour = new Date(FT);
                const FinishHour = new Date(LT);

                setTime.current = {firstTime:StartHour, lastTime:FinishHour}

                mainSlider(StartHour,FinishHour);
                SelectedValue(StartHour,FinishHour);
        }
        else{
           // alert("StartTime " + FT +" is greater than LastTIme " + LT + " !")
        }
    }
}
//ENABLE CUSTOM TIME BUTTON
const enableCustomizeTime = () =>{
    var selectedSVG = d3.select(svgSelectedRef.current);

    enableBtn.current = !enableBtn.current;
    setDisable(!enableBtn.current)
    if(enableBtn.current){
        d3.select("#btnCustom").classed("btnClicked",true);

    }
    else{
        d3.select("#btnCustom").classed("btnClicked",false);


    }
    if(!enableBtn.current){
        selectedSVG.select('.overlay').attr("pointer-events","none")
        selectedSVG.select('.selected').attr("pointer-events","none")
    }else{
        selectedSVG.select('.overlay').attr("pointer-events","all")
        selectedSVG.select('.selected').attr("pointer-events","all")
    }
}
//CHANGE COLOR DEPENDS ON STOPS ---------------------------------------------------
const changeColorLabel = (d) => { 
    if(d){
        if(d.Description === "M&P Recorded Stoppages" || d.Description === "Non M&P Recorded Stoppages"){      
            return "red"
        }
        else if(d.Description === "Machine in Transit/Upgrade") {
            return 'dark gray'
        }
        else if(d.Description === "Other Planned Downtime" || d.Description === "Planned Technical Downtime") {

            return '#1aa9dd'
        }
        else if(d.Description === "Idle Time" || d.Description === "Management Shutdown") {
          return 'lightgray'
        }
        else if(d.Description === "Undone") {
            return 'gray'
        }
        else if(d.Description === "Legal Shutdown") {
            return 'lightyellow'
          }
        else{
    
            return 'green'
        }
    }
}
//CONVERT TIME FORMAT STRING--------------------------------------------------------------------
const oneLiner = (hour = "00", min = "00") => `${(hour % 24) || 0}:${("0" + min).slice(-2)}`
//CONVERT TIME 24 FORMAT TO 12 HOUR FORMAT AND ADD INTERVAL IF APPLICABLE------------------------- 
const returnTime = (time, interval) => {
    var parseTime = time.split(':');
    let minuto = 0;
    let hour = 0;
    let startMinute = parseInt(parseTime[1]) - interval
    let startHour = parseInt(parseTime[0])
    if(interval === 1){
        minuto = startMinute < 0 ? 59 : startMinute
        hour = startMinute <  0 ?  startHour - 1  : startHour
    }
    else if(interval === 2){
        let startMinute = parseInt(parseTime[1]) + 1
        minuto = startMinute > 59 ? 0 : startMinute
        hour = startMinute > 59 ?  startHour + 1  : startHour
    }   
    else{
        minuto = startMinute > 59 ? 0 : startMinute
        hour = startMinute > 59 ?  startHour + 1  : startHour
    }

    let newStart = hour + ":" + minuto 

    return oneLiner(...newStart.split(":"))
}
//ADD TIME  +30 & -30 MINUTES
const addTime = (time,isAdd, interval) =>{
        let minuteStart = 0;
        let hourStart  = 0;
        let splitStart = time.split(":");
        let oldStartHour = parseInt(splitStart[0]);
        let oldStartMinute = parseInt(splitStart[1]);
        if(isAdd){
            if(oldStartHour <= 11 && oldStartMinute < interval){
                minuteStart = oldStartMinute + interval
                hourStart  = oldStartHour 
            }
            else if(oldStartHour < 11 && oldStartMinute >= interval){
                minuteStart = (oldStartMinute + interval) - 60
                hourStart  = oldStartHour + 1
            }       
            else {
                hourStart  = oldStartHour;
                minuteStart = 59;
            }
        }
        else
        {     
            if(oldStartHour > 0 && oldStartMinute < interval){
                minuteStart = (60 +  oldStartMinute) - interval
                hourStart  = oldStartHour - 1
            }
            else if(oldStartHour > 0 && oldStartMinute > interval || oldStartHour <= 0 && oldStartMinute > interval){
                minuteStart = oldStartMinute - interval
                hourStart  = oldStartHour
            }       
            else {
                hourStart  = oldStartHour;
                minuteStart = 0;
            }
            
        }
        let selectedStartTime = returnTime(hourStart + ":" + minuteStart,0)

    return selectedStartTime;
}
//SHOW 12 HOUR LINE AXIS OR SELECTED AXIS LINE
const axisLine = (start, end, base )  =>{
     
    var x = 1; //MINUTES INTERVAL
    var tt = 1; //START TIME
    //times[0]= '0:00'

    //GET 12 HOUR TIME
    for (var i=0; tt <= 24*61; i++) {
        var hh = Math.floor(tt/60);
        var mm = (tt%60); 
        times[i] = `${(`${hh === 24 ? 0 : hh % 24}`).slice(-2)}:${(`0${mm}`).slice(-2)}`;

        tt = tt + x;
    }   

  //  console.log(times)
    //SET POINTER XAXIS ---------------------------------------------------------------
    //FULL 12 HOUR base 1
    if(base === 1){
      
        for(var i = 0; i < times.length; i++){
            var val  = times[i].split(":");
            if(start <= parseInt(val[0])  &&  end >=  parseInt(val[0])){
                shiftTime.current.push(times[i])
                if(end === parseInt(val[0])){
                    shiftTime.current.push(times[i])
                    break;
                }
            }
        }

       // console.log( shiftTime.current)
    }
    else{
    //SHOW AXIS SELECTED TIMELINE BASE 2-----------------------------------------------------
    //Add Base Start or Base End for additional axis
        for(var i = 0; i < times.length; i++){

            let una =  addTime(start,false,30);
            let splitStart = una.split(":");
            let hourStart =   parseInt(splitStart[0]);
            let minuteStart =  parseInt(splitStart[1]);
          
            let huli =  addTime(end,true,30);
            let splitEnd = huli.split(":");
            let minuteEnd = parseInt(splitEnd[1])
            let hourEnd =  parseInt(splitEnd[0])
          

            let baseTime = times[i].split(":");
            let hourBaseTime = parseInt(baseTime[0]);
            let minuteBaseTime = parseInt(baseTime[1]);

            let basenum = "";

            if(minuteBaseTime === 0)
                 basenum = hourBaseTime
            if(hourStart <= hourBaseTime && hourEnd >= hourBaseTime){
                if(hourStart !== hourEnd){
                    if( hourStart == hourBaseTime &&  minuteStart <= minuteBaseTime){
                        setAxis.current.push(times[i])
                    }
                    if(hourEnd == hourBaseTime &&  minuteEnd >= minuteBaseTime){
                        setAxis.current.push(times[i])
                    }
                    else if(hourStart  < hourBaseTime && hourEnd > hourBaseTime ){
                        setAxis.current.push(times[i])
                    }
                }
                else{
                    if( hourStart == hourBaseTime &&  (minuteStart <= minuteBaseTime &&  minuteEnd >= minuteBaseTime)){
                       setAxis.current.push(times[i])
                    }

                }
            }
           
        }

    }
  
}
//ADDING RECORDS IN SELECTED TIMELINE FOR CREATING NEW DATA
const AddRecords = (start, end, timeStart, timeEnd )  =>{
        //selected base start 
        let baseUna =  addTime(start,false,30);
        let splitBaseStart = baseUna.split(":");
        var baseSecondStart = (parseInt(splitBaseStart[0], 10) * 60 * 60) + (parseInt(splitBaseStart[1], 10) * 60) 
        //selected  base end
        let baseHuli =  addTime(end,true,30);
        let splitBaseEnd = baseHuli.split(":");
        var baseSecondEnd = (parseInt(splitBaseEnd[0], 10) * 60 * 60) + (parseInt(splitBaseEnd[1], 10) * 60)

        //Start Time
        var sT = timeStart.split(":");
        var secondsST = (parseInt(sT[0], 10) * 60 * 60) + (parseInt(sT[1], 10) * 60) 

        //End Time
        var eT = timeEnd.split(":");
        var secondsET = (parseInt(eT[0], 10) * 60 * 60) + (parseInt(eT[1], 10) * 60)

        if(baseSecondStart <= secondsST && secondsST <= baseSecondEnd )  
            return 'Add'
        else if(baseSecondStart <= secondsET && secondsET <= baseSecondEnd )
            return 'Add'
        else if(secondsST <= baseSecondStart && secondsET >= baseSecondEnd )
            return 'Add'

 // End of Function---------------------------------------------------------------
}

const timeToSeconds = (time) =>{
    var eT = time.split(":");
    var secondsET = (parseInt(eT[0], 10) * 60 * 60) + (parseInt(eT[1], 10) * 60)
    return secondsET;
}
//GETTING TIME VALUE TO XSCALE
const getInvertValue =(xValue,xScale, base)=> {
   
    var domain = xScale.domain(); 
    var range = xScale.range();
    var rangePoints = d3.range(range[0], range[1], xScale.step());
    var yPos = domain[d3.bisect(rangePoints, xValue)-base];

    return yPos;   
}
//SHOW SELECTED VALUE IN ZOOM TIMELINE
const SelectedValue = async (ftime,ltime) =>{
     let firstTime = new Date(ftime);
     let lastTime = new Date(ltime);

    var selectedSVG = d3.select(svgSelectedRef.current);
    setAxis.current =[]
    setSeletedData.current = []
    //SELECT X AXIS LINE
    //axisLine(firstTime, lastTime, 2)
    //ADD 30 MINUTES
    var strt = moment(firstTime).subtract(30, 'm').toDate();
    var end = moment(lastTime).add(30, 'm').toDate();
    // let strt =  addTime(firstTime,false,30);
    // let end =   addTime(lastTime,true,30);

    //TOOLTIP
    var Tooltip = d3.select("#zoomToolTip")
                    .append("div")
                    .style("opacity", 0)   
                    .attr("class", "tooltip")    
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "2px")
                    .style("border-radius", "5px")
                    .style("padding", "10px")    

    //---------------------------------SELECTED -----------------------------------------------
    //xscales for Selected Timeline
    const xScaleSelected = d3.scaleTime()
                             .domain([strt, end])
                             .range([0+padding, width - padding]);

         xScaleSelectedGlobal.current = xScaleSelected;

     //yscales for Selected Timeline
    const yScaleSelected = d3.scaleLinear()
                             .domain([0,0]) 
                             .range([0, 50])

     //Showing hour in X Axis BaseLine
    const xAxisSelected =  d3.axisBottom(xScaleSelected)
                            .tickFormat(d => d3.timeFormat("%H:%M")(d))
                            .ticks(d3.timeMinute.every(1));;

    //-------------------------------------END SELECTED -------------------------------------------------
  
    //SETTING START AND END TIME
    setLastTime(lastTime)
    setFirstTime(firstTime)

    console.log(lastTime, firstTime)

    const hr = firstTime.getHours();
    const mn = firstTime.getMinutes();
    const tm = hr + ":" + mn
    const hrE = lastTime.getHours();
    const mnE = lastTime.getMinutes();
    const tmLT = hrE + ":" + mnE

    //SORT RECORDS TO ASCENDING TIME
    sortSelectedTimeline(setSeletedData.current) 
    //GET LENGTH
    const Length = setSeletedData.current.length
    
    //---------LEGEND AXIS FOR SELECTED TIME------------------------------------------------------------------------
    selectedSVG.select('.axisSelected')
                .style("transform","translate(0,25%)")
                .call(xAxisSelected);

    selectedSVG.select(".axisSelected  path")
                .attr("stroke","transparent");
               
    selectedSVG.select('.axisSelected')
                .selectAll('.tick')
                .attr('font-size', "5px")
                .select("line")
                .attr('y2',function(d) {
                        if(d){
                            const dt = new Date(d);
                            const hour = dt.getHours();
                            const mins = dt.getMinutes();
                            const times = hour + ":" + mins
                        
                            if(tm === times)
                                return 0;
                            if(tmLT === times)
                                return 0;
                            return 2;
                        }
                    })
                .attr('x',function (d) { if(d) return xScaleSelected(d);})        
                .attr('opacity',function(d) {
                    if(d){
                        const dt = new Date(d);
                        const hour = dt.getHours();
                        const mins = dt.getMinutes();
                        const times = hour + ":" + mins
                        if(mins === 0)
                           return 1
                        if(tm === times)
                          return 1;
                        if(tmLT === times)
                          return 1;
                        return 0;
                    }          
                })
                .attr('stroke', 'black')
                .attr("stroke-width", '.4px')
                .attr("stroke-height", "1px"); 

    selectedSVG.select('.axisSelected')
                .selectAll('.tick').select("text")
                .attr('text',function(d) {
                            if(d) 
                                return d;
                       
                    })
                    .text(function(d) {
                        if(d){
                            const dt = new Date(d);
                            const hour = dt.getHours();
                            const mins = dt.getMinutes();
                            const times = hour + ":" + mins
                            if(mins === 0)
                               return hour +"h"
                            if(tm === times)
                              return times;
                            if(tmLT === times)
                              return times;

                            return "";
                        }          
                    })
                .attr('y',function(d) {
                            if(d){
                                const dt = new Date(d);
                            const hour = dt.getHours();
                            const mins = dt.getMinutes();
                            const times = hour + ":" + mins
                            if(mins === 0)
                               return 10;
                            if(tm === times)
                              return 5;
                            if(tmLT === times)
                              return 5;

                            return 0;
                            }       
                     })
                .attr("dy", "0")
                .attr("x", "0")
                .attr("class",function(d) {
                            if(d){
                                if(firstTime === d)
                                    return "timeFont"
                                else if(lastTime === d)
                                    return "timeFont"
                                else
                                    return ""
                                }       
                    });

    //SWOWING SELECTED TIMELINE ON GRAPH--------------------------------------------------------------------
    selectedSVG.select("g")
                .selectAll("bar")
                .data(finalDowntimeEntry)
                .enter()
                .append("line")
                .attr("class", "toRemove") 
                .style("fill", (d) => changeColorLabel(d))
                .attr('stroke',(d) => changeColorLabel(d)) 
                .attr("stroke-width", 30) 
                .attr("transform",`translate(0,5)`)
                // x1 position of the start of the line
                .attr("x1", function (d,i) { 
                        
                                return xScaleSelected(new Date(d.StartTime)); 
  
                    })      
                //x2 position of the end of the line
                .attr("x2",  function (d,i) {
                    return xScaleSelected(new Date(d.EndTime)); 
                    })
                .attr("y1",  function (d) {if(d) return yScaleSelected(0); })
                .attr("y2",  function (d) { if(d) return yScaleSelected(30); })
                .on('click', function(s, d){
                    selectedSVG.select(".brush").attr("display","block")   
                    })   
                .on("mouseover", function(d) {
                    Tooltip.style("opacity", 1);
                    d3.select(this)
                      .style("opacity", .5)
                })
                .on("mousemove", function(d) {
                    let x = xScaleSelected(d.target.__data__.start);
                    Tooltip.html("<div className='alignLeft '><b>Reason:</b> " + d.target.__data__.StopReason + "</br>"
                            + "<b>Start/Stop:</b> " + d.target.__data__.start + " - " + d.target.__data__.end + "</br>"
                            +"<b>Duration:</b> " + d.target.__data__.Duration +" min(s) </div>")
                            .style("left", (x * 2.5) +30 + "px")
                            .style("bottom", "37%");
                })
                .on("mouseleave", function(d) {
                        Tooltip.style("opacity", 0)
                        d3.select(this)
                          .style("opacity", 1)
                }) 
                .append("text")
                .attr("text",  function (d) { if(d) return d.start})
     
                zoomSlider(firstTime,lastTime)                           
}
//Zoom Slider
const zoomSlider = (firstTime,lastTime)=>{
    var selectedSVG = d3.select(svgSelectedRef.current);
    let start =  xScaleSelectedGlobal.current(firstTime);
    let end =  xScaleSelectedGlobal.current(new Date(lastTime));
    const brushmoved = (d) => {
    }
    var brushSelected = d3.brushX().extent([[min,35],[maxSelected,65]]).on('start brush end',brushmoved)
    selectedSVG.select(".selected")
               .call(brushSelected)
               .call(brushSelected.move,[start,end])

    if(!enableBtn.current){
        selectedSVG.select('.overlay').attr("pointer-events","none")
        selectedSVG.select('.selected').attr("pointer-events","none")
    }else{
        selectedSVG.select('.overlay').attr("pointer-events","all")
        selectedSVG.select('.selected').attr("pointer-events","all")
    }

 
    selectedSVG.select(".selection")
               .on("mouseout", function(d) {
                        d.stopPropagation()
                        if(enableBtn.current){
                            setAxis.current =[]
                            setSeletedData.current = []         
                            let x1=  selectedSVG.select('.handle--w').attr("x");
                            let x2 = selectedSVG.select('.handle--e').attr("x");
                            const ft =  xScaleSelectedGlobal.current.invert(parseInt(x1) + 3);
                            const lt =  xScaleSelectedGlobal.current.invert(parseInt(x2)+ 2.5);
                            setTime.current = {firstTime:ft, lastTime:lt}
                            setLastTime(lt)
                            setFirstTime(ft);
                            changeSelectedTime(ft,lt, 1);
                        }
                    }) 
}
//Zoom Main Slider
const mainSlider = (firstTime,lastTime)=>{
    let mainSVG = d3.select(svgRef.current);
    let start =  xScaleGlobal.current(firstTime);
    let end =  xScaleGlobal.current(lastTime);
    var brushX = d3.brushX().extent([[min,recY],[maxSelected,32]]);
    mainSVG.select(".main")     
           .attr("width",50)
           .call(brushX)
           .call(brushX.move,[start,end])
}
//MAIN METHOD FOR SELECTED TIMELINE
const ShowSelectedTime = async(firstTime,lastTime) =>{

    d3.select(".axisSelected")
      .selectAll(".toRemove")
      .remove();

    d3.select(".axisSelected")
      .selectAll(".toRemove")
      .remove();

    d3.select(".selectedContainer")
      .remove();
    uniqueRecord(setSeletedData.current);
    await SelectedValue(firstTime,lastTime)
   
}
//SORTING ASCENDING TIMELINE DATA
const sortSelectedTimeline = async(example) =>{

    example.sort(function (a, b)
        {
            var timeA = a.start;
            var timeB = b.start;
            var hoursA = parseInt(timeA.split(':')[0]);
            var minutesA = parseInt(timeA.split(':')[1]);

            var hoursB = parseInt(timeB.split(':')[0]);
            var minutesB = parseInt(timeB.split(':')[1]);
            // compare hours first
            if (hoursA < hoursB) return -1;
            if (hoursA > hoursB) return 1;
    
            // else a.hour === b.hour, so compare minutes to break the tie
            if (minutesA < minutesB) return -1;
            if (minutesA > minutesB) return 1;
    
            // couldn't break the tie
            return 0;
    });
}
//PUSHING UNIQUE RECORDS
const uniqueRecord = (data)=>{
    const result = [];
    const map = new Map();
    for (const item of data) {
        if(!map.has(item.StopReason)){
            map.set(item.StopReason, true);    // set any value to Map
            result.push(item);
        }
    }
}
//SHOW MAIN TIMELINE
const showTimeLine =() =>{
    let mainSVG = d3.select(svgRef.current);
   
    //GETTING SHIFT HOUR TIMELINE------------------------------------------------------------------
    const una = "2019-03-31 1:00";
    const huli = "2019-03-31 2:00";
    let mainSTime = una.slice(11,16);  
    let MainETime = huli.slice(11,16);
    let st  = mainSTime.split(":");
    let et  = MainETime.split(":");
    let finishHour = parseInt(et[0]);
    let startHour = parseInt(st[0]);
    shiftStart.current = mainSTime;
    shiftEnd.current = MainETime;
  //  axisLine(startHour,finishHour , 1);
    //TOOLTIP FOR MAIN TIMELINE-----------------------------------------------------------------
    var Tooltip = d3.select("#mainToolTip")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "2px")
                    .style("border-radius", "5px")
                    .style("padding", "10px");

    //xscales----------------------------------------------------------------------------------
    const xScale = d3.scaleTime()
                     .domain([new Date("2019-03-31 00:00:00"), new Date("2019-03-31 10:00:00")])
                     .range([0+padding, width - padding]);

    max = xScale(MainETime);
    //SET xScale MAIN TO GLOBAL VARIABLE-------------------------------------------------------
    xScaleGlobal.current =  xScale ;

    //yscales---------------------------------------------------------------------------------
    const yScale = d3.scaleLinear()
                     .domain([0,0])
                     .range([0, 30])

    //SHOW X AXIS IN BASELINE----------------------------------------------------------------
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d => d3.timeFormat("%H:%M")(d))
                    .ticks(d3.timeMinute.every(1));

 

//ADDING IDLE FOR NO RECORDS
    for(var i = 0; i< record.length; i++){
        let startTime = record[i].StartTime.slice(11,16);  
        var sT = startTime.split(":");
        let endTime = record[i].EndTime.slice(11,16);
        var eH = endTime.split(":");
        if(i===0){
            if(record[0].StartTime.slice(11,16) !== mainSTime){
                downtimeEntry.push({'StopReason':'Running','Description':'Running',"StartTime" : "2019-03-31 " + mainSTime ,"EndTime": record[i].StartTime, "start": returnTime(mainSTime,0) , "end" : returnTime(record[0].StartTime.slice(11,16),0), "Duration": "Running" });           
            }
        }

        //ADDING DATA BETWEEN TWO RECORDS  
        if(i > 0){
            let prevEndTime = record[i - 1].EndTime.slice(11,16);
            var eT = prevEndTime.split(":");
            var secondsST = (parseInt(sT[0], 10) * 60 * 60) + (parseInt(sT[1], 10) * 60)   
            var secondsET = (parseInt(eT[0], 10) * 60 * 60) + (parseInt(eT[1], 10) * 60) 
           if(secondsST !== secondsET){
                downtimeEntry.push({'StopReason':'Running','Description':'Running',"StartTime" :  record[i - 1].EndTime ,"EndTime": record[i].StartTime, "start": returnTime(prevEndTime,0) , "end" : returnTime(startTime,0), "Duration": "Running" }); 
           }
        }

        //EXIT IF LAPSE THE FINISH SHIFT
        if(finishHour === parseInt(st[0]) || finishHour === parseInt(eH[0]) ){
            downtimeEntry.push({...record[i], "start": finishHour === parseInt(st[0]) ?  returnTime(finishHour +":00",0)  : returnTime(startTime,0) , "end" : returnTime(finishHour +":00",0)});
            break;
        }

         downtimeEntry.push({...record[i], "start": returnTime(startTime,0), "end" : returnTime(endTime,0)});

        //ADD LAST RECORDS IF SHIFT TIME REACH OR NOT
        if(i ===  record.length - 1){
          let endHour = finishHour + ":00"
          if(record[record.length - 1].EndTime.slice(11,16) !== endHour){              
            downtimeEntry.push({'StopReason':'Running','Description':'Undone',"StartTime" :  record[i].EndTime ,"EndTime":record[0].StartTime, "start": returnTime(endTime,0), "end" :  returnTime(endHour,0),"Duration": "Undone" });
          }
        }
    }
// IF NO RECORDS FOUND IN DATA -------------------------------------------------------------------------
    if(record.length < 1){
        downtimeEntry.push({'StopReason':'Running','Description':'Running',"StartTime" : startHour + ":00" ,"EndTime": finishHour + ":59", "start": returnTime(startHour + ":00",0), "end" :  returnTime(finishHour +":59",0) ,"Duration": "Running"});
    }
// FOR Shift HOUR DATA CUT AND PROCEED TO ZERO ----------------------------------------------------------------
    for(var t = 0; t < downtimeEntry.length ;t++){

        let EndTime = downtimeEntry[t].end.split(":");
        let StartTime = downtimeEntry[t].start.split(":");    
        let minutoEnd = parseInt(EndTime[1])    
        let minutoStart = parseInt(StartTime[1])
        let hourEnd = parseInt(EndTime[0] == 0 ? 0 : EndTime[0] )
        let hourStart = parseInt(StartTime[0] == 0 ? 0 : StartTime[0] )  

        finalDowntimeEntry.push(downtimeEntry[t]);

        var secondsST = (hourStart * 60 * 60) + (minutoStart * 60) 
        var secondsET = (hourEnd * 60 * 60) + (minutoEnd  * 60) 
        if(secondsST > secondsET ){
            let diff = Math.abs(finishHour - hourStart)
            let start = hourStart + ":" + minutoStart
            let endmin =  hourEnd +":" + minutoEnd;
           
            downtimeEntry[t].end = finishHour === 24 ?  (diff > 0 ? diff + hourStart : hourStart ) + ":59" : (diff > 0 ? diff + hourStart : hourStart ) + ":00" 
            downtimeEntry[t].start = returnTime(start,0)
               
            finalDowntimeEntry.push({...downtimeEntry[t], "start": startHour  + ":00" , "end" :  returnTime(endmin,0)});
        }
        
    }
    sortSelectedTimeline(finalDowntimeEntry);
//LEGEND AXIS-------------------------------------------------------------------------------------
    mainSVG.append('g')
            .attr('class', 'axis')
            .attr("stroke","transparent")
            .call(xAxis);

    mainSVG.selectAll("g")
            .select('.domain')
            .attr("stroke","transparent");

    mainSVG.select('.axis')
            .selectAll('.tick')
            .attr('font-size', "5px")
            .select("line") 
            .attr('x',function (d) { if(d)  return  xScale(d);}) 
            .attr('y2', 2)       
            .attr('opacity',function(d) {
                        if(d){
                            const dt = new Date(d);
                            const hour = dt.getHours();
                            const mins = dt.getMinutes();
                            const times = hour + ":" + mins
                           // console.log(times);
                            // var val = d.split(":")
                             if(mins === 0)
                               return 1
                             else
                                return 0;
                        }          
                    })
            .attr('stroke', 'black')
            .attr("stroke-width", '.4px')
            .attr("stroke-height", "1px"); 

    mainSVG.select('.axis')
            .selectAll('.tick')
            .select("text")
            .attr('opacity',function(d) {
                if(d){
                    const dt = new Date(d);
                    const hour = dt.getHours();
                    const mins = dt.getMinutes();
                    const times = hour + ":" + mins
                   // console.log(times);
                    // var val = d.split(":")
                     if(mins === 0)
                       return 1
                     else
                        return 0;
                }          
            })
            .attr("dy", "-2")
            .attr("x", "0")
            .text(function(d) {
                if(d){
                    const dt = new Date(d);
                    const hour = dt.getHours();
                    const mins = dt.getMinutes();
                    const times = hour + ":" + mins
                   // console.log(times);
                    // var val = d.split(":")
                     if(mins === 0)
                       return hour +"h"
                     else
                        return "";
                }          
            })
            .attr('text',function(d) {return  d !== undefined ? d : ""; });
                
//  Showing data trough Lines-------------------------------------------------------------------------------
    mainSVG.append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    mainSVG.selectAll("bar")
            .data(finalDowntimeEntry)
            .enter()
            .append("line")
            .attr("class","dline")
            .style("fill", (d) => changeColorLabel(d))
            .attr('stroke',(d) => changeColorLabel(d)) 
            .attr("stroke-width", 20) 
            .attr("transform",`translate(0,7)`)
            .attr("x1",  function (d) { if(d){ return xScale(new Date(d.StartTime)); }})     // x position of the first end of the line
            .attr("y1",  function (d) { if(d) return yScale(0); })      // y position of the first end of the line
            .attr("x2",  function (d) { if(d) return xScale(new Date(d.EndTime)) })     // x position of the second end of the line
            .attr("y2",  function (d) { if(d) return yScale(30); })
            .on('click', function(s, d){ mainSVG.select(".brush").attr("display","block")  })   
            .on("mouseover", function(d) {
                        Tooltip.style("opacity", 1)
                        d3.select(this)
                        .style("opacity", .5)
                    })
            .on("mousemove", function(d) {
                    let x = xScale(d.target.__data__.start);
                    Tooltip
                    .html("<div className='alignLeft'><b>Reason:</b> " + d.target.__data__.StopReason + "</br>"
                     + "<b>Start/Stop:</b> " + d.target.__data__.start + " - " + d.target.__data__.end + "</br>"
                     + "<b>Duration:</b> " + d.target.__data__.Duration + " min(s) </div>")
                    .style("left", (x * 2.5) +30 + "px")
                    .style("top", "190px");  
                })
            .on("mouseleave", function(d) {
                            Tooltip.style("opacity", 0)
                            d3.select(this)
                            .style("opacity", 1)
                }) 
// CALL BRUSH on RECTANGLE-------------------------------------------------------------------------------------------------------                            

    //Brush
    mainSVG.insert('g', '#last + *')
            .attr("class","brush main") 
            .attr("width",50);
    mainSlider(new Date(una),new Date(huli));
    mainSVG.select('.main').select('.overlay').attr("pointer-events","none") 
    mainSVG.selectAll(".dline").on("click", function() {
        //mainSVG.select('.main').style("display","block")
         mainSVG.select('.main').select('.overlay').attr("pointer-events","all")
    });
    mainSVG.select(".selection").on("click", function() { 
        mainSVG.select('.main').select('.overlay').attr("pointer-events","none") 
    });
    mainSVG.select(".selection").on("mouseout", function() {
            let x1=  mainSVG.select(".handle--w").attr("x");
            let x2 = mainSVG.select(".handle--e").attr("x");            
            let ft =  xScale.invert(parseInt(x1) < 20 ? 20 : parseInt(x1) + 3);
            let lt =  xScale.invert(parseInt(x2)+  3);
            let aFT = "";
            let aET ="";



        if(!enableBtn.current){      
            //-----------------------------------------------------------------
            for(var i = 0; i < finalDowntimeEntry.length; i++){
                var StopReason =  finalDowntimeEntry[i].StopReason; 
                var dateStart = new Date(finalDowntimeEntry[i].StartTime);
                var dateEnd = new Date(finalDowntimeEntry[i].EndTime);
                var ftStart = new Date(ft);
                var secondStart = dateStart.getTime() / 1000;
                var secondEnd = dateEnd.getTime() / 1000;
                var secondFT = ftStart.getTime() / 1000;
                
                if(secondFT > secondStart && secondFT < secondEnd ){
                    if(StopReason !== "Running"){
                        aFT = finalDowntimeEntry[i].StartTime;
                        break;   
                    }
                }
            }

            for(var i = 0; i < finalDowntimeEntry.length; i++){
                var StopReason =  finalDowntimeEntry[i].StopReason; 
                var dateStart = new Date(finalDowntimeEntry[i].StartTime);
                var dateEnd = new Date(finalDowntimeEntry[i].EndTime);
                var ltEnd = new Date(lt);
                var secondStart = dateStart.getTime() / 1000;
                var secondEnd = dateEnd.getTime() / 1000;
                var secondLT = ltEnd.getTime() / 1000;
                if(secondLT >= secondStart && secondEnd >= secondLT ){
                    if(StopReason !== "Running"){
                        aET = finalDowntimeEntry[i].EndTime;
                        break;  
                    } 
                }
            }
          
            if(!aET && aFT ){
                let mainx1 = xScale(new Date(aFT));
                mainSVG.select('.handle--w').attr("x", mainx1 + 2.5);
                let xw =  mainSVG.select(".handle--w").attr("x");
                let xe = mainSVG.select(".handle--e").attr("x");
                mainSVG.select('.selection').attr("x", parseInt(xw) + 2.5);
                mainSVG.select('.selection').attr("width", xe - xw);
                ft = aFT;
            }
            else if(aET && !aFT){
                let mainx2 = xScale(new Date(aET));
                mainSVG.select('.handle--e').attr("x", mainx2 + 2.5);
                let xw =  mainSVG.select(".handle--w").attr("x");
                let xe = mainSVG.select(".handle--e").attr("x");
                mainSVG.select('.selection').attr("x", parseInt(xw) + 2.5);
                mainSVG.select('.selection').attr("width", xe - xw);
                lt = aET;
            }
            else if(aET && aFT){
                let mainx2 = xScale(new Date(aET))
                mainSVG.select('.handle--e').attr("x", mainx2);
                let mainx1 = xScale(new Date(aFT))
                mainSVG.select('.handle--w').attr("x", mainx1);
                let xw =  mainSVG.select(".handle--w").attr("x");
                let xe = mainSVG.select(".handle--e").attr("x");
                mainSVG.select('.selection').attr("x", parseInt(xw) + 2.5);
                mainSVG.select('.selection').attr("width", xe - xw);
                lt = aET;
                ft = aFT;
            }
            //----------------------------------------------------------------
        }
            const StartHour = new Date(ft);
            const FinishHour = new Date(lt);
            setTime.current = {firstTime:StartHour, lastTime:FinishHour}                 
            setLastTime(FinishHour)
            setFirstTime(StartHour)
            ShowSelectedTime(StartHour,FinishHour);
            mainSlider(StartHour, FinishHour);
        })
        let selectedSVG = d3.select(svgSelectedRef.current);
        selectedSVG.insert('g', '#last + *')
                .attr("class","brush selected") 
                .attr("width",50);
}

useEffect( ()=>{
    showTimeLine(); 
},[])

return(
<div>
    <svg id="chart" ref={svgRef} viewBox='0 0 500 40'>
    </svg>
    <div className='selectionTime'>
        <div className='row justify-content-md-center'>

            <div className='col-md-4 '>   
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardTimePicker
                                             // disableToolbar
                                              //inputVariant="outlined"
                                              format="HH:mm"
                                              margin="normal"
                                              id="firstTime"
                                              label="Start Time"
                                              //onBlur={a => changeSelectedTime(null,null,1)}
                                              value={firstTime || null}
                                              onChange= {(value) => handleChange(value, 1)}
                                              KeyboardButtonProps = {{
                                                'aria-label': 'change time',
                                              }}
                                              disabled = {isDisable}
                                            />
                                        </MuiPickersUtilsProvider>   
            </div>
            <div className='col-md-4'><div className='centerDiv'><button id="btnCustom" className='btn btn-info btnInfo'onClick={enableCustomizeTime} >Customize Time</button></div></div>
            <div className='col-md-4'>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            // disableToolbar
                            format="HH:mm"
                            // inputVariant="outlined"
                            margin="normal"
                            id="firstTime"
                            label="End Time"
                            value={lastTime || null}
                           // onBlur={a => changeSelectedTime(null,null,1)}
                            onChange= {(value) => handleChange(value, 2)}
                            KeyboardButtonProps = {{
                                 'aria-label': 'change time',
                                }}
                            disabled = {isDisable}
                         />
                </MuiPickersUtilsProvider> </div>
            
        </div>
    </div>
    <svg id="chart" ref={svgSelectedRef} viewBox="0 15 508 80">
        <g className='axisSelected'>
        </g>
    </svg>
    <div id="mainToolTip"></div>
    <div id="zoomToolTip"></div>

</div>

)


}


export default DowntimeMain;