import React, { useEffect, useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import { List, ListItem, Dialog, CircularProgress, Button, ListItemText, DialogActions } from "@mui/material";
import {useStyles} from "../../../shared/styles/overrides";

// components
import TypeAheadFilter from "../../../TypeAheadFilter/TypeAheadFilter";

// misc
import _ from "lodash";

//virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch, useStore } from "react-redux";
import * as actionCreators from "./triggerDialogActions";

const html = document.getElementsByTagName("html")[0];

const TriggerDialog = ({ addTargets, closeDialog, targets, availableTargets, styles, isOpen, trigger, targetType }) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const { queryShapes, clearSearchResults, typeAheadFilter } = actionCreators;
	const shapeList = useSelector(state => state.appState.profilePage.searchResults);
	const typeAheadFilterValue = useSelector(state => state.appState.indexPage.typeAheadFilter);
	const isQuerying = useSelector(state => state.appState.profilePage.isQuerying);
	const error = useSelector(state => state.appState.profilePage.queryDialogError);

	const [state, setState] = useState({
		selectedItems: [],
		mounted: false
	});

	const store = useStore();

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
			document.removeEventListener("keydown", _handleKeyDown);
			dispatch(clearSearchResults());
		};
	}, []);

	if (!state.mounted) {
		// Prevent background scrolling when dialog is open.
		html.style.position = "fixed";
		html.style.width = "100%";
		document.addEventListener("keydown", _handleKeyDown);
		dispatch(queryShapes());
		setState(prevState => ({ ...prevState, mounted: true }));
	}

	const handleSaveClick = () => {
		addTargets(state.selectedItems);

		setState(prevState => ({ ...prevState, selectedItems: [] }));
		dispatch(typeAheadFilter(""));
		closeDialog();
	};

	const handleCancelClick = () => {
		setState(prevState => ({ ...prevState, selectedItems: [] }));
		dispatch(typeAheadFilter(""));
		closeDialog();
	};

	const _capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	const handleSelect = (polygon) => {
		const tArray = state.selectedItems;
		const index = tArray.indexOf(polygon);
		tArray.indexOf(polygon) > -1
			? tArray.splice(index, 1)
			: tArray.push(polygon);
		setState(prevState => ({ ...prevState, selectedItems: tArray }));
	};

	const shapesAddActions = [
		<Button
			className="themedButton"
			style={styles.buttonStyles}
			onClick={handleCancelClick}
			variant="text"
		>
			{getTranslation("createEditRule.trigger.triggerDialog.cancel")}
		</Button>,
		<Button
			className="themedButton"
			style={styles.buttonStyles}
			onClick={() => handleSaveClick()}
			variant="text"
		>
			{getTranslation("createEditRule.trigger.triggerDialog.addItem")}
		</Button>
	];

	let renderedItems;
	let dialogRows;
	const selectedItems = targets.map((item) => item.id);

	const sortArr = (arr) => {
		return arr.sort((a, b) => {
			const aName = a.entityData ? a.entityData.properties.name.toLowerCase() : a.name.toLowerCase();
			const bName = b.entityData ? b.entityData.properties.name.toLowerCase() : b.name.toLowerCase();
			if (aName < bName)
				return -1;
			if (aName > bName)
				return 1;
			return 0;
		});
	};

	// System Health rules
	if (availableTargets) {
		sortArr(availableTargets);
	}

	// Track rules
	if (shapeList) {
		sortArr(shapeList);
	}

	switch (targetType) {
		case "shape": {
			dialogRows = shapeList.filter((shape) => {
				return !selectedItems.includes(shape.id);
			})
				// Filter based on trigger type (Only polygons for the time being)
				.filter((shape) => {
					if (trigger === "exit" || trigger === "enter" || trigger === "loiter") {
						return shape.entityData.geometry.type === "Polygon";
					} else if (trigger === "cross") {
						return shape.entityData.geometry.type === "LineString" && shape.entityData.geometry.coordinates.length == 2;
					} else {
						return shape;
					}
				})
				// filter by typeahead
				.filter(shape => {
					if (typeAheadFilterValue === "") return shape;
					else {
						if (_.includes(shape.entityData.properties.name.toLowerCase(), typeAheadFilterValue.toLowerCase())) return shape;
						else return false;
					}
				});

			// this is a conditional because the map is a huge hit on performance when the dialog isn't open
			if (isOpen) {
				renderedItems = dialogRows.map((shape) => {
					return (
						<ListItem
							key={shape.id}
							onClick={() => handleSelect(shape)}
							className={`${state.selectedItems.indexOf(shape) > -1 ? "selected" : "unselected"}`}
							style={{ backgroundColor: "#41454A" }}
						>
							<ListItemText
								primary={shape.entityData.properties.name}
								primaryTypographyProps={{ style: { fontSize: 16, lineHeight: "unset", padding: "16px" } }}
								sx={{ margin: "0px" }}
							/>
						</ListItem>
					);
				});
			}
			break;

		}
		case "system-health": {
			// this is a conditional because the map is a huge hit on performance when the dialog isn't open
			dialogRows = availableTargets.filter((item) => {
				return !selectedItems.includes(item.id);
			})
				.filter(item => {
					if (typeAheadFilterValue === "") return item;
					else {
						if (_.includes(item.name.toLowerCase(), typeAheadFilterValue.toLowerCase())) return item;
						else return false;
					}
				});

			if (isOpen) {
				renderedItems = dialogRows.map((item) => {
					return (
						<ListItem
							key={item.id}
							onClick={() => handleSelect(item)}
							className={`${state.selectedItems.indexOf(item) > -1 ? "selected" : "unselected"}`}
							style={{ backgroundColor: "#41454A" }}
						>
							<ListItemText
								primary={item.name}
								primaryTypographyProps={{ style: { fontSize: 16, lineHeight: "unset", padding: "16px" } }}
								sx={{ margin: "0px" }}
							/>
						</ListItem>
					);
				});
			}
			break;
		}
		default:
			break;
	}

	const targetRowRenderer = ({
		key,
		index,
		isScrolling,
		isVisible,
		style
	}) => {
		return (
			<div key={key} style={style}>
				{renderedItems[index]}
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
		<Dialog
			PaperProps={{ className: "rule-dialog", sx: overrides.paperProps }}
			open={isOpen}
			onClose={handleCancelClick}
			classes={{ scrollPaper: classes.scrollPaper }}
		>
			<List
				className='rule-attributes-list'
				sx={overrides.list}
			>
				<ErrorBoundary>
					<TypeAheadFilter
						className="typeAheadFilter"
						placeholder={getTranslation("createEditRule.trigger.triggerDialog.wantToFind")}
						dispatch={dispatch}
					/>
				</ErrorBoundary>

				{isQuerying
					? <div className="circular-progress" style={{ color: "rgb(0, 188, 212)" }}>
						<CircularProgress size={60} thickness={5} color="inherit" />
					</div>

					: error
						? <div className="error-message">
							<p> <Translate value="createEditRule.trigger.triggerDialog.errorOccured" /> </p>
						</div>
						: shapeList
							? <AutoSizer disableHeight>
								{({ width }) => (
									<VirtList
										rowCount={dialogRows.length}
										autoContainerWidth={true}
										rowHeight={68}
										width={width}
										height={700}
										rowRenderer={targetRowRenderer}
										overscanRowCount={1}
									/>
								)}
							</AutoSizer>
							: null}
			</List>
			<DialogActions>{shapesAddActions}</DialogActions>
		</Dialog>
	);
};


export default TriggerDialog;