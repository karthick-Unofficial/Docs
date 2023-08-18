import React, { memo, useState, useEffect } from "react";
// components
import { Dialog } from "orion-components/CBComponents";
import SearchSelectField from "../../shared/components/SearchSelectField";
// material-ui
import { Button } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
// router
import { useNavigate } from "react-router-dom";
import debounce from "debounce";


const styles = {
	selectDivStyles: {
		display: "flex",
		justifyContent: "space-between",
		maxWidth: "100%"
	}
};




const NewEventReplay = () => {
	const navigate = useNavigate();
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
			b title={<h3>{getTranslation("newReplay.newEventReplay.title")}</h3>}
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
					label={getTranslation("newReplay.newEventReplay.search")}
					disabled={false}
					handleClear={() => console.log("clear")}
					handleSelect={handleChange("eventId")}
					handleSearch={handleSearch}
					results={events}
				/>
			</div>

			<div style={{ alignItems: "center", display: "flex", justifyContent: "flex-end", marginTop: 40 }}>
				<Button onClick={() => navigate(-1)} style={{ height: 40, width: 130 }}>
					<Translate value="newReplay.newEventReplay.cancel" />
				</Button>
				<Button style={{ height: 40, width: 130 }} variant="contained" color="primary">
					<Translate value="newReplay.newEventReplay.loadReplay" />
				</Button>
			</div>

		</Dialog>

	);
};


export default memo(NewEventReplay);
