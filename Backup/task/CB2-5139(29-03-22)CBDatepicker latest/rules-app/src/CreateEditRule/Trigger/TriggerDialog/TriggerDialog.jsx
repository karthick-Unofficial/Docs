import React, { Component } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, {ListItem} from "material-ui/List";
import Dialog from "material-ui/Dialog";
import CircularProgress from "material-ui/CircularProgress";

// components
import TypeAheadFilterContainer from "../../../TypeAheadFilter/TypeAheadFilterContainer";

// misc
import _ from "lodash";

//virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const html = document.getElementsByTagName("html")[0];

class TriggerDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItems: []
		};
	}

	UNSAFE_componentWillMount() {
		const { queryShapes } = this.props;

		// Prevent background scrolling when dialog is open.
		html.style.position = "fixed";
		html.style.width = "100%";
		document.addEventListener("keydown", this._handleKeyDown.bind(this));
		queryShapes();
	}

	componentWillUnmount() {
		const { clearSearchResults } = this.props;

		// Allow background scrolling on dialog close
		html.style.position = "static";
		html.style.width = "auto";
		document.removeEventListener("keydown", this._handleKeyDown.bind(this));
		clearSearchResults();
	}

	// Enter to submit
	_handleKeyDown = (event) => {
		if (event.key === "Enter" && this.props.isOpen) {
			this.handleSaveClick();
		}
	}

	handleSaveClick = () => {
		this.props.addTargets(this.state.selectedItems);
		this.setState({
			selectedItems: []
		});
		this.props.typeAheadFilter("");
		this.props.closeDialog();
	}

	handleCancelClick = () => {
		this.setState({
			selectedItems: []
		});
		this.props.typeAheadFilter("");
		this.props.closeDialog();
	}

	_capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	}

	handleSelect = (polygon) => {
		const tArray = this.state.selectedItems;
		const index = tArray.indexOf(polygon);
		tArray.indexOf(polygon) > -1 
			? tArray.splice(index, 1)
			: tArray.push(polygon);
		this.setState({
			selectedItems: tArray
		});
	}

	render () {

		const { 
			targets,
			availableTargets, 
			shapeList,
			styles, 
			typeAheadFilterValue, 
			isOpen, 
			trigger, 
			isQuerying, 
			error 
		} = this.props;

		const shapesAddActions = [
			<FlatButton
				style={styles.buttonStyles} 
				label={getTranslation("createEditRule.trigger.triggerDialog.cancel")}
				onClick={this.handleCancelClick}
				primary={true}
			/>,
			<FlatButton
				style={styles.buttonStyles}
				label={getTranslation("createEditRule.trigger.triggerDialog.addItem")}
				onClick={() => this.handleSaveClick()}
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
		
		switch(this.props.targetType) {
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
								className={`${this.state.selectedItems.indexOf(shape) > -1 ? "selected" : "unselected"}`}
								key={shape.id}
								style={{backgroundColor: "#41454A"}}
								primaryText={shape.entityData.properties.name}
								onClick={() => this.handleSelect(shape)}
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
								className={`${this.state.selectedItems.indexOf(item) > -1 ? "selected" : "unselected"}`}
								key={item.id}
								style={{backgroundColor: "#41454A"}}
								primaryText={item.name}
								onClick={() => this.handleSelect(item)}
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
				onRequestClose={this.handleCancelClick}
				actions={shapesAddActions}
			>
				<List
					className='rule-attributes-list'
				>
	                <ErrorBoundary>
		                <TypeAheadFilterContainer
		                    className="typeAheadFilter"
		                    placeholder={getTranslation("createEditRule.trigger.triggerDialog.wantToFind")}
		                />
	                </ErrorBoundary>

					{isQuerying 
						? <div className="circular-progress">
							<CircularProgress size={60} thickness={5} />
						  </div>
						: error 
							? <div className="error-message">
								<p> <Translate value="createEditRule.trigger.triggerDialog.errorOccured"/> </p>
							  </div>
							: shapeList 
								?  <AutoSizer disableHeight>
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
	}
}


export default TriggerDialog;