import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { Translate } from "orion-components/i18n/I18nContainer";

class SubmitControls extends Component {
	constructor(props) {
		super(props);
		this.state = {  };
	}

	render() {
		const { dir } = this.props;
		return (
			<div className="buttons">
				<Button
					variant="text"
					style={dir == "rtl" ? {
						marginLeft: 12
					} : {
						marginRight: 12
					}}
					onClick={this.props.resetForm}
				>
					<Translate value="alertGenerator.submitControls.reset"/>
				</Button>
				{this.props.isValidActivity ?
					<Button
						variant="contained"
						onClick={this.props.handleGenerateAlert}
						style={{
							backgroundColor: "#35b7f3",
							color: "#fff"
						}}
					>
						<Translate value="alertGenerator.submitControls.generate"/>
					</Button>
					:
					<Button
						variant="contained"
						onClick={this.props.handleGenerateAlert}
						disabled={!this.props.isValidActivity}
						style={{
							color: "#fff"
						}}
					>
						<Translate value="alertGenerator.submitControls.generate"/>
					</Button>
				}
			</div>
		);
	}
}

export default SubmitControls;