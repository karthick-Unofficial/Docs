import React from "react";
import RadioButton from "material-ui/RadioButton/RadioButton";
import { Translate } from "orion-components/i18n";

const DismissSettings = ({ dismissForOrg, handleDismissForOrg }) => {

	return (
		<div className="row">
			<div className="row-item fullwidth">
				<div className="rule-dismiss-settings-section">
					<div className="rule-dismiss-attribute">
						<div className="rule-dismiss-attribute-line">
							<div style={{ width: 50, padding: 3, alignSelf: "center" }}>
								<RadioButton
									checked={dismissForOrg}
									style={{ width: "auto", minWidth: "150px" }}
									onClick={() => handleDismissForOrg(true)}
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
							<div style={{ width: 50, padding: 3, alignSelf: "center" }}>
								<RadioButton
									checked={!dismissForOrg}
									style={{ width: "auto", minWidth: "150px" }}
									onClick={() => handleDismissForOrg(false)}
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
		</div>
	);
};

export default DismissSettings;