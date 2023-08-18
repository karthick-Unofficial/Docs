import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
	Avatar,
	Button,
	Card,
	CardContent,
	Typography,
	useMediaQuery
} from "@mui/material";
import { Person, FileCopy } from "@mui/icons-material";
import { Translate } from "orion-components/i18n";

const propTypes = {
	index: PropTypes.number.isRequired,
	result: PropTypes.object.isRequired,
	dir: PropTypes.string
};

const PersonCard = ({ index, result, dir }) => {
	const [height, setHeight] = useState("auto");
	const isMobile = useMediaQuery("(max-width:700px)");
	useEffect(() => {
		const grid = document.getElementById(`grid-${index}`);
		if (grid) {
			setHeight(grid.clientHeight);
		}
	}, [index]);
	const { properties, imageSrc } = result;

	const handleCopy = () => {
		let textContent = "";
		if (imageSrc) {
			textContent += `Image: ${imageSrc}\n`;
		}
		properties.forEach(property => {
			const { label, value } = property;
			textContent += `${label}: ${value}\n`;
			navigator.permissions.query({ name: "clipboard-write" }).then(result => {
				if (result.state === "granted" || result.state === "prompt") {
					navigator.clipboard.writeText(textContent);
				}
			});
		});
	};

	const styles = {
		fileCopy: {
			...(dir === "rtl" && { marginLeft: 6, color: "#FFF" }),
			...(dir === "ltr" && { marginRight: 6, color: "#FFF" })
		}
	};

	return (
		<Card
			id={`card-${index}`}
			style={{
				backgroundColor: "#494d53",
				borderRadius: 4,
				display: "flex",
				flexDirection: isMobile ? "column" : "row",
				height: height,
				position: "relative"
			}}
		>
			<div
				style={{ display: "flex", flexDirection: "column", margin: "12px 0px" }}
			>
				<Button
					onClick={handleCopy}
					color="primary"
					style={{ textTransform: "none" }}
				>
					<FileCopy style={styles.fileCopy} />
					<Translate value="searchResults.personCard.copyResult" />
				</Button>
				{imageSrc ? (
					<div style={{ width: 100, margin: isMobile ? "12px auto" : 12 }}>
						<img style={{ width: "100%" }} src={imageSrc} />
					</div>
				) : (
					<Avatar
						style={{
							color: "#FFF",
							height: 100,
							width: 100,
							margin: isMobile ? "12px auto" : 12
						}}
					>
						<Person style={{ fontSize: 80 }} />
					</Avatar>
				)}
			</div>
			<CardContent
				style={{
					flex: "1 0 auto",
					display: "flex",
					flexDirection: "column",
					flexWrap: "wrap"
				}}
			>
				{properties
					.filter(property => property.value !== "")
					.map(property => {
						const { id, label, value } = property;
						return (
							<div key={id} style={{ display: "flex" }}>
								<Typography
									style={{ marginRight: 6 }}
									variant="body1"
								>{`${label}:`}</Typography>
								<Typography color="textSecondary" variant="body1">
									{value}
								</Typography>
							</div>
						);
					})}
			</CardContent>
		</Card>
	);
};

PersonCard.propTypes = propTypes;

export default memo(PersonCard);
