import React from "react";
import SystemHealthCard from "./components/SystemHealthCard";
import ErrorCard from "./components/ErrorCard";
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const hasError = (errorFlag, health) => {
	if (errorFlag) {
		return true;
	} else if (health.hasOwnProperty("success") && !health.success) {
		return true;
	} else {
		return false;
	}
};

const SystemHealth = () => {
	const locale = useSelector(state => state.i18n.locale);
	const systemHealth = useSelector(state => state.systemHealth.health);
	const error = useSelector(state => hasError(state.systemHealth.hasApiError, state.systemHealth.health));
	const dir = useSelector(state => getDir(state));

	return (
		<div style={{ overflow: "scroll", height: "calc(100% - 80px)", width: "90%", margin: "auto" }}>
			<h3 style={{ fontFamily: "roboto", marginBottom: "15px", marginTop: "15px" }}><Translate value="global.dock.systemHealth.title" /></h3>
			{!error ? (
				Object.keys(systemHealth).map(key => {
					const health = systemHealth[key];
					return <SystemHealthCard
						key={key}
						title={health.label}
						hasError={health.error}
						healthSystems={health.systems}
						dir={dir}
						locale={locale}
					/>;
				})
			) : (
				<ErrorCard dir={dir} />
			)}
		</div>
	);
};

export default SystemHealth;