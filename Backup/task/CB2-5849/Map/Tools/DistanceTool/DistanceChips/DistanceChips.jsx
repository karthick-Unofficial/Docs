import React, { Fragment } from "react";
import DistanceChip from "./DistanceChip";
import { useSelector } from "react-redux";
import * as actionCreators from "./distanceChipsActions.js";
import { getDir } from "orion-components/i18n/Config/selector";

const DistanceChips = () => {
	const { deletePath, setActivePath } = actionCreators;

	const distanceTool = useSelector((state) => state.mapState.distanceTool);
	const dir = useSelector((state) => getDir(state));
	const { paths, activePath } = distanceTool;

	return Object.values(paths).length ? (
		<Fragment>
			{Object.values(paths).map((path) => (
				<DistanceChip
					key={path.id}
					path={path}
					activePath={activePath}
					deletePath={deletePath}
					setActivePath={setActivePath}
					dir={dir}
				/>
			))}
		</Fragment>
	) : null;
};

export default DistanceChips;
