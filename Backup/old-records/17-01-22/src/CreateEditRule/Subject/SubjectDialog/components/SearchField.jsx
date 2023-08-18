import React, { Component } from "react";

import { TextField, IconButton } from "material-ui";

class SearchField extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	eraseInputValue = () => {
		this.refs.typeahead.input.value = "";
		this.props.updateSearch("");
	};

	handleSearch = value => {
		this.props.updateSearch(value);
	};

	render() {
		const { width } = this.props;

		return (
			<div className="search-field">
				<TextField
					id="search-field"
					ref="typeahead"
					placeholder={"Search tracks..."}
					onChange={e => {
						this.handleSearch(e.target.value);
					}}
					style={{
						backgroundColor: "transparent",
						width: width
					}}
					underlineStyle={{
						borderColor: "#41454A"
					}}
					autoFocus={true}
				/>

				{this.props.searchValue !== "" ? (
					<IconButton onClick={this.eraseInputValue}>
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
