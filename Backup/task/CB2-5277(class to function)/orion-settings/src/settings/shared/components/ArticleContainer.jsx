import React, { memo } from "react";
import { Container, useMediaQuery } from "@material-ui/core";
import {getTranslation} from "orion-components/i18n/I18nContainer";

const defaultProps = {
	children: [],
	headerTitle: getTranslation("mainContent.shared.articleContainer.defaultHeader"),
	headerDescription: ""
};

const ArticleContainer = ({
	editing,
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
			marginLeft: 24,
			marginRight: 24,
			...(matchesSmall ? {
				marginTop: 16
			} : {}),
			...(matchesLarge ? {
				flexBasis: "100%",
				flexGrow: 1,
				flexShrink: 1,
				marginLeft: editing ? "auto" : 12,
				marginRight: editing ? "auto" : 12,
				marginTop: 24,
				minWidth: 0
			} : {}),
			paddingTop: editing ? 40 : 24,
			paddingBottom: editing ? 40 : 24,
			paddingLeft: editing ? 40 : 0,
			paddingRight: editing ? 40 : 0,
			...(headerOptionalSection ? {
				paddingTop: 30
			} : {}),
			borderRadius: 8,
			width: "100%",
			backgroundColor: "#41454a",
			...(editing ? {
				maxWidth: 680
			} : {})
		}}>
			<header
				style={dir && dir == "rtl" ? {
					paddingRight: editing ? 0 : 24
				} : {
					paddingLeft: editing ? 0 : 24
				} }
			>
				<section style={{
					display: "flex", 
					...(headerOptionalSection ? {
						alignItems: "center"
					} : {})
				}}>
					<h3 style={{
						width: headerFullWidth ? "100%" : "53%", 
						...(headerOptionalSection ? {}
						 : {marginBottom: 12}) 
					}}>
						{headerTitle}
					</h3>
					{headerOptionalSection}
				</section>
				<div className="b2-bright-gray">
					{headerDescription}
				</div>
			</header>
			{children}
		</Container>
	);
};

ArticleContainer.defaultProps = defaultProps;
export default memo(ArticleContainer);