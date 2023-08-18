import React from "react";
import { Radio } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const DismissSettings = ({ dismissForOrg, handleDismissForOrg }) => {
	const dir = useSelector(state => getDir(state));

	const styles = {
		radioWrapper: {
			width: 50,
			padding: 3,
			alignSelf: "center",
			...(dir === "rtl" ? { marginLeft: "20px" } : { marginRight: "20px" })
		}
	};

	return (
		<div className="row">
			<div className="row-item fullwidth">
				<div className="rule-dismiss-settings-section">
					<div className="rule-dismiss-attribute">
						<div className="rule-dismiss-attribute-line">
							<div className="rulesRadio" style={styles.radioWrapper}>
								<Radio
									checked={dismissForOrg}
									style={{ padding: 0 }}
									onChange={() => handleDismissForOrg(true)}
								/>
							</div>
							<div>
								<div className="b1-white">
									<Translate value="createEditRule.components.dismissSettings.dismissAlertsForAll" />
								</div>
								<div className="b2-bright-gray">
									<br /><Translate value="createEditRule.components.dismissSettings.useForEntireOrg" />
								</div>
							</div>
						</div>
					</div>
					<div className="rule-dismiss-attribute">
						<div className="rule-dismiss-attribute-line">
							<div className="rulesRadio" style={styles.radioWrapper}>
								<Radio
									checked={!dismissForOrg}
									style={{ padding: 0 }}
									onChange={() => handleDismissForOrg(false)}
								/>
							</div>
							<div>
								<div className="b1-white">
									<Translate value="createEditRule.components.dismissSettings.dismissAlertsUser" />
								</div>
								<div className="b2-bright-gray">
									<br /><Translate value="createEditRule.components.dismissSettings.useToSubscIndividually" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div >
	);
};

export default DismissSettings;