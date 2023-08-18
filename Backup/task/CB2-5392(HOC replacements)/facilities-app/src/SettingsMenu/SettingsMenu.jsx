import React from "react";
import { Drawer, Divider } from "@material-ui/core";
import TileOptions from "./TileOptions/TileOptions";
import LayerToggle from "./LayerToggle/LayerToggle";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { closeSettingsMenu } from "./settingsMenuActions";


const SettingsMenu = () => {
	const open = useSelector(state => state.appState.settingsMenu.open);
	const baseMaps = useSelector(state => state.baseMaps);
	const clientConfig = useSelector(state => state.clientConfig);
	const { nauticalChartsEnabled, weatherEnabled } = _.size(clientConfig) && clientConfig.mapSettings;
	const dir = useSelector(state => getDir(state));
	const dispatch = useDispatch();

	const handleDrawerClose = () => {
		dispatch(closeSettingsMenu())
	}

	return (
		<Drawer
			anchor={dir === "ltr" ? "left" : "right"}
			open={open}
			onClose={handleDrawerClose}
			PaperProps={{ style: { width: 300, backgroundColor: "#1f1f21" } }}
		>
			<div style={{ margin: 16 }}>
				<TileOptions baseMaps={baseMaps} />
			</div>
			<Divider />
			<div style={{ margin: "0 16px" }}>
				<LayerToggle label={getTranslation("settingsMenu.main.fieldLabel.mapLabels")} updateKey="entityLabels" dir={dir} />
			</div>
			<Divider />
			<div style={{ margin: "0 16px" }}>
				{!nauticalChartsEnabled ? null : <LayerToggle
					label={getTranslation("settingsMenu.main.fieldLabel.nauticalChart")}
					updateKey="nauticalCharts"
					withOpacity={true}
					dir={dir}
				/>}
				<LayerToggle
					label={getTranslation("settingsMenu.main.fieldLabel.roadsLabel")}
					updateKey="roadsAndLabels"
					withOpacity={true}
					dir={dir}
				/>
				{!weatherEnabled ? null : <LayerToggle
					label={getTranslation("settingsMenu.main.fieldLabel.weatherRadar")}
					updateKey="weather"
					withOpacity={true}
					dir={dir}
				/>}
			</div>
		</Drawer>
	);
};

export default SettingsMenu;
