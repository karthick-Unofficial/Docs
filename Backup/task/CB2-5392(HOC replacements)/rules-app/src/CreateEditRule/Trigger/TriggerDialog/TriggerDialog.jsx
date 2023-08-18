import React, { useEffect, useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, { ListItem } from "material-ui/List";
import Dialog from "material-ui/Dialog";
import CircularProgress from "material-ui/CircularProgress";

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
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.trigger.triggerDialog.cancel")}
			onClick={handleCancelClick}
			primary={true}
		/>,
		<FlatButton
			style={styles.buttonStyles}
			label={getTranslation("createEditRule.trigger.triggerDialog.addItem")}
			onClick={() => handleSaveClick()}
			primary={true}
		/>
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
							className={`${state.selectedItems.indexOf(shape) > -1 ? "selected" : "unselected"}`}
							key={shape.id}
							style={{ backgroundColor: "#41454A" }}
							primaryText={shape.entityData.properties.name}
							onClick={() => handleSelect(shape)}
						/>
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
							className={`${state.selectedItems.indexOf(item) > -1 ? "selected" : "unselected"}`}
							key={item.id}
							style={{ backgroundColor: "#41454A" }}
							primaryText={item.name}
							onClick={() => handleSelect(item)}
						/>
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

	return (
		<Dialog
			model={true}
			paperClassName='rule-dialog'
			open={isOpen}
			onRequestClose={handleCancelClick}
			actions={shapesAddActions}
		>
			<List
				className='rule-attributes-list'
			>
				<ErrorBoundary>
					<TypeAheadFilter
						className="typeAheadFilter"
						placeholder={getTranslation("createEditRule.trigger.triggerDialog.wantToFind")}
						store={store} // passing store explicitly to avoid redux connect issues
					/>
				</ErrorBoundary>

				{isQuerying
					? <div className="circular-progress">
						<CircularProgress size={60} thickness={5} />
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
		</Dialog>
	);
};


export default TriggerDialog;