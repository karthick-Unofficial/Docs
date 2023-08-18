import React, { Fragment, useCallback } from "react";
import SpotlightChip from "./SpotlightChip";

const SpotlightChips = ({
	spotlights,
	removeSpotlight,
	setMapTools,
	setSpotlight,
	mapTools,
	cameras,
	user,
	dir
}) => {
	const handleClick = useCallback(
		({ id, spotlight }) => {
			const { type, feature } = mapTools;
			if (id) {
				removeSpotlight(id);
			} else if (type === "spotlight") {
				setSpotlight(feature);
				setMapTools({ type: null });
			} else {
				setMapTools({
					type: "spotlight",
					mode: "spotlight_mode",
					feature: spotlight
				});
			}
		},
		[mapTools]
	);

	return Object.values(spotlights).filter(spotlight => !!spotlight).length ? (
		<Fragment>
			{Object.values(spotlights)
				.filter(spotlight => !!spotlight)
				.map((spotlight, index) => (
					<SpotlightChip
						key={spotlight.id}
						index={index}
						spotlight={spotlight}
						handleClick={handleClick}
						cameras={cameras}
						setSpotlight={setSpotlight}
						user={user}
						dir={dir}
					/>
				))}
		</Fragment>
	) : null;
};

export default SpotlightChips;
