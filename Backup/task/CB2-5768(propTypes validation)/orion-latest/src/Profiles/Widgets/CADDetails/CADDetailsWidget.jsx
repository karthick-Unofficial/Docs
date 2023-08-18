import React from "react";
import { Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { teal } from "@mui/material/colors";
import { withStyles } from "@mui/styles";
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { getWidgetState } from "orion-components/Profiles/Selectors";

const materialStyles = (theme) => ({
	stepper: {
		padding: 10,
		paddingBottom: 57
	},
	icon: {
		backgroundColor: "white",
		color: "white !important",
		borderRadius: 12
	},
	label: {
		color: "white !important"
	},
	labelContainer: {
		position: "absolute",
		top: -25
	},
	iconContainer: {
		zIndex: 1,
		position: "absolute",
		top: 20
	},
	iconCompleted: {
		backgroundColor: `${teal["A400"]}`,
		color: `${teal["A400"]} !important`
	},
	iconActive: {
		backgroundColor: `${teal["A400"]}`,
		color: `${teal["A400"]} !important`
	},
	text: {
		display: "none"
	},
	connector: {
		top: 29,
		left: "-50%",
		right: "50%",
		"& $connectorLine": {
			borderColor: "white !important"
		}
	},
	lineHorizontal: {
		borderTopWidth: 6
	},
	connectorActive: {
		"& $connectorLine": {
			borderColor: `${teal["A400"]} !important`
		}
	},
	connectorCompleted: {
		"& $connectorLine": {
			borderColor: `${teal["A400"]} !important`
		}
	},
	connectorLine: {
		transition: theme.transitions.create("border-color")
	}
});

const CADDetailsWidget = ({ address, activeStep, steps, classes, id }) => {
	const order = useSelector((state) => getWidgetState(state)(id, "index"));
	const dir = useSelector((state) => getDir(state));

	const connector = (
		<StepConnector
			classes={{
				root: classes.connector,
				lineHorizontal: classes.lineHorizontal,
				active: classes.connectorActive,
				completed: classes.connectorCompleted,
				line: classes.connectorLine
			}}
		/>
	);

	const styles = {
		div: {
			display: "flex",
			fontSize: 13,
			fontColor: "white",
			paddingTop: 5,
			justifyContent: "space-between",
			...(dir === "ltr" && {
				paddingLeft: "3%",
				paddingRight: "7%"
			}),
			...(dir === "rtl" && {
				paddingRight: "3%",
				paddingLeft: "7%"
			})
		},
		addressLabel: {
			color: "white"
		},
		addressContent: {
			textAlign: "center",
			color: "white"
		}
	};
	return (
		<section className={`widget-wrapper cad-details-widget ${"index-" + order}`}>
			<div className="widget-header">
				<div className="cb-font-b2">
					<Translate value="global.profiles.widgets.CADDetails.title" />
				</div>
			</div>
			<div className="widget-content">
				{steps && (
					<Stepper
						classes={{ root: classes.stepper }}
						activeStep={activeStep}
						connector={connector}
						alternativeLabel
					>
						{steps.map((label, index) => {
							let completed = false;
							let active = false;

							if (index + 1 <= steps.length - 1) {
								completed = index + 1 <= activeStep ? true : false;
							} else if (index === steps.length - 1) {
								completed = index === activeStep ? true : false;
							}
							if (!completed) {
								active = index === activeStep ? true : false;
							}

							return (
								<Step completed={completed} active={active} key={label}>
									<StepLabel
										classes={{
											iconContainer: classes.iconContainer,
											label: classes.label,
											labelContainer: classes.labelContainer
										}}
										StepIconProps={{
											classes: {
												root: classes.icon,
												completed: classes.iconCompleted,
												active: classes.iconActive,
												text: classes.text
											}
										}}
									>
										{label}
									</StepLabel>
								</Step>
							);
						})}
					</Stepper>
				)}
				<div style={styles.div}>
					<span style={styles.addressLabel}>
						<Translate value="global.profiles.widgets.CADDetails.address" />
					</span>
					{address && <span style={styles.addressContent}>{address}</span>}
				</div>
			</div>
		</section>
	);
};

export default withStyles(materialStyles)(CADDetailsWidget);
