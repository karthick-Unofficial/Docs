import React, { Fragment, useCallback } from "react";
import SpotlightChip from "./SpotlightChip";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./spotlightChipsActions.js";
import { cameraMapFeatures } from "orion-components/Map/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const SpotlightChips = () => {
	const dispatch = useDispatch();

	const { removeSpotlight, setMapTools, setSpotlight } = actionCreators;
	const spotlights = useSelector(state => state.spotlights);
	const mapState = useSelector(state => state.mapState);
	const session = useSelector(state => state.session);
	const user = session.user.profile;
	const cameras = useSelector(state => cameraMapFeatures(null)(state));
	const mapTools = mapState.mapTools;
	const dir = useSelector(state => getDir(state));

	const handleClick = useCallback(
		({ id, spotlight }) => {
			const { type, feature } = mapTools;
			if (id) {
				dispatch(removeSpotlight(id));
			} else if (type === "spotlight") {
				dispatch(setSpotlight(feature));
				dispatch(setMapTools({ type: null }));
			} else {
				dispatch(setMapTools({
					type: "spotlight",
					mode: "spotlight_mode",
					feature: spotlight
				}));
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
