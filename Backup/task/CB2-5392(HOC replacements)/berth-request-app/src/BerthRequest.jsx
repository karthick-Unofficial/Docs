import React, { memo } from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BerthRequestForm from "./BerthRequestForm/BerthRequestForm";
import ErrorBoundary from "orion-components/ErrorBoundary";
import ConfigServiceContainer from "orion-components/Services/ConfigService/ConfigServiceContainer";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	berthRequestHeader: PropTypes.string,
	servicesConfig: PropTypes.array,
	notesEnabled: PropTypes.bool,
	cargoDirectionLevel: PropTypes.string,
	organizationId: PropTypes.string,
	imoRequired: PropTypes.bool,
	mmsiRequired: PropTypes.bool,
	requestingCompanyDisabled: PropTypes.bool,
	voyageNumberEnabled: PropTypes.bool.isRequired,
	voyageNumberRequired: PropTypes.bool,
	submitDialogProps: PropTypes.object,
	timeFormat: PropTypes.string,
	dir: PropTypes.string,
	locale: PropTypes.string
};

const defaultProps = {
	berthRequestHeader: null,
	locale: "en"
};

const BerthRequest = () => {
	const [configReady, setConfigReady] = useState(false);

	const berthRequestHeader = useSelector(state => state.clientConfig ? state.clientConfig.berthRequestHeader : null);
	const servicesConfig = useSelector(state => state.clientConfig ? state.clientConfig.servicesConfig : null);
	const notesDisabled = useSelector(state => state.clientConfig ? state.clientConfig.notesEnabled === false : false);
	const cargoDirectionLevel = useSelector(state => state.clientConfig ? state.clientConfig.cargoDirectionLevel : "assignment");
	const organizationId = useSelector(state => state.clientConfig ? state.clientConfig.organizationId : null);
	const imoRequired = useSelector(state => state.clientConfig ? state.clientConfig.imoRequired : false);
	const mmsiRequired = useSelector(state => state.clientConfig ? state.clientConfig.mmsiRequired : false);
	const requestingCompanyDisabled = useSelector(state => state.clientConfig && state.clientConfig.requestingCompany ? state.clientConfig.requestingCompany.enabled === false : false);
	const submitDialogProps = useSelector(state => state.clientConfig && state.clientConfig.submitDialog ? state.clientConfig.submitDialog : { enabled: false });
	const timeFormat = useSelector(state => state.clientConfig && state.clientConfig.timeFormat ? state.clientConfig.timeFormat : "12-hour");
	const notesEnabled = !notesDisabled;
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);

	let voyageNumberEnabled = false;
	let voyageNumberRequired = false;
	useSelector(state => {
		if (state.clientConfig.voyageNumber) {
			voyageNumberEnabled = Boolean(state.clientConfig.voyageNumber.enabled);
			voyageNumberRequired = Boolean(state.clientConfig.voyageNumber.required);
		}
	})
	const temp = [berthRequestHeader, servicesConfig, notesEnabled, cargoDirectionLevel, organizationId, imoRequired, mmsiRequired, requestingCompanyDisabled, voyageNumberEnabled, voyageNumberRequired, submitDialogProps, timeFormat, dir, locale];

	console.log("#berthReq", JSON.stringify(temp));
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
					<BerthRequestForm
						header={berthRequestHeader}
						servicesConfig={servicesConfig}
						notesEnabled={notesEnabled}
						cargoDirectionLevel={cargoDirectionLevel}
						organizationId={organizationId}
						imoRequired={imoRequired}
						mmsiRequired={mmsiRequired}
						requestingCompanyDisabled={requestingCompanyDisabled}
						voyageNumberEnabled={voyageNumberEnabled}
						voyageNumberRequired={voyageNumberRequired}
						submitDialogProps={submitDialogProps}
						timeFormat={timeFormat}
						dir={dir}
						locale={locale}
					/>
				</ErrorBoundary>
				}
			</div>
		</div>
	);
};

BerthRequest.propTypes = propTypes;
BerthRequest.defaultProps = defaultProps;

export default memo(BerthRequest);
