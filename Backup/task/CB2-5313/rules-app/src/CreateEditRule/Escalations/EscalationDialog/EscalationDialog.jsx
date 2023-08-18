import React, { useEffect, useState } from "react";
import { eventService } from "client-app-core";

//Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui

import { List, ListItem, Button, CircularProgress, Dialog, ListItemText, DialogActions } from "@mui/material";
import {useStyles} from "../../../shared/styles/overrides";

// misc
import _ from "lodash";

//virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { Translate, getTranslation } from "orion-components/i18n";

const EscalationDialog = ({ addEscalation, closeDialog, isOpen }) => {
	const classes = useStyles();

	const [loadingEvents, setLoadingEvents] = useState(false);
	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState([]);
	const [searchText, setSearchText] = useState("");

	// Enter to submit
	const _handleKeyDown = (event) => {
		if (event.key === "Enter" && isOpen) {
			handleSaveClick();
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", _handleKeyDown);
		eventService.getAllTemplates((err, result) => {
			if (result) {
				setEvents(result);
				setLoadingEvents(true);
			} else {
				console.log(err);
			}
		});
		return () => {
			document.removeEventListener("keydown", _handleKeyDown);
		};
	}, []);

	const handleSaveClick = () => {
		addEscalation(selectedEvent);
		setSelectedEvent({});
		setSearchText("");
		closeDialog();
	};

	const handleCancelClick = () => {
		setSelectedEvent({});
		setSearchText("");
		closeDialog();
	};

	const handleSelect = (event) => {
		setSelectedEvent(event);
	};

	const handleTextChange = (event) => {
		setSearchText(event.target.value);
	};

	const eraseInputValue = () => {
		setSearchText("");
	};

	const isMobile = window.matchMedia("(max-width: 600px)").matches;

	const buttonStyles = isMobile
		? {
			fontSize: "13px"
		}
		: {};

	const isQuerying = arr => {
		for (const key in arr) {
			if (arr.hasOwnProperty(key))
				return false;
		}
		return true;
	};

	const hasEvents = arr => {
		if (arr.length > 0) {
			return true;
		}
		return false;
	};

	const userEvents = events;

	const sortArr = (arr) => {
		return arr.sort((a, b) => {
			const aName = a.name.toLowerCase();
			const bName = b.name.toLowerCase();
			if (aName < bName)
				return -1;
			if (aName > bName)
				return 1;
			return 0;
		});
	};

	const escalationsAddActions = [
		<Button
			className="themedButton"
			style={buttonStyles}
			variant="text"
			onClick={handleCancelClick}
		>
			{getTranslation("createEditRule.escalations.escalationDialog.cancel")}
		</Button>,
		<Button
			className="themedButton"
			style={buttonStyles}
			variant="text"
			onClick={() => handleSaveClick()}
		>
			{getTranslation("createEditRule.escalations.escalationDialog.add")}
		</Button>
	];

	const escalationCancelActions = [
		<Button
			className="themedButton"
			style={buttonStyles}
			variant="text"
			onClick={handleCancelClick}
		// primary={true}
		>
			{getTranslation("createEditRule.escalations.escalationDialog.cancel")}
		</Button>
	];

	const searchedEvents = userEvents.filter(event => {
		return searchText === "" || _.includes(event.name.toLowerCase(), searchText.toLowerCase());
	});

	let renderedEvents;

	if (!isQuerying(userEvents)) {
		sortArr(searchedEvents);
		renderedEvents = searchedEvents.map((event) => {
			return (
				<ListItem
					key={event.id}
					onClick={() => handleSelect(event)}
					className={`${selectedEvent.id === event.id ? "selected" : "unselected"}`}
					style={{ backgroundColor: "#41454A" }}
				>
					<ListItemText
						primary={event.name}
						primaryTypographyProps={{ style: { fontSize: 16, lineHeight: "unset", padding: "16px" } }}
						sx={{ margin: "0px" }}
					/>
				</ListItem>
			);
		});
	}

	const targetRowRenderer = ({
		key,
		index,
		style
	}) => {
		return (
			<div key={key} style={style}>
				{renderedEvents[index]}
			</div>
		);
	};

	const overrides = {
		paperProps: {
			width: "100%",
			borderRadius: "2px"
		},
		list: {
			padding: "25px"
		}
	};

	return (
		<React.Fragment>
			<Dialog
				PaperProps={{ className: "rule-dialog", sx: overrides.paperProps }}
				open={isOpen}
				onClose={handleCancelClick}
				classes={{ scrollPaper: classes.scrollPaper }}
			>
				{!loadingEvents
					? <div className="circular-progress" style={{ color: "rgb(0, 188, 212)" }}>
						<CircularProgress size={60} thickness={5} color="inherit" />
					</div>
					: hasEvents(userEvents) ?
						<List
							className='rule-attributes-list'
							sx={overrides.list}
						>
							<React.Fragment>
								<ErrorBoundary>
									<div className="typeAhead">
										<input
											className="typeAheadFilter"
											type="text"
											placeholder={getTranslation("createEditRule.escalations.escalationDialog.wantToFind")}
											onChange={handleTextChange}
											value={searchText}
										/>
										{searchText ?
											<button onClick={eraseInputValue}>
												<i className="material-icons">cancel</i>
											</button>
											:
											<i className="material-icons">search</i>
										}
									</div>
								</ErrorBoundary>
								<AutoSizer disableHeight>
									{({ width }) => (
										<VirtList
											rowCount={userEvents.length}
											authoContainerWidth={true}
											rowHeight={68}
											width={width}
											height={700}
											rowRenderer={targetRowRenderer}
											overscanRowCount={1}
										/>
									)}
								</AutoSizer>
							</React.Fragment>
						</List>
						:
						<p><Translate value="createEditRule.escalations.escalationDialog.noEventTemp" /></p>
				}
				<DialogActions>{hasEvents(userEvents) ? escalationsAddActions : escalationCancelActions}</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};

export default EscalationDialog;