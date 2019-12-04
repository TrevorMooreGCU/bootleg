﻿import React, { useEffect, useState } from "react";
import {
	Typography,
	TextField,
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	FormLabel,
	RadioGroup,
	Radio,
	FormControlLabel
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import useRequest from "../hooks/useRequest";
import { useParams } from "react-router-dom";
import config from "../config.json";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles(theme => ({
	form: {
		width: 500,
		marginTop: theme.spacing(2)
	},
	submit: {
		marginTop: theme.spacing(2)
	},
	formControl: {
		marginTop: theme.spacing(2)
	}
}));

export default function Register() {
	const classes = useStyles();
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [children, setChildren] = useState(0);
	const [errors, setErrors] = useState([]);
	const { get, post } = useRequest();
	const [event, setUser] = useState({});
	const { id } = useParams();
	const [successOpen, setSuccessOpen] = useState(false);
	const [failureOpen, setFailureOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [participantType, setParticipantType] = useState("1");

	useEffect(() => {
		async function getUser() {
			let response = await get(config.GET_EVENT_GET_URL, { eventID: id });
			if (response.success) {
				setUser(response.data[0]);
			} else {
				setErrors(response.errors);
			}
		}
		getUser();

		return () => { };
	}, []);

	const handleEmailChange = e => {
		setEmail(e.target.value);
	};

	const handleNameChange = e => {
		setName(e.target.value);
	};

	const handleChildrenChange = (e, v) => {
		setChildren(v);
	};

	const handleSubmit = async () => {
		setErrors([]);
		setSubmitting(true);
		const response = await post(config.ADD_EMAIL_POST_URL, {
			UserId: id,
			Data: {
				Email: email,
				Name: name,
				Children: children,
				Type: parseInt(participantType, 10),
				DateEntered: new Date()
			}
		});
		if (response.success) {
			setSuccessOpen(true);
			setEmail("");
			setName("");
			setChildren(0);
			setParticipantType("1");
		} else {
			setErrors(response.errors);
			setFailureOpen(true);
		}
		setSubmitting(false);
	};

	const handleSuccessClose = () => {
		setSuccessOpen(false);
	};

	const handleFailureClose = () => {
		setFailureOpen(false);
	};

	const handleParticipantTypeChange = e => {
		setParticipantType(e.target.value);
	};

	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
		>
			<Typography variant="h4" gutterBottom>
				{event.title} Sign Up
      </Typography>
			<Box display="flex" flexDirection="column" className={classes.form}>
				{Boolean(errors["*"]) && (
					<Typography color="error">{errors["*"]}</Typography>
				)}
				<TextField
					autoFocus
					label="Email Address *"
					className={classes.textField}
					value={email}
					onChange={handleEmailChange}
					margin="normal"
					variant="outlined"
					error={Boolean(errors["Data.Email"])}
					helperText={errors["Data.Email"]}
				/>
				<TextField
					label="Name *"
					className={classes.textField}
					value={name}
					onChange={handleNameChange}
					margin="normal"
					variant="outlined"
					error={Boolean(errors["Data.Name"])}
					helperText={errors["Data.Name"]}
				/>
				<br />
				<FormLabel component="legend">
					Have Any Kids?
        </FormLabel>
				<Slider
					defaultValue={0}
					value={children}
					onChange={handleChildrenChange}
					aria-labelledby="discrete-slider"
					valueLabelDisplay="auto"
					step={1}
					marks
					min={0}
					max={20}
				/>
				<FormControl component="fieldset" className={classes.formControl}>
					<FormLabel
						component="legend"
						error={Boolean(errors["Data.Type"])}
						helperText={errors["Data.Type"]}
					>
						Who are you?
          </FormLabel>
					<RadioGroup
						aria-label="gender"
						name="gender1"
						value={participantType}
						onChange={handleParticipantTypeChange}
					>
						<FormControlLabel value={"1"} control={<Radio />} label="Attendee" />
						<FormControlLabel value={"0"} control={<Radio />} label="Volunteer" />
						<FormControlLabel value={"2"} control={<Radio />} label="Donor" />
						<FormControlLabel value={"3"} control={<Radio />} label="Other" />
					</RadioGroup>
				</FormControl>
				<Button
					color="primary"
					variant="contained"
					className={classes.submit}
					onClick={handleSubmit}
					disabled={submitting}
				>
					Submit
        </Button>
			</Box>

			<Dialog
				onClose={handleSuccessClose}
				open={successOpen}
				fullWidth
				PaperProps={{ style: { maxWidth: 400 } }}
			>
				<DialogTitle align="center">
					<Avatar style={{ backgroundColor: "#00cc00" }}>
						<CheckIcon fontSize="large" />
					</Avatar>
					Thank you :)
        </DialogTitle>
				<DialogContent align="center"></DialogContent>
				<DialogActions>
					<Button onClick={handleSuccessClose} variant="contained">
						Close
          </Button>
				</DialogActions>
			</Dialog>
			<Dialog
				onClose={handleFailureClose}
				open={failureOpen}
				fullWidth
				PaperProps={{ style: { maxWidth: 400 } }}
			>
				<DialogTitle align="center">
					<Avatar style={{ backgroundColor: "#ff0000" }}>
						<CloseIcon fontSize="large" />
					</Avatar>
					Failure: {errors["*"]}
				</DialogTitle>
				<DialogContent align="center"></DialogContent>
				<DialogActions>
					<Button onClick={handleFailureClose} variant="contained">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}