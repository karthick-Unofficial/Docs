import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	IconButton,
	Card,
	CardContent,
	Collapse,
	ListItem,
	ListItemText,
	Button
} from "@material-ui/core";
// import { ExpandMore, ExpandLess } from "@material-ui/icons";
import { Alert, Check } from "orion-components/CBComponents/Icons";
import SystemHealthItem from "./SystemHealthItem";
import { Translate, getTranslation } from "orion-components/i18n";

const propTypes = {
	title: PropTypes.string.isRequired,
	hasError: PropTypes.bool.isRequired,
	healthSystems: PropTypes.array,
	dir: PropTypes.string,
	locale: PropTypes.string
};

const defaultProps = {
	title: "",
	hasError: false,
	healthSystems: [],
	dir: "ltr",
	locale: "en"
};

const SystemHealthCard = ({ title, hasError, healthSystems, dir, locale }) => {
	const [expanded, setExpanded] = useState(false);

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	return (
		<Card
			style={{ borderRadius: "5px", marginBottom: 12, background: "transparent" }}
		>
			<ListItem style={{ backgroundColor: "#494d53" }}>
				<div style={{ padding: "12px" }}>
					{hasError ? <Alert /> : <Check />}
				</div>
				<ListItemText
					style={{ fontSize: "14px", color: "#FFF", textAlign: dir == "rtl" ? "right" : "left" }}
					primary={getTranslation(title)}
					primaryTypographyProps={{
						noWrap: true,
						variant: "body1"
					}}
				/>
				{healthSystems.length ? (
					<Button color="primary" variant="text" onClick={handleExpand} style={{ fontSize: "14px", textTransform: "lowercase", color: "#3faede" }}>
						{expanded ? <Translate value="global.dock.systemHealth.systemHealthCard.hide" /> : <Translate value="global.dock.systemHealth.systemHealthCard.more" />}
					</Button>
				) : null}
			</ListItem>
			<Collapse in={expanded}>
				<CardContent style={{ padding: dir && dir == "rtl" ? "0 50px 0 0" : "0 0 0 50px", backgroundColor: "#494d53" }}>
					{healthSystems.map((system, index) => {
						return (
							<div
								key={system.label}
								style={{
									lineHeight: "24px",
									padding: "5px 0 5px 0",
									...(index === healthSystems.length - 1 && { paddingBottom: "20px" })
								}}
							>
								<p style={{ color: "white", fontWeight: "bold" }}>{getTranslation(system.label)}</p>
								{system.checks.map(check => {
									return (
										<SystemHealthItem key={check.id} check={check} locale={locale} />
									);
								})}
								{index !== healthSystems.length - 1 && <hr style={{ width: "90%" }} />}
							</div>
						);
					})}
				</CardContent>
			</Collapse>
		</Card>
	);
};

SystemHealthCard.propTypes = propTypes;
SystemHealthCard.defaultProps = defaultProps;

export default SystemHealthCard;