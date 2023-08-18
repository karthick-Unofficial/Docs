import React from "react";
import PropTypes from "prop-types";
import { Drawer, Divider } from "@material-ui/core";
import TileOptionsContainer from "./TileOptions/TileOptionsContainer";
import LayerToggleContainer from "./LayerToggle/LayerToggleContainer";
import { getTranslation } from "orion-components/i18n/I18nContainer";


const propTypes = {
	closeSettingsMenu: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	baseMaps: PropTypes.array.isRequired,
	dir: PropTypes.string,
	nauticalChartsEnabled: PropTypes.bool,
	weatherEnabled: PropTypes.bool
};

const SettingsMenu = ({ closeSettingsMenu, open, baseMaps, dir, nauticalChartsEnabled, weatherEnabled }) => {

	return (
		<Drawer
			anchor={dir === "ltr" ? "left" : "right"}
			open={open}
			onClose={closeSettingsMenu}
			PaperProps={{ style: { width: 300, backgroundColor: "#1f1f21" } }}
		>
			<div style={{ margin: 16 }}>
				<TileOptionsContainer baseMaps={baseMaps} />
			</div>
			<Divider />
			<div style={{ margin: "0 16px" }}>
				<LayerToggleContainer label={getTranslation("settingsMenu.main.fieldLabel.mapLabels")} updateKey="entityLabels" dir={dir} />
			</div>
			<Divider />
			<div style={{ margin: "0 16px" }}>
				{!nauticalChartsEnabled ? null : <LayerToggleContainer
					label={getTranslation("settingsMenu.main.fieldLabel.nauticalChart")}
					updateKey="nauticalCharts"
					withOpacity={true}
					dir={dir}
				/>}
				<LayerToggleContainer
					label={getTranslation("settingsMenu.main.fieldLabel.roadsLabel")}
					updateKey="roadsAndLabels"
					withOpacity={true}
					dir={dir}
				/>
				{!weatherEnabled ? null : <LayerToggleContainer
					label={getTranslation("settingsMenu.main.fieldLabel.weatherRadar")}
					updateKey="weather"
					withOpacity={true}
					dir={dir}
				/>}
			</div>
		</Drawer>
	);
};

SettingsMenu.propTypes = propTypes;

export default SettingsMenu;
