import React, { Fragment, useCallback } from "react";
import SpotlightChip from "./SpotlightChip";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actionCreators from "./spotlightChipsActions.js";
import { getDir } from "orion-components/i18n/Config/selector";
import { feedEntitiesWithGeoByTypeSelector } from "orion-components/GlobalData/Selectors";

const SpotlightChips = () => {
	const dispatch = useDispatch();

	const { removeSpotlight, setMapTools, setSpotlight } = actionCreators;
	const spotlights = useSelector((state) => state.spotlights);
	const mapTools = useSelector(
		(state) => state.mapState?.mapTools,
		shallowEqual
	);
	const user = useSelector(
		(state) => state.session?.user.profile,
		shallowEqual
	);
	const cameras = useSelector(
		(state) => feedEntitiesWithGeoByTypeSelector("camera")(state),
		shallowEqual
	);
	const dir = useSelector((state) => getDir(state));

	const handleClick = useCallback(
		({ id, spotlight }) => {
			const { type, feature } = mapTools;
			if (id) {
				dispatch(removeSpotlight(id));
			} else if (type === "spotlight") {
				dispatch(setSpotlight(feature));
				dispatch(setMapTools({ type: null }));
			} else {
				dispatch(
					setMapTools({
						type: "spotlight",
						mode: "spotlight_mode",
						feature: spotlight
					})
				);
			}
		},
		[mapTools]
	);

	return Object.values(spotlights).filter((spotlight) => !!spotlight)
		.length ? (
		<Fragment>
			{Object.values(spotlights)
				.filter((spotlight) => !!spotlight)
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
