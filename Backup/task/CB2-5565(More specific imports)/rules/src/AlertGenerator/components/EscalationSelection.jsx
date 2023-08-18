import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SearchField from "./SearchField";
import { eventService } from "client-app-core";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { List, ListItem, ListItemText } from "@mui/material";
import includes from "lodash/includes";
import { Translate } from "orion-components/i18n";

const propTypes = {
	handleAlertEventClick: PropTypes.func.isRequired,
	selectedEvent: PropTypes.string
};
const defaultProps = {
};

const TargetSelection = ({
	handleAlertEventClick,
	selectedEvent
}) => {
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [events, setEvents] = useState([]);
	const sortArr = (arr) => {
		return arr.sort((a, b) => {
			const aName = a.entityData && a.entityData.properties && a.entityData.properties.name ? a.entityData.properties.name.toLowerCase() : a.name.toLowerCase();
			const bName = b.entityData && b.entityData.properties && b.entityData.properties.name ? b.entityData.properties.name.toLowerCase() : b.name.toLowerCase();
			if (aName < bName)
				return -1;
			if (aName > bName)
				return 1;
			return 0;
		});
	};
	useEffect(() => {
		eventService.getAllTemplates((err, res) => {
			if (err) {
				console.log(err);
			} else {
				sortArr(res);
				setEvents(res);
				setFilteredEvents(res);
			}
		});
	}, []);

	const updateSearchText = textEntry => {
		if (textEntry === "") {
			setFilteredEvents(events);
			return;
		}
		if (events.length > 0) {
			const eArray = events
				.filter(event => {
					const name = event.entityData && event.entityData.properties && event.entityData.properties.name ?
						event.entityData.properties.name : event.name;
					if (includes(name.toLowerCase(), textEntry.toLowerCase())) return event;
					else return false;
				});
			console.log("filtered events: " + JSON.stringify(eArray));
			setFilteredEvents(eArray);
		}
	};

	return (
		<div className="generic-attribute">
			<h4><Translate value="alertGenerator.escalationEvent.title" /></h4>
			<div>
				<List className="trigger-attribute-list">
					<ErrorBoundary>
						<SearchField
							width="100%"
							updateSearch={updateSearchText}
							className="typeAheadFilter"
						/>
					</ErrorBoundary>
					<div
						style={{ height: "400px" }}
						className="targetSelectionScroll scrollbar"
					>
						{filteredEvents.map((item, index) => {
							const name = item.entityData && item.entityData.properties && item.entityData.properties.name ?
								item.entityData.properties.name : item.name;
							return (
								<ListItem
									className={`${selectedEvent === (item.id) ? "selected" : "unselected"}`}
									key={item.id}
									onClick={() => handleAlertEventClick(item)}
									sx={{ padding: "0px", textAlign: "unset" }}
								>
									<ListItemText
										primary={name}
										primaryTypographyProps={{ style: { fontSize: 16, lineHeight: "48px", padding: "0 16px" } }}
										sx={{ margin: "0px" }}
									/>
								</ListItem>
							);
						})}
					</div>
				</List>
			</div>
		</div>
	);
};

TargetSelection.propTypes = propTypes;
TargetSelection.defaultProps = defaultProps;

export default TargetSelection;