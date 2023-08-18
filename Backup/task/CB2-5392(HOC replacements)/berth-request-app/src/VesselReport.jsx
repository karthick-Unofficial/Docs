import React, { memo } from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VesselReportForm from "./VesselReport/VesselReport";
import ErrorBoundary from "orion-components/ErrorBoundary";
import ConfigServiceContainer from "orion-components/Services/ConfigService/ConfigServiceContainer";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	id: PropTypes.string,
	vesselReportHeader: PropTypes.string,
	timezone: PropTypes.string,
	vesselReportManifestDisclaimer: PropTypes.string,
	vesselReportDisclaimer: PropTypes.string,
	dir: PropTypes.string
};

const defaultProps = {
	id: "",
	vesselReportHeader: null,
	timezone: "America/New_York"
};

const VesselReport = () => {
	const [configReady, setConfigReady] = useState(false);

	const id = useSelector(state => state.routing.locationBeforeTransitions.query.id);
	const vesselReportHeader = useSelector(state => state.clientConfig ? state.clientConfig.vesselReportHeader : null);
	const timezone = useSelector(state => state.clientConfig ? state.clientConfig.timezone : "America/New_York");
	const vesselReportManifestDisclaimer = useSelector(state => state.clientConfig ? state.clientConfig.vesselReportManifestDisclaimer : "");
	const vesselReportDisclaimer = useSelector(state => state.clientConfig ? state.clientConfig.vesselReportDisclaimer : "");
	const dir = useSelector(state => getDir(state));

	const styles = {
		wrapper: {
			position: "relative",
			width: "75%",
			margin: "auto",
			border: "1px solid black"
		}
	};

	return (
		<div style={{ overflow: "hidden" }}>
			<ConfigServiceContainer setReady={() => setConfigReady(true)} />
			<div style={styles.wrapper}>
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={true}
				/>

				{configReady && <ErrorBoundary>
					<VesselReportForm
						id={id}
						header={vesselReportHeader}
						timezone={timezone}
						vesselReportManifestDisclaimer={vesselReportManifestDisclaimer}
						vesselReportDisclaimer={vesselReportDisclaimer}
						dir={dir}
					/>
				</ErrorBoundary>
				}
			</div>
		</div>
	);
};

VesselReport.propTypes = propTypes;
VesselReport.defaultProps = defaultProps;

export default memo(VesselReport);
