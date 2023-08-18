import React from "react";
import SystemHealthCard from "./components/SystemHealthCard";
import ErrorCard from "./components/ErrorCard";
import { Translate } from "orion-components/i18n/I18nContainer";


const SystemHealth = ({systemHealth, error, dir}) => {
	return (
		<div style={{ overflow: "scroll", height: "calc(100% - 80px)", width: "90%", margin: "auto" }}>
			<h3 style={{fontFamily: "roboto", marginBottom: "15px", marginTop: "15px" }}><Translate value="global.dock.systemHealth.title"/></h3>
			{!error ? (
				Object.keys(systemHealth).map(key => {
					const health = systemHealth[key];
					return <SystemHealthCard 
						key={key}
						title={health.label} 
						hasError={health.error}
						healthSystems={health.systems}
						dir={dir}
					/>;
				})
			) : (
				<ErrorCard dir={dir}/>
			)}
		</div>
	);
};

export default SystemHealth;