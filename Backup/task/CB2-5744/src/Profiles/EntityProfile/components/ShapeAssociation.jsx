import React from "react";
import PropTypes from "prop-types";

import { Dialog } from "../../../CBComponents";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const ShapeAssociation = ({ closeDialog, open, dialogData, dir }) => {
	const dispatch = useDispatch();

	const handleClose = () => {
		dispatch(closeDialog("shape-association"));
	};

	let rules;
	const styles = {
		body: {
			margin: "15px",
			...(dir === "ltr" && { textAlign: "left" }),
			...(dir === "rtl" && {
				textAlign: "right"
			})
		},
		rule: {
			paddingTop: "12px"
		}
	};

	// Prevent null pointer
	if (open) {
		rules = dialogData.rules;
	}

	return (
		<Dialog
			key="shape-association"
			open={open}
			confirm={{
				label: getTranslation(
					"global.profiles.entityProfile.shapeAssoc.ok"
				),
				action: handleClose
			}}
		>
			{open && dialogData.action === "delete" ? (
				<React.Fragment>
					<div className="cb-font-b3" style={styles.body}>
						<p style={{ fontWeight: "bold" }}>
							<Translate value="global.profiles.entityProfile.shapeAssoc.cannotDelete" />
						</p>
						{rules &&
							rules.map((item, idx) => {
								return (
									<p style={styles.rule} key={idx}>
										{item}
									</p>
								);
							})}
					</div>
				</React.Fragment>
			) : (
				<div />
			)}
			{open && dialogData.action === "hide" ? (
				<React.Fragment>
					<div className="cb-font-b3" style={styles.body}>
						<p style={{ fontWeight: "bold" }}>
							<Translate value="global.profiles.entityProfile.shapeAssoc.cannotBeHidden" />
						</p>
						{rules &&
							rules.map((item, idx) => {
								return (
									<p style={styles.rule} key={idx}>
										{item}
									</p>
								);
							})}
					</div>
				</React.Fragment>
			) : (
				<div />
			)}
		</Dialog>
	);
};

ShapeAssociation.propTypes = {
	dialog: PropTypes.string,
	dialogData: PropTypes.any
};

export default ShapeAssociation;
