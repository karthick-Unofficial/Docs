import React, { useEffect, useState } from "react";
import { eventService } from "client-app-core";

//Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, { ListItem } from "material-ui/List";
import Dialog from "material-ui/Dialog";
import CircularProgress from "material-ui/CircularProgress";

// misc
import _ from "lodash";

//virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const EscalationDialog = ({ addEscalation, closeDialog, isOpen }) => {
	const [loadingEvents, setLoadingEvents] = useState(false);
	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState([]);
	const [searchText, setSearchText] = useState("");

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

	// Enter to submit
	const _handleKeyDown = (event) => {
		if (event.key === "Enter" && isOpen) {
			handleSaveClick();
		}
	};

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
		<FlatButton
			style={buttonStyles}
			label={getTranslation("createEditRule.escalations.escalationDialog.cancel")}
			onClick={handleCancelClick}
			primary={true}
		/>,
		<FlatButton
			style={buttonStyles}
			label={getTranslation("createEditRule.escalations.escalationDialog.add")}
			onClick={() => handleSaveClick()}
			primary={true}
		/>
	];

	const escalationCancelActions = [
		<FlatButton
			style={buttonStyles}
			label={getTranslation("createEditRule.escalations.escalationDialog.cancel")}
			onClick={handleCancelClick}
			primary={true}
		/>
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
					className={`${selectedEvent.id === event.id ? "selected" : "unselected"}`}
					key={event.id}
					style={{ backgroundColor: "#41454A" }}
					primaryText={event.name}
					onClick={() => handleSelect(event)}
				/>
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

	return (
		<React.Fragment>
			<Dialog
				model={true}
				paperClassName='rule-dialog'
				open={isOpen}
				onRequestClose={handleCancelClick}
				actions={hasEvents(userEvents) ? escalationsAddActions : escalationCancelActions}
			>
				{!loadingEvents
					? <div className="circular-progress">
						<CircularProgress size={60} thickness={5} />
					</div>
					: hasEvents(userEvents) ?
						<List
							className='rule-attributes-list'
						>
							<React.Fragment>
								<ErrorBoundary>
									<div className="typeAhead">
										<input
											className="typeAheadFilter"
											type="text"
											placeholder={getTranslation("createEditRule.escalations.escalationDialog.wantToFind")}
											onChange={handleTextChange.bind(this)}
											value={searchText}
										/>
										{searchText ?
											<button onClick={eraseInputValue.bind(this)}>
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
						<p><Translate vale="createEditRule.escalations.escalationDialog.noEventTemp" /></p>
				}
			</Dialog>
		</React.Fragment>
	);
};

export default EscalationDialog;