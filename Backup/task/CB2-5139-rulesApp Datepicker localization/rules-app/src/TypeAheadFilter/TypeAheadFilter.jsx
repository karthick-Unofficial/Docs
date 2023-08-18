import React, { Component } from "react";


class TypeAheadFilter extends Component {
	state = {
		typeAheadText: ""
	};

	handleTextChange = (event) => {
		this.setState({typeAheadText: event.target.value});
		this.props.typeAheadFilter(event.target.value);
	}

	UNSAFE_componentWillMount() {
		document.addEventListener("keydown", this._handleKeyDown.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown.bind(this));
	}

	// escape key acts as cancel shortcut
	_handleKeyDown = (event) => {
		if (event.key === "Escape" && this.state.typeAheadText.length > 0) this.eraseInputValue();
	}

	eraseInputValue = () => {
		this.props.typeAheadFilter("");
		this.refs.typeahead.value = "";
		this.setState({typeAheadText: ""});
	}
	
	render() {
		const { placeholder} = this.props;
		return (
			<div className="typeAhead">
				<div>
					<input
						type="text"
						ref="typeahead"
						onChange={this.handleTextChange.bind(this)}
						placeholder={placeholder}
					/>
				</div>
				
				{ this.state.typeAheadText ? 
					<button onClick={this.eraseInputValue.bind(this)}>
						<i className="material-icons">cancel</i>
					</button>
					: 
					<i className="material-icons">search</i>
				}
				
			</div>
		);
	}
}
export default TypeAheadFilter;
