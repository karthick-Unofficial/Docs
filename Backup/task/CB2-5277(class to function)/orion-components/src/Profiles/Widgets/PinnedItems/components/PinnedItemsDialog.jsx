import React, { useEffect, useState } from "react";

import SearchField from "./SearchField";
import {
	List,
	CircularProgress,
	ListItem,
	Checkbox
} from "material-ui";
import { Dialog as CBDialog } from "orion-components/CBComponents";

import { eventService } from "client-app-core";

import { getIconByTemplate } from "orion-components/SharedComponents";
import debounce from "debounce";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const PinnedItemsDialog = ({
	feeds,
	closeDialog,
	contextId,
	dialog, dir
}) => {
	const [querying, setQuerying] = useState(false);
	const [additions, setAdditions] = useState([]);
	const [results, setResults] = useState([]);
	const [error, setError] = useState(null);
	const [profileIconTemplates, setProfileIconTemplates] = useState({});

	useEffect(() => {
		feeds.forEach(feed => {
			profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
		});
		setProfileIconTemplates(profileIconTemplates);
	}, []);

	const handleClosePinDialog = () => {
		setAdditions([]);
		setQuerying(false);
		setError(null);
		setResults([]);
		closeDialog("pinnedItemDialog");
	};

	const handleConfirmPin = () => {
		eventService.pinEntities(contextId, additions, (err, response) => {
			if (err) console.log(err);

			// Update 'lastModified', cause new pinned items to stream in on event stream object
			eventService.mockUpdateEvent(contextId, (err, response) => {
				if (err) {
					console.log(err);
				}
			});
		});
		handleClosePinDialog();
	};

	const handleAddItem = item => {
		const addition = {
			id: item.id,
			feedId: item.feedId
		};

		const index = additions.findIndex(addition => {
			return addition.id === item.id;
		});

		if (index === -1) {
			setAdditions([...additions, addition]);
		} else {
			additions.splice(index, 1);
			setAdditions(additions);
		}
	};

	const handleSearch = value => {
		let queryFinished = false;
		setTimeout(() => {
			if (!queryFinished) {
				setQuerying(true);
			}
		}, 500);

		if (value.length) {
			eventService.queryPinnable(contextId, value, 5, (err, response) => {
				// No matter the response, we don't want to show the progress wheel
				queryFinished = true;
				if (err) {
					setError(getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.errorText.errorOcc"));
					setQuerying(false);
					return;
				}
				if (response instanceof Array && response.length < 1) {
					setError(getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.errorText.noItems"));
					setQuerying(false);
				} else {
					setResults(response);
					setQuerying(false);
					setError(null);
				}
			});
		} else {
			queryFinished = true;
			handleClearSearch();
		}
	};

	const handleClearSearch = () => {
		setResults([]);
		setQuerying(false);
		setError(null);
	};

	const styles = {
		listStyles: {
			backgroundColor: "#41454A",
			marginBottom: ".75rem"
		},
		error: {
			textAlign: "center",
			padding: "10px"
		},
		progress: {
			textAlign: "center",
			padding: "15px 0"
		}
	};

	const HandleSearch = debounce(handleSearch, 500);

	return (
		<CBDialog
			open={dialog === "pinnedItemDialog"}
			confirm={{
				label: getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.confirm"),
				action: handleConfirmPin,
				disabled: !additions.length
			}}
			abort={{ label: getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.cancel"), action: handleClosePinDialog }}
			options={{
				onClose: handleClosePinDialog,
				maxWidth: "sm"
			}}
			dir={dir}
		>
			<SearchField
				updateSearch={HandleSearch}
				handleClear={handleClearSearch}
				width="320px"
				placeholder={getTranslation("global.profiles.widgets.pinnedItems.pinnedItemsDialog.wantToFind")}
				autoFocus={true}
			/>
			<List>
				{querying ? (
					<div style={styles.progress}>
						<CircularProgress size={60} thickness={5} />
					</div>
				) : error ? (
					<div style={styles.error}>
						<p> {error}</p>
					</div>
				) : results.length ? (
					results.map(result => {
						const props = result.entityData.properties;
						const index = additions.findIndex(addition => {
							return addition.id === result.id;
						});
						return (
							<ListItem
								id="search-result"
								key={result.id}
								style={styles.listStyles}
								leftAvatar={getIconByTemplate(props.type, result, "2.5rem", profileIconTemplates[result.feedId])}
								rightToggle={
									<Checkbox
										checked={index !== -1}
										onCheck={() => handleAddItem(result)}
									/>
								}
								primaryText={props.name}
								secondaryText={props.type}
							/>
						);
					})
				) : null}
			</List>
		</CBDialog>
	);
};

export default PinnedItemsDialog;
