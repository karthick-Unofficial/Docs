import React, { memo } from "react";
import { Container, useMediaQuery } from "@material-ui/core";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n/I18nContainer";


const defaultProps = {
	headerTitle:  <Translate value="shared.components.exerciseContainer.defaultHeader"/>,
	headerDescription: "",
	dir: PropTypes.string
};

const propTypes = {
	headerTitle: PropTypes.string.isRequired,
	headerDescription: PropTypes.string.isRequired,
	dir: PropTypes.string
};

const HeaderContainer = ({
	headerTitle,
	headerDescription,
	dir
}) => {
	const matchesLarge = useMediaQuery("(max-width:1023px) and (min-width:720px), (min-width:1048px)");
	const matchesSmall = useMediaQuery("(min-width:600px)");
	return (
		<Container style={{
			position: "relative",
			marginTop: 8,
			marginLeft: 24,
			marginRight: 24,
			...(matchesSmall ? {
				marginTop: 10
			} : {}),
			...(matchesLarge ? {
				flexBasis: "100%",
				flexGrow: 1,
				flexShrink: 1,
				marginLeft:  12,
				marginRight: 12,
				marginTop: 0,
				minWidth: 0
			} : {}),
			paddingTop: 24,
			paddingBottom: 24,
			paddingLeft: 0,
			paddingRight: 0,
			borderRadius: 8,
			width: "100%"
			
		}} >
			<header
				style={dir == "rtl" ? {
					paddingRight: 24,
					justifySelf: "center"
				} : {
					paddingLeft: 24,
					justifySelf: "center"
				}}
			>
				<section style={{
					display: "flex", 
					alignItems: "center",
					justifyContent: "center"
				}}>
					{/* <h2 style={{ fontSize: 24, marginBottom: 12 }}>
						{headerTitle}
					</h2> */}
					<div style={{color: "white", fontSize: 24, marginBottom: 12}}>{headerTitle}</div>

				</section>

				<section style={{
					display: "flex", 
					alignItems: "center",
					justifyContent: "center"
				}}>
					<p style={{
						justifySelf: "center",
						marginBottom: 0,
						fontSize: 14 
					}}  className="b2-dark-gray">
						{headerDescription}
					</p>
				</section>
			</header>
			
		</Container>
	);
};

HeaderContainer.defaultProps = defaultProps;
HeaderContainer.propTypes = propTypes;
export default memo(HeaderContainer);