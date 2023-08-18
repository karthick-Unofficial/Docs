import React, { Component } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import FlatButton from "material-ui/FlatButton";
import List, {ListItem} from "material-ui/List";
import Dialog from "material-ui/Dialog";

// components
import TypeAheadFilterContainer from "../../../../../TypeAheadFilter/TypeAheadFilterContainer";

// misc
import _ from "lodash";

// virtualized list
import { List as VirtList, AutoSizer } from "react-virtualized";

const isMobile = window.matchMedia("(max-width: 600px)").matches;

const styles = {
	buttonStyles: {
		...(isMobile && {fontSize: "13px"})
	}
};

class MultiSelectionDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedItems: []
		};
	}0

handleSelect = (item) => {
	const { selectedItems } = this.state;

	const copy = [...selectedItems];
	const index = copy.indexOf(item);

	copy.indexOf(item) > -1 
		? copy.splice(index, 1)
		: copy.push(item);

	this.setState({ selectedItems: copy });
}

handleSaveClick = () => {
	const { selectedItems } = this.state;
	const { closeDialog, typeAheadFilter, handleMultiSelect } = this.props;

	handleMultiSelect(selectedItems);
	this.setState({ selectedItems: [] });

	typeAheadFilter("");
	closeDialog("multi-selection-dialog");
}

handleCancelClick = () => {
	const { closeDialog, typeAheadFilter } = this.props;

	this.setState({ selectedItems: []});

	typeAheadFilter("");
	closeDialog("multi-selection-dialog");
}

render() {
	const { 
		isOpen,
		selectionOptions,
		typeAheadFilterValue,
		searchProperty
	} = this.props;
	const { selectedItems } = this.state;

	const actions = [
		<FlatButton
			style={styles.buttonStyles} 
			label='Cancel'
			onClick={this.handleCancelClick}
			primary={true}
		/>,
		<FlatButton
			style={styles.buttonStyles}
			label='Add item'
			onClick={() => this.handleSaveClick()}
			primary={true}
		/>
	];

	const renderedItems = selectionOptions
		.filter(item => {
			if (typeAheadFilterValue === "") {
				return item;
			}
			else {
				if (item[searchProperty].toLowerCase().includes(typeAheadFilterValue.toLowerCase())) {
					return item;
				}
				else {
					return false;
				}
			}
		})
		.map(item => {
			const isSelected = selectedItems.indexOf(item) > -1;
			return (
				<ListItem
					className={isSelected ? "selected" : "unselected"}
					key={item.id}
					style={{backgroundColor: "#41454A"}}
					primaryText={item[searchProperty]}
					onClick={() => this.handleSelect(item)}
				/>
			);
		});

	const rowRenderer = ({
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

	return(
		<Dialog
			model={true}
			paperClassName='rule-dialog'
			open={isOpen === "multi-selection-dialog"}
			onRequestClose={this.handleCancelClick}
			actions={actions}
		>
			<List
				className='rule-attributes-list'
			>
				<ErrorBoundary>
					<TypeAheadFilterContainer
						className="typeAheadFilter"
						placeholder={"I want to find..."}
					/>
				</ErrorBoundary>

				<AutoSizer disableHeight>
					{({ width }) => (
						<VirtList
							rowCount={selectionOptions.length}
							autoContainerWidth={true}
							rowHeight={68}
							width={width}
							height={700}
							rowRenderer={rowRenderer}
							overscanRowCount={1}
						/>
					)}
				</AutoSizer>
			</List>
		</Dialog>
	);
}
}

export default MultiSelectionDialog;
