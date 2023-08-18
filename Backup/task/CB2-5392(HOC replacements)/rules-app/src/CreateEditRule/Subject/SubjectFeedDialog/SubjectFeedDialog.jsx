import React, { useState, useEffect } from "react";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, { ListItem } from "material-ui/List";
import Dialog from "material-ui/Dialog";

// misc
import _ from "lodash";

//virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector } from "react-redux";

const html = document.getElementsByTagName("html")[0];

const SubjectFeedDialog = ({ addSubjects, toggleDialog, styles, subject, isOpen }) => {
	const userFeeds = useSelector(state => state.session.userFeeds);
	const userTrackFeeds = Object.keys(userFeeds)
		.map(key => userFeeds[key])
		.filter(feed => feed.entityType === "track");

	const [state, setState] = useState({
		selectedFeeds: [],
		searchValue: "",
		mounted: false
	});

	// Enter to submit
	const _handleKeyDown = (event) => {
		if (event.key === "Enter" && isOpen) {
			handleSaveClick();
		}
	};
	useEffect(() => {
		setState(prevState => ({ ...prevState, mounted: true }));
		return () => {
			// Allow background scrolling on dialog close
			html.style.position = "static";
			html.style.width = "auto";
		};
	}, []);

	if (!state.mounted) {
		// Prevent background scrolling when dialog is open.
		html.style.position = "fixed";
		html.style.width = "100%";
		document.addEventListener("keydown", _handleKeyDown);
		setState(prevState => ({ ...prevState, mounted: true }));
	}


	const handleUpdateSearch = value => {
		setState(prevState => ({ ...prevState, searchValue: value }));
	};

	const handleSaveClick = () => {
		const trimmedFeeds = state.selectedFeeds.map((feed) => {
			return {
				id: feed.feedId,
				entityType: "feed",
				name: feed.name || feed.feedId,
				feedId: feed.feedId
			};
		});
		addSubjects(trimmedFeeds);
		setState(prevState => ({ ...prevState, selectedFeeds: [] }));
		document.removeEventListener("keydown", _handleKeyDown);
		toggleDialog();
	};

	const handleCancelClick = () => {
		setState(prevState => ({ ...prevState, selectedFeeds: [] }));
		document.removeEventListener("keydown", _handleKeyDown);
		toggleDialog();
	};

	const _capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	const handleEntitySelect = (feed) => {
		const tArray = state.selectedFeeds;
		const index = tArray.indexOf(feed);
		tArray.indexOf(feed) > -1
			? tArray.splice(index, 1)
			: tArray.push(feed);
		setState(prevState => ({ ...prevState, selectedFeeds: tArray }));
	};

	const feedsAddActions = [
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.subject.subjectFeedDialog.cancel")}
			onClick={handleCancelClick}
			primary={true}
		/>,
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.subject.subjectFeedDialog.addItem")}
			onClick={() => handleSaveClick()}
			primary={true}
		/>
	];


	const subjectIds = subject.map((feed) => feed.feedId);

	const dialogFeeds = userTrackFeeds.filter((feed) => {
		if (state.searchValue === "" || feed.name.includes(state.searchValue)) {
			return !subjectIds.includes(feed.feedId);
		}
	});

	// react-virtualized
	// We are virtualized rendered lists of tracks so they don't slow down the app
	// this is a conditional because the map is a huge hit on performance when the dialog isn't open

	let renderedFeeds;
	if (isOpen) {
		renderedFeeds = dialogFeeds.map((feed) => {
			return (
				<ListItem
					className={`${state.selectedFeeds.indexOf(feed) > -1 ? "selected" : "unselected"}`}
					style={styles.listItemStyles}
					key={feed.feedId}
					primaryText={feed.name}
					onClick={() => handleEntitySelect(feed)}
				/>
			);
		}
		);
	}

	const rowRenderer = ({
		key,
		index,
		isScrolling,
		isVisible,
		style
	}) => {
		return (
			<div key={key} style={style}>
				{renderedFeeds[index]}
			</div>
		);
	};

	return (
		<Dialog
			paperClassName='rule-dialog'
			open={isOpen}
			onRequestClose={handleCancelClick}
			actions={feedsAddActions}
		>
			<List
				className='rule-attributes-list'
			>
				{dialogFeeds.length > 0 ?
					<AutoSizer disableHeight>
						{({ width }) => (
							<VirtList
								rowCount={dialogFeeds.length}
								autoContainerWidth={true}
								rowHeight={68}
								width={width}
								height={700}
								rowRenderer={rowRenderer}
								overscanRowCount={1}
							/>
						)}
					</AutoSizer>
					:
					<p>{userTrackFeeds.length > 0 ? <Translate value="createEditRule.subject.subjectFeedDialog.noAdditional" /> : <Translate value="createEditRule.subject.subjectFeedDialog.noFeeds" />}</p>
				}

			</List>
		</Dialog>
	);
};

export default SubjectFeedDialog;