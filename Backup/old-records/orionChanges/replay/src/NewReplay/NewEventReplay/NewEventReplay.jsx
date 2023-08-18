import React, { memo, useState, Fragment, useEffect } from "react";
// components
import { SelectField, Dialog, DateTimePicker } from "orion-components/CBComponents";
import SearchSelectField from "../../shared/components/SearchSelectField";
// material-ui
import { Checkbox, FormControlLabel, TextField, Button, Divider, Slider } from "@material-ui/core";

import { restClient } from "client-app-core";
import moment from "moment-timezone";
// router
import { browserHistory } from "react-router";
import debounce from "debounce";
const propTypes = {
};

const defaultProps = {
};

const styles = {
	selectDivStyles: {
		display: "flex",
		justifyContent: "space-between",
		maxWidth: "100%"
	}
};




const NewEventReplay = () => {
	const [query, setQuery] = useState(null);
	const [eventResults, seteventResults] = useState([]);
	const [event, setEvent] = useState(null);
	const [error, setError] = useState(false);
	useEffect(() => {
		if (query) {
			console.log("query: ", query);
		}
		if (!query && eventResults && eventResults.length) {
			seteventResults([]);
		}
	}, [query, eventResults]);

	const handleQuery = e => {
		setQuery(e.target.value);
	};
	const handleChange = name => e => {
		console.log(e);
	};

	const handleSearch = debounce(handleQuery, 500);
	const events = eventResults.map(result => {
		const { id, entityData } = result;
		return { id, name: entityData.properties.name };
	});
	const eventValue = !event
		? ""
		: // event and event data - Full access
		event && event.entityData
			? event.entityData.properties.name
			: // Otherwise, event was hidden and will display "[Hidden event]" string
			event;
	return (
		<Dialog
			open={true}
			title={<h3>Search and select Event</h3>}
			paperPropStyles={{
				backgroundColor: "#41454a",
				padding: 15,
				width: 600
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 50 }}>
				<SearchSelectField
					id={"event-select"}
					value={eventValue}
					label={"Search"}
					disabled={false}
					handleClear={() => console.log("clear")}
					handleSelect={handleChange("eventId")}
					handleSearch={handleSearch}
					results={events}
				/>
			</div>

			<div style={{ alignItems: "center", display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
				<Button onClick={() => browserHistory.goBack()} style={{ height: 40, width: 130 }}>
						Cancel
				</Button>
				<Button style={{ height: 40, width: 130 }} variant="contained" color="primary">
						Load Replay
				</Button>
			</div>
			
		</Dialog>

	);
};

NewEventReplay.propTypes = propTypes;
NewEventReplay.defaultProps = defaultProps;

export default memo(NewEventReplay);
