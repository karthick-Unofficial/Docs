import React, { Fragment } from "react";
import DistanceChip from "./DistanceChip";

const DistanceChips = ({ distanceTool, deletePath, setActivePath, dir }) => {
	const { paths, activePath } = distanceTool;
	return Object.values(paths).length ? (
		<Fragment>
			{Object.values(paths).map(path => (
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
