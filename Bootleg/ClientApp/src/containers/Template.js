import React, { useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Routes from "./Routes";
import Sidebar from "../components/Sidebar";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import useAuth from "../hooks/useAuth";
import Login from "../pages/Login";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

// Define our drawer width:
const drawerWidth = 240;

// Create CSS styles:
const useStyles = makeStyles(theme => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(2),
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		marginLeft: 0
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		}),
		marginLeft: drawerWidth
	},
	toolbar: theme.mixins.toolbar,
	root: {
		padding: theme.spacing(2)
	}
}));

// Template component for rendering the template of our web app, and where main components get rendered within it:
export default function Template() {
	// Create our styles and declare our state properties with the useState Hooks API:
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const { authState, getToken } = useAuth();
	const [value, setValue] = React.useState('home');

	// Method for handling when buttons are clicked on the bottom navigation bar:
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// Get the authorization token from the cookies if its there:
	getToken();

	// Method for handling when the top nav bar is opened:
	const handleDrawerOpen = () => {
		setOpen(true);
	};

	// Method for handling when the sidebar drawer is closed:
	const handleDrawerClose = () => {
		setOpen(false);
	};

	// Render our markup:
	return (
		<>
			{authState.isAuthenticated ? (
				<>
					<NavigationBar
						open={open}
						handleDrawerOpen={handleDrawerOpen}
					/>
					<Sidebar
						open={open}
						handleDrawerClose={handleDrawerClose}
					/>
					<div className={classes.toolbar} />
					<main
						className={clsx(classes.content, {
							[classes.contentShift]: open
						})}
					>
						<div className={classes.root}>
							<Routes />
						</div>
					</main>
					<BottomNavigation value={value} onChange={handleChange}>
						<BottomNavigationAction label="" value="home" icon={<HomeIcon />} />
						<BottomNavigationAction label="" value="search" icon={<SearchIcon />} />
						<BottomNavigationAction label="" value="newpost" icon={<AddCircleOutlineIcon />} />
						<BottomNavigationAction label="" value="messages" icon={<MailIcon />} />
						<BottomNavigationAction label="" value="account" icon={<AccountCircleIcon />} />
					</BottomNavigation>
				</>
			) : (
					<>
						<NavigationBar
							open={false}
							handleDrawerOpen={handleDrawerOpen}
						/>
						<div className={classes.toolbar} />
						<main
							className={clsx(classes.content, {
								[classes.contentShift]: false
							})}
						>
							<div className={classes.root}>
								<Login />
							</div>
						</main>
						<BottomNavigation value={value} onChange={handleChange}>
							<BottomNavigationAction label="" value="home" icon={<HomeIcon />} />
							<BottomNavigationAction label="" value="info" icon={<InfoIcon />} />
						</BottomNavigation>
					</>
				)}
		</>
	);
}