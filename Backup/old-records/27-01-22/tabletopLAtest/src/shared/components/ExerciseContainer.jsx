import React, { memo } from "react";
import { Container, useMediaQuery } from "@material-ui/core";
import PropTypes from "prop-types";
import { Translate } from "orion-components/i18n/I18nContainer";


const defaultProps = {
	children: [],
	headerTitle: <Translate value="shared.components.exerciseContainer.defaultHeader"/>,
	headerDescription: ""
};

const propTypes = {
	children: PropTypes.node,
	headerFullWidth: PropTypes.bool,
	headerTitle: PropTypes.string.isRequired,
	headerDescription: PropTypes.string.isRequired,
	headerOptionalSection: PropTypes.bool,
	dir: PropTypes.string

};

const ExerciseContainer = ({
	children,
	headerFullWidth,
	headerTitle,
	headerDescription,
	headerOptionalSection,
	dir
	
}) => {
	const matchesLarge = useMediaQuery("(max-width:1023px) and (min-width:720px), (min-width:1048px)");
	const matchesSmall = useMediaQuery("(min-width:600px)");
	return (
		<Container style={{
			position: "relative",
			marginTop: 8,
			marginLeft: 12,
			marginRight: 12,
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
			paddingTop:  24,
			paddingBottom: 24,
			paddingLeft:  0,
			paddingRight: 0,
			...(headerOptionalSection ? {
				paddingTop: 30
			} : {}),
			borderRadius: 8,
			width: "100%",
			backgroundColor: "#41454a"
		}}>
			{
				headerTitle && 
				<header
					style={dir == "rtl" ? {
						paddingRight: 24
					} : {
						paddingLeft: 24
					}}>
					<section style={{
						display: "flex", 
						...(headerOptionalSection ? {
							alignItems: "center"
						} : {})
					}}>
						<h3 style={{
							width: headerFullWidth ? "100%" : "53%", 
							...(headerOptionalSection ? {}
								: {marginBottom: 12})}}>
							{headerTitle}
						</h3>
						{headerOptionalSection}
					</section>
					<div className="b2-bright-gray">
						{headerDescription}
					</div>
				</header>
			}
			
			{children}
		</Container>
	);
};

ExerciseContainer.defaultProps = defaultProps;
ExerciseContainer.propTypes = propTypes;
export default memo(ExerciseContainer);