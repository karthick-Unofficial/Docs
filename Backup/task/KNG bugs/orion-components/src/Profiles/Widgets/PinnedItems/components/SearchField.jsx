import React, { Component } from "react";

import { TextField, IconButton } from "@material-ui/core";

class SearchField extends Component {
	constructor(props) {
		super(props);

		this.state = { value: "" };
	}

	componentWillUnmount() {
		this.handleClear();
	}

	handleClear = () => {
		this.props.handleClear();
		this.setState({ value: "" });
	};

	handleSearch = value => {
		this.props.updateSearch(value);
		this.setState({ value });
	};

	render() {
		const { width, placeholder, autoFocus } = this.props;
		const { value } = this.state;

		return (
			<div className="search-field" style={{marginTop: "15px"}}>
				<TextField
					id="search-field"
					placeholder={placeholder}
					onChange={e => {
						this.handleSearch(e.target.value);
					}}
					value={value}
					style={{
						backgroundColor: "transparent",
						width: width
					}}
					autoFocus={autoFocus}
				/>

				{value !== "" ? (
					<IconButton
						style={{
							color: "white"
						}}
						onClick={this.handleClear}
					>
						<i className="material-icons">cancel</i>
					</IconButton>
				) : (
					<i className="material-icons">search</i>
				)}
			</div>
		);
	}
}
export default SearchField;
