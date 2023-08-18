import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import includes from "lodash/includes";
import MapLayer from "../MapLayer/MapLayer";
import { userFeedsByTypeSelector } from "orion-components/GlobalData/Selectors";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

const propTypes = {
	activeFOVs: PropTypes.object,
	showAllFOVs: PropTypes.bool,
	activeFeeds: PropTypes.array,
	showFOVs: PropTypes.func,
	map: PropTypes.object
};

const FovLayers = ({
	activeFOVs,
	showAllFOVs,
	activeFeeds,
	showFOVs,
	map
}) => {
	const dispatch = useDispatch();

	const cameraFeeds = useSelector(state => userFeedsByTypeSelector("camera")(state), shallowEqual);
	const [initialShowDone, setInitialShowDone] = useState(false);

	// This should not be the responsibility of the FovLayers, it should be handled by the MapAppBar
	// Once the MapAppBar is refactored to be a functional component, this should be moved there.
	useEffect(() => {
		if (showAllFOVs && !initialShowDone && includes(activeFeeds, "cameras")) {
			dispatch(showFOVs(cameraFeeds));
			setInitialShowDone(true);
		}
	}, [showAllFOVs, initialShowDone, activeFeeds, showFOVs]);

	return (
		<Fragment>
			{
				activeFOVs && (
					<MapLayer map={map} feedId="fovs" cluster={false} />
				)
			}
		</Fragment>
	);
};

FovLayers.propTypes = propTypes;

export default FovLayers;