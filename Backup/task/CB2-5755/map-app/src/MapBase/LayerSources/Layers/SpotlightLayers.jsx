import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Spotlight } from "orion-components/Map/Layers";

const propTypes = {
	spotlights: PropTypes.object,
	mapTools: PropTypes.object
};

const SpotlightLayers = ({ spotlights, mapTools }) => {
	return (
		<Fragment>
			{Object.values(spotlights)
				.filter(
					(spotlight) =>
						!!spotlight &&
						(!mapTools.feature ||
							mapTools.feature.id !== spotlight.id)
				)
				.map((spotlight) => (
					<Spotlight key={spotlight.id} feature={spotlight} />
				))}
		</Fragment>
	);
};

SpotlightLayers.propTypes = propTypes;

export default SpotlightLayers;
