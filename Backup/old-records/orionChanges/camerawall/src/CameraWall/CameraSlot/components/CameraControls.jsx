import React, { Fragment, memo, useState } from "react";
import PropTypes from "prop-types";
import { PTZControls } from "orion-components/Profiles/Widgets";
import { Button, CardActions, Collapse } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	camera: PropTypes.object.isRequired,
	canControl: PropTypes.bool.isRequired
};

const CameraControls = ({ camera, canControl }) => {
	const [showControls, setShowControls] = useState(false);
	const enabled = camera.controls && canControl;
	const handleToggleControls = () => {
		setShowControls(!showControls);
	};
	return (
		<Fragment>
			<Collapse in={showControls}>
				<PTZControls dock={true} camera={camera} />
			</Collapse>

			<CardActions style={{ height: 48, padding: 0 }}>
				<Button
					disabled={!enabled}
					onClick={handleToggleControls}
					color="primary"
					style={{
						textTransform: "none",
						margin: "0px auto",
						visibility: enabled ? "visible" : "hidden"
					}}
				>
					{showControls ? <Translate value="cameraWall.cameraSlot.cameraControls.hideControls"/> : <Translate value="cameraWall.cameraSlot.cameraControls.showControls"/>}
				</Button>
			</CardActions>
		</Fragment>
	);
};

CameraControls.propTypes = propTypes;

export default memo(CameraControls);
