import React, { memo } from "react";
// router
import { useNavigate } from "react-router-dom";
//material ui
import {
	Container,
	Divider,
	IconButton
} from "@mui/material";

import { ArrowBack, ArrowForward } from "@mui/icons-material";

const defaultProps = {
	children: []
};
const EditPageTemplate = ({
	children,
	title,
	subTitle,
	dir
}) => {

	const navigate = useNavigate();

	const styles = {
		iconButton: {
			color: "white",
			...(dir && dir == "rtl" ? { marginLeft: 15 } : { marginRight: 15 })
		}
	};

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
						style={styles.iconButton}
						onClick={() => navigate(-1)}
					>
						{dir && dir === "rtl" ? <ArrowForward style={{ height: 32, width: 32 }} /> : <ArrowBack style={{ height: 32, width: 32 }} />}
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