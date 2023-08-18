import React from "react";
import PropTypes from "prop-types";
import { Drawer, Divider } from "@material-ui/core";
import TileOptionsContainer from "./TileOptions/TileOptionsContainer";
import LayerToggleContainer from "./LayerToggle/LayerToggleContainer";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const propTypes = {
	closeSettingsMenu: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	baseMaps: PropTypes.array.isRequired,
	dir: PropTypes.string
};

const SettingsMenu = ({ closeSettingsMenu, open, baseMaps, dir }) => {
	const textConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value} />);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};
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
				<LayerToggleContainer label={textConverter("settingsMenu.main.fieldLabel.mapLabels")} updateKey="entityLabels" dir={dir}/>
			</div>
			<Divider />
			<div style={{ margin: "0 16px" }}>
				<LayerToggleContainer
					label={textConverter("settingsMenu.main.fieldLabel.nauticalChart")}
					updateKey="nauticalCharts"
					withOpacity={true}
					dir={dir}
				/>
				<LayerToggleContainer
					label={textConverter("settingsMenu.main.fieldLabel.roadsLabel")}
					updateKey="roadsAndLabels"
					withOpacity={true}
					dir={dir}
				/>
				<LayerToggleContainer
					label={textConverter("settingsMenu.main.fieldLabel.weatherRadar")}
					updateKey="weather"
					withOpacity={true}
					dir={dir}
				/>
			</div>
		</Drawer>
	);
};

SettingsMenu.propTypes = propTypes;

export default SettingsMenu;
