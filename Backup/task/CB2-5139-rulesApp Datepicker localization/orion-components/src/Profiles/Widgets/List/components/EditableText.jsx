import React, { Component } from "react";
import { TextField } from "material-ui";

class EditableText extends Component {
	constructor(props){
		super(props);

		const data = this.props.row[this.props.item];

		this.state = {
			textValue: data,
			editing: false
		};
	}
	
	componentDidMount() {
		this.setState({
			textValue: this.props.row[this.props.item]
		});
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.state.textValue !== nextProps.row[nextProps.item]
			&& !this.state.editing
		){
			this.setState({
				textValue: nextProps.row[nextProps.item] 
			});
		}
	}

    handleUpdate = (e) => {
    	e.preventDefault();
    	this.setState({ textValue: e.target.value });
    }

    handleEditMode = () => {
    	this.setState({editing: true});
    }

    handleSave = () => {
    	this.setState({ editing: false });
        
    	let data;
    	if (this.props.type === "text-header") {
    		data = {label: this.state.textValue, property: this.props.row.property, type: this.props.dataType};
    	} else {
    		data = this.state.textValue;
    	}
    	this.props.handleSaveUpdatedText(data, this.props.item, this.props.index);
    }

    render() {
    	const { expanded } = this.props;
    	const { editing } = this.state;
		
    	const style = {
    		widget: {
    			fontSize: "15px",
    			backgroundColor: "#2c2d2f",
    			color: this.props.color || "white",
    			width: "100%",
    			whiteSpace: "nowrap",
    			overflow: "hidden",
    			textOverflow : "ellipsis"
    			// For whatever reason, inputs are shortened when deleting a row, this solves the issue for now
    		},	
    		// Also causes slight style issue on bottom border 
    		expanded: {
    			fontSize: "15px",
    			backgroundColor: "#35383C",
    			color: this.props.color || "white",
    			width: "100%",
    			whiteSpace: "nowrap",
    			overflow: "hidden",
    			textOverflow: "ellipsis"
    		}
    	};

    	return (
    		<TextField 
    			id={"testing"}
    			value={this.state.textValue} 
    			onChange={(e) => this.handleUpdate(e)}
    			onFocus={this.handleEditMode}
    			fullWidth={true}  // sets to column width
    			onBlur={this.handleSave} // on mouse leave
    			underlineShow={editing ? true : false}
    			inputStyle={expanded ? style.expanded : style.widget}
    		>
    		</TextField>
    	);
    }
}

export default EditableText;