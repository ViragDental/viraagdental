import React, { useEffect, useState, useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment, makeStyles, Container, CssBaseline } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SwitchBtn from '@material-ui/core/Switch';
import globalStyles from "assets/globalStyles";


import Switch from "@material-ui/core/Switch";
//import  from '@material-ui/core/Container';
//import  from '@material-ui/core/CssBaseline';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
// import Table from "components/Table/Table.js";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Radio from '@material-ui/core/Radio';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from "@material-ui/core/Avatar"
// import CardAvatar from "components/Card/CardAvatar.js";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../UserContext";
import { getImageName } from "views/functions.js"
import {DisplayPageHeader, ValidComp, BlankArea, NothingToDisplay, DisplayBalance} from "CustomComponents/CustomComponents.js"
import {red, blue } from '@material-ui/core/colors';
import { LeakRemoveTwoTone, LensTwoTone } from '@material-ui/icons';
// import {setTab} from "CustomComponents/CricDreamTabs.js"

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    }, 
    info: {
        color: blue[700],
    },     
    header: {
			color: '#D84315',
    }, 
    error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
		},
		editdelete: {
			marginLeft:  '50px',
			marginRight: '50px',
			paddings: '20px',
		},
		NoMedicines: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: blue[700]
		},  
		radio: {
			fontSize: theme.typography.pxToRem(20),
			fontWeight: theme.typography.fontWeightBold,
			color: "blue",
		},
		messageText: {
			color: '#4CC417',
			fontSize: 12,
			// backgroundColor: green[700],
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

const COUNTPERPAGE=10;

export default function Medicine() {
  
  const classes = useStyles();
	const gClasses = globalStyles();
	
	const [old, setOld] = useState(true);
	
	// for old medicine
	const [searchText,setSearchText] = useState("")
  const [medicineArray, setMedicineArray] = useState([])
	const [currentMedicine, setCurrentMedicine] = useState("");
	
	// for new medicine to be added
	// or medicine to be modified
	const	[medicineName, setMedicineName] = useState("");
	const [medicineDescription, setMedicineDescription] = useState("");
	const [medicinePrecaution, setMedicinePrecaution] = useState("");
	
	const [edit, setEdit] = useState(false);
	
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [rowsPerPage, setRowsPerPage] = useState(COUNTPERPAGE);
  const [page, setPage] = useState(0);
	
  useEffect(() => {
      const us = async () => {
				getMedicineList("");	
      }
      us();
  }, [])


  
  
  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
  
	function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = "";
        break;
      case 200:
        myMsg = `Successfully added ${medicineName}`;
        break;
      case 601:
        myMsg = `Error adding ${medicineName}`;
        break;
      case 602:
        myMsg = "Patient Id Invalid / Blank";
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(registerStatus === 200) ? gClasses.nonerror : gClasses.error}>{myMsg}</Typography>
      </div>
    )
  }

	async function getMedicineList(filter) {
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/list/${filter}`)
			//console.log(resp.data);
			setMedicineArray(resp.data);
		} catch (e) {
			console.log("Filter error");
			setMedicineArray([]);
		}
	}
	
	async function selectFilter() {
		//console.log("Filter:", searchText);
		getMedicineList(searchText);
		setCurrentMedicine("");
	}

	async function handleNewSubmit() {
		//console.log("In new submit");
		console.log("Name:", medicineName);
		console.log("Desc:", medicineDescription);
		console.log("pre:", medicinePrecaution);
		axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/add/${medicineName}/${medicineDescription}/${medicinePrecaution}`)
		.then((response) =>{
			//console.log(response.data);
			//let tmp = [].concat(medicineArray);
			//tmp.push(response.data);
			//setMedicineArray(tmp);
			setRegisterStatus(200);
		})
		.catch ( (e) => {
			console.log(e);
			setRegisterStatus(601);
		});
	}
	
	async function handleOldNew() {
		//console.log("Current old", old);
		if (old) {
				setMedicineName("");
				setMedicineDescription("");
				setMedicinePrecaution("");
				setRegisterStatus(0);
				setOld(false);
		} else {
				setCurrentMedicine("");
				getMedicineList("");
				setRegisterStatus(0);
				setOld(true);
		}
	}
	
	async function handleDelete() {
		//console.log("dlete");
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/delete/${currentMedicine}`)
			var newList = medicineArray.filter(x => x.name !== currentMedicine);
			console.log(newList);
			setMedicineArray(newList);
		} catch (e) {
			console.log("Delete error");
		}
		setCurrentMedicine("");
	}
	
	function selectMedicine(medName) {
		setCurrentMedicine(medName);
		var myMed = medicineArray.find( x => x.name == medName);
		//console.log(myMed);
		setMedicineName(myMed.name);
		setMedicineDescription(myMed.description);
		setMedicinePrecaution(myMed.precaution);
		setEdit(false);
	}
	
	async function handleEdit() {
		//console.log("Edit button");
		if (edit) {
			// Update given by user
			try {
				var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/medicine/update/${medicineName}/${medicineDescription}/${medicinePrecaution}`);
				//console.log(resp.data);
				let tmp = medicineArray.find(x => x.name == medicineName);
				tmp.description = medicineDescription;
				tmp.precaution = medicinePrecaution;
			} catch (e) {
				console.log("Update error");
				//setMedicineArray([]);
			}
		} else {
			// Edit given by user. Nothing special to be done
		} 
		setEdit(!edit);
	}
	
	
  return (
  <div className={classes.paper} align="center" key="groupinfo">
      <DisplayPageHeader headerName="Medicines" groupName="" tournament=""/>
      <Container component="main" maxWidth="xs">
      <CssBaseline />
			<BlankArea />
			<FormControlLabel
				className={classes.radio}
        control={
          <SwitchBtn
            checked={!old}
            onChange={handleOldNew}
            color="primary"
          />
        }
        label="New Medicine"
      />
			<BlankArea />
			{ old && <div>
				<TextField
					variant="outlined"
					fullWidth
					label="Search Medicine(s)"
					value={searchText}
					onChange={(event) => setSearchText(event.target.value)}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<SearchIcon onClick={selectFilter}/>
							</InputAdornment>
					)}}
				/>
				<BlankArea/>
				{(medicineArray.length == 0) &&	
					<Typography className={classes.NoMedicines}>No Medicines Selected</Typography>
				}
				{(medicineArray.length > 0) && <div>
					<Select labelId='team' id='team'
						variant="outlined" required fullWidth label="Group" name="team" id="team"
						value={currentMedicine}
						inputProps={{
							name: 'Group',
							id: 'filled-age-native-simple',
						}}
						onChange={(event) => selectMedicine(event.target.value)}
					>
					{medicineArray.map(x =>	<MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
					</Select>
					<BlankArea/>
					{currentMedicine.length > 0 && <div>
						<ValidatorForm className={gClasses.form} onSubmit={handleEdit}>
						<TextValidator variant="outlined" required fullWidth color="primary"
							id="newName" label="Medicine Name" name="newName"
							disabled={true}
							value={medicineName}
						/>
						<BlankArea />
						<TextValidator variant="outlined" required fullWidth color="primary"
							id="newDesc" label="Medicine Description" name="newDesc"
							onChange={(event) => setMedicineDescription(event.target.value)}
							validators={['required', 'noSpecialCharacters']}
							errorMessages={['Medicine Description to be provided', "No Special Characters permitted"]}
							value={medicineDescription}
							disabled={edit == false}
						/>
						<BlankArea />
						<TextValidator variant="outlined" required fullWidth color="primary"
							id="newPrecaution" label="Medicine Precaution" name="newPrecaution"
							onChange={(event) => setMedicinePrecaution(event.target.value)}
							validators={['required', 'noSpecialCharacters']}
							errorMessages={['Medicine Precaution to be provided', "No Special Characters permitted"]}
							value={medicinePrecaution}
							disabled={edit == false}
						/>
						<BlankArea />
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={gClasses.editdelete}
						>
						{edit ? "Update" : "Edit"}
						</Button>
						<Button
							variant="contained"
							color="primary"
							className={gClasses.editdelete}
							onClick={handleDelete}
						>
						Delete
						</Button>
						</ValidatorForm>
					</div>}
				</div>}
			</div>}
			
			{ !old && <div>
				<ValidatorForm className={gClasses.form} onSubmit={handleNewSubmit}>
				<TextValidator variant="outlined" required fullWidth color="primary"
          id="newName" label="Medicine Name" name="newName"
          onChange={(event) => setMedicineName(event.target.value)}
          validators={['required', 'noSpecialCharacters']}
          errorMessages={['Medicine Name to be provided', "No Special Characters permitted"]}
          value={medicineName}
				/>
				<BlankArea />
				<TextValidator variant="outlined" required fullWidth color="primary"
          id="newDesc" label="Medicine Description" name="newDesc"
          onChange={(event) => setMedicineDescription(event.target.value)}
          validators={['required', 'noSpecialCharacters']}
          errorMessages={['Medicine Description to be provided', "No Special Characters permitted"]}
          value={medicineDescription}
				/>
				<BlankArea />
				<TextValidator variant="outlined" fullWidth color="primary"
          id="newPrecaution" label="Medicine Precaution" name="newPrecaution"
          onChange={(event) => setMedicinePrecaution(event.target.value)}
          validators={['noSpecialCharacters']}
          errorMessages={["No Special Characters permitted"]}
          value={medicinePrecaution}
				/>
				<BlankArea />
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={gClasses.submit}
				>
					Add
				</Button>
				</ValidatorForm>
			</div>}
				<ShowResisterStatus/>
        <BlankArea />
				<ValidComp />    			
      </Container>
  </div>
  );    
}

