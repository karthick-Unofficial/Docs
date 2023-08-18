import React, { memo } from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VesselReportForm from "./VesselReport/VesselReport";
import ErrorBoundary from "orion-components/ErrorBoundary";
import ConfigService from "orion-components/Services/ConfigService/ConfigService";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { useSearchParams } from "react-router-dom";


const VesselReport = () => {
	const [configReady, setConfigReady] = useState(false);
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
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
			<ConfigService setReady={() => setConfigReady(true)} />
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


export default memo(VesselReport);
