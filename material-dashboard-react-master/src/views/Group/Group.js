import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Table from "components/Table/Table.js";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from "react-router-dom";
import { UserContext } from "../../UserContext";
import GroupMember from "views/Group/GroupMember.js"
import NewGroup from "views/Group/NewGroup.js"
import GroupDetails from "views/Group/GroupDetails.js"
import { cdCurrent, cdDefault, hasGroup, getUserBalance} from "views/functions.js"
import {BlankArea, NothingToDisplay, DisplayBalance} from "CustomComponents/CustomComponents.js"
import green from '@material-ui/core/colors/green';
import {setTab} from "CustomComponents/CricDreamTabs.js"
const rPrefix = "radio-";

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    symbolText: {
        color: '#4CC417',
        // backgroundColor: green[700],
    },
    button: {
        margin: theme.spacing(0, 1, 0),
      },
        heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));


export default function Group() {

    // window.onbeforeunload = () => setUser(null)
    // const { setUser } = useContext(UserContext);
    const classes = useStyles();
    const [myGroupTableData, setMyGroupTableData] = useState([]);
    const history = useHistory();
    const [newCurrentGroup, setNewCurrentGroup] = useState(localStorage.getItem("groupName"));
    const [balance, setBalance] = useState(0);

      
    useEffect(() => {
        const a = async () => {
            let myBalance = await getUserBalance();
            setBalance(myBalance);
            // console.log(myBalance); 

            window.localStorage.setItem("groupMember", "");
            var myUrl = `/group/memberof/${localStorage.getItem("uid")}`;
            const teamResponse = await axios.get(myUrl);
            console.log(teamResponse.data[0].groups);
            let setnew = true;
            if (hasGroup()) {
                // just check if current group is part of group list 
                let tmp = teamResponse.data[0].groups.find(x => x.gid == localStorage.getItem("gid"));
                if (tmp) setnew = false;
            }
            console.log(`Set new is ${setnew}`);
            if (setnew) {
                if (teamResponse.data[0].groups.length > 0) {
                    var myGroup = teamResponse.data[0].groups[0];
                    // console.log(myGroup);
                    localStorage.setItem("gid", myGroup.gid.toString());
                    localStorage.setItem("groupName", myGroup.groupName);
                    localStorage.setItem("tournament", myGroup.tournament);
                    localStorage.setItem("admin", false)
                    setNewCurrentGroup(myGroup.name);
                } else {
                    localStorage.setItem("gid", "");
                    localStorage.setItem("groupName", "");
                    localStorage.setItem("tournament", "");
                    localStorage.setItem("admin", false)
                    setNewCurrentGroup("");
                }
            }
            setMyGroupTableData(teamResponse.data[0].groups);
            // console.log(teamResponse.data[0].groups);
            }
        a();
    }, [])


    function handleGroupDetails(grpName) {
        // console.log(`Show group details of ${grpName}`)
        var ggg = myGroupTableData.find(x => x.groupName === grpName);
        window.localStorage.setItem("gdGid", ggg.gid.toString());
        window.localStorage.setItem("gdName", ggg.groupName)
        window.localStorage.setItem("gdDisplay", ggg.displayName)
        window.localStorage.setItem("gdAdmin", ggg.admin);
        window.localStorage.setItem("gdCurrent", (newCurrentGroup === ggg.groupName) ? "true" : "false");
        window.localStorage.setItem("gdDefault", ggg.defaultGroup);
        window.localStorage.setItem("gdTournament", ggg.tournament);
        // history.push(`/admin/groupdetails`);
        setTab(102);
    }

    function handleSelectGroup(grpName) {
        // var myId;
        var myElement;
        myElement = document.getElementById(rPrefix + newCurrentGroup);
        // console.log(myElement);
        myElement.checked = false;
        setNewCurrentGroup(grpName);

        // set this group as default group
        var ggg = myGroupTableData.find(x => x.groupName === grpName);
        window.localStorage.setItem("gid", ggg.gid.toString());
        // var response = await axios.get(`/group/current/` +
        //     `${localStorage.getItem("gid")}/${localStorage.getItem("uid")}`);
        // // SAMPLE OUTPUT
        // // {"uid":"8","gid":2,"displayName":"Salgia Super Stars",
        // // "groupName":"Happy Home Society Grp 2","tournament":"ENGAUST20","ismember":true,"admin":true}
        // // window.localStorage.setItem("uid", myUID)
        window.localStorage.setItem("displayName", ggg.displayName);
        window.localStorage.setItem("groupName", ggg.groupName);
        window.localStorage.setItem("tournament", ggg.tournament);
        window.localStorage.setItem("admin", ggg.admin)
        // setUser({ uid: localStorage.getItem("uid"), admin: ggg.admin })    
    };

    /*
    function ShowGroupMembers() {
        var grpName = localStorage.getItem("groupName");
        var ggg = myGroupTableData.find(x=> x.groupName === grpName);
        console.log(ggg);
        window.localStorage.setItem("gdGid", ggg.gid.toString());
        window.localStorage.setItem("gdName", ggg.groupName)
        window.localStorage.setItem("gdAdmin", ggg.admin);
        // console.log("abou to call /admin/membergroup ")
        //history.push("/admin/membergroup");        
    };

    function EditGroupProfile() {
        console.log("edit profile")
    }   
    
    */

    function handleNewGroup() {
        // history.push("/admin/newgroup");        
        setTab(101);
    };

    function handleJoinGroup() {
        // history.push("/admin/newgroup");        
        setTab(105);
    };


    function  ShowAllGroups() {
        return(
            <Grid key="gr-group" container justify="center" alignItems="center" >
            <GridItem key="gi-group" xs={12} sm={12} md={12} lg={12} >
                <Card key="c-group" profile>
                    <CardBody key="cb-group" profile>
                        <Table
                            tableKey="t-group"
                            id="t-group"
                            tableHeaderColor="warning"
                            tableHead={["Group Name","", "Admin"]}
                            tableData={myGroupTableData.map(x => {
                                var myName = x.groupName;
                                var currentChar = "";
                                if (newCurrentGroup === x.groupName) currentChar = cdCurrent();
                                if (x.defaultGroup) currentChar =  currentChar + cdDefault();
                                // console.log(x);
                                const arr = [
                                    <Link href="#" onClick={() => handleGroupDetails(x.groupName)} variant="body2">
                                    <Typography>{myName}</Typography>
                                    </Link>,
                                    <Typography className={classes.symbolText}>{currentChar}</Typography>,
                                    <Typography>{((x.admin) ? "Admin" : "")}</Typography>
                                    // <Link href="#" onClick={() => handleGroupDetails(x.groupName)} variant="body2">
                                    // Details
                                    // </Link>
                                    // <FormControlLabel 
                                    // key={"fc-"+x.groupName}
                                    // className={classes.groupName} 
                                    // value={x.groupName}    
                                    // control={<Radio color="primary" key={rPrefix+x.groupName} id={rPrefix+x.groupName} defaultChecked={x.groupName === newCurrentGroup}/>}
                                    // onClick={() => handleSelectGroup(x.groupName)}
                                    // />
                                ]
                                return { data: arr, collapse: [] }
                            })}
                        />
                    </CardBody>
                </Card>
            </GridItem>
            </Grid>
        );
    }


    return (
        <div className={classes.root} align="center" key="groupinfo">
            <DisplayBalance balance={balance} />
            <h3 align="center">My Groups</h3>
            <ShowAllGroups/>
            <Button key={"create"} variant="contained" color="primary" size="small"
                className={classes.button} onClick={handleNewGroup}>New Group
            </Button>
            <Button key={"progile"} variant="contained" color="primary" size="small"
               className={classes.button} onClick={handleJoinGroup}>Join Group
            </Button>
        </div>
        );
    
}

