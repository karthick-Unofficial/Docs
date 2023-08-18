import React, { memo } from "react";
// router
import { browserHistory } from "react-router";
//material ui
import {
	Container,
	Divider,
	IconButton
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const defaultProps = {
	children: []
};
const EditPageTemplate = ({
	children,
	title,
	subTitle,
	dir
}) => {
	return (
		<Container style={{
			maxWidth: "100%",
			padding: 0
		}}>
			<Container style={{
				maxWidth: "100%",
				height: 56,
				paddingLeft: 0,
				paddingRight: 0,
				marginBottom: 88,
				display: "flex",
				zIndex: 985,
				flexDirection: "column"
			}}>
				<header style={{
					alignItems: "center",
					display: "flex",
					margin: "auto",
					maxWidth: "100%",
					minWidth: 0,
					width: 690,
					marginBottom: 12
				}}>
					<IconButton 
						style={dir && dir == "rtl" ? {marginLeft: 15, color: "white"} : { marginRight: 15, color: "white"}} 
						onClick={() => browserHistory.goBack()}
					>
						{dir && dir == "rtl" ? <ArrowForwardIcon style={{ height: 32, width: 32 }} /> : <ArrowBackIcon style={{ height: 32, width: 32 }} />}
					</IconButton>
					<h2>
						{title}
					</h2>
				</header>
				<Divider />
				<div style={{
					alignItems: "center",
					display: "flex",
					margin: "auto",
					maxWidth: "100%",
					minWidth: 0,
					width: 690,
					color: "#828283",
					fontSize: 14,
					marginTop: 20,
					padding: 8
				}}>
					{subTitle}
				</div>
				
			</Container>
			{children}
		</Container>
	);
};
EditPageTemplate.defaultProps = defaultProps;
export default memo(EditPageTemplate);