import React, { Fragment, useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Popover, Typography, ListItemIcon, ListItemText, SvgIcon } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
	Video,
	Cctv,
	MapMarker,
	MapMarkerPath,
	VectorLine,
	Ferry,
	Car,
	Airplane,
	Account,
	HomeCity
} from "mdi-material-ui";
import NestedMenuItem from "./components/NestedMenuItem";
import ContextMenuItem from "./components/ContextMenuItem";
import CopyCoords from "./components/CopyCoords";
import { Translate, getTranslation } from "orion-components/i18n";
import { mdiAccessPoint } from "@mdi/js";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import includes from "lodash/includes";
import orderBy from "lodash/orderBy";
import isEqual from "lodash/isEqual";
import { persistedState } from "orion-components/AppState/Selectors";
import { getFacilities } from "orion-components/Map/Selectors";
import { userFeedsByTypeSelector } from "orion-components/GlobalData/Selectors";

const propTypes = {
	map: PropTypes.object.isRequired,
	children: PropTypes.array,
	contextMenuOpening: PropTypes.func,
	contextMenuClosing: PropTypes.func,
	close: PropTypes.bool,
	dir: PropTypes.string
};

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const useStyle = makeStyles({
	paper: {
		boxShadow: "rgb(0,0,0,0.7) -5px 5px 10px 0px"
	}
});

const config = {
	camera: {
		label: "Cameras",
		propertyName: "controls",
		types: [
			{
				propertyValue: "true",
				icon: Cctv
			},
			{
				propertyValue: "false",
				icon: Video
			}
		]
	},
	accessPoint: {
		label: "AccessPoints",
		propertyName: "entityType",
		types: [
			{
				propertyValue: "accessPoint",
				icon: mdiAccessPoint
			}
		]
	},
	facility: {
		label: "Facilities",
		propertyName: "entityType",
		types: [
			{
				propertyValue: "facility",
				icon: HomeCity
			}
		]
	},
	shapes: {
		label: "Shapes",
		propertyName: "type",
		types: [
			{
				propertyValue: "Point",
				icon: MapMarker
			},
			{
				propertyValue: "Line",
				icon: VectorLine
			},
			{
				propertyValue: "Polygon",
				icon: MapMarkerPath
			}
		]
	},
	track: {
		label: "Tracks",
		propertyName: "type",
		types: [
			{
				propertyValue: "track",
				icon: Ferry
			},
			{
				propertyValue: "vehicle",
				icon: Car
			},
			{
				propertyValue: "aircraft",
				icon: Airplane
			},
			{
				propertyValue: "Person",
				icon: Account
			}
		]
	}
};

const ContextMenu = ({
	map,
	children,
	contextMenuOpening,
	contextMenuClosing,
	close,
	replayMap,
	getInitialPlayBarData
}) => {
	const dispatch = useDispatch();
	const facilitiesRef = useRef(null);
	const selectedFloorsRef = useRef(null);

	const dir = useSelector((state) => getDir(state));
	const selectedFloors = useSelector((state) => persistedState(state)?.selectedFloors, isEqual);
	const facilityFeeds = useSelector((state) => userFeedsByTypeSelector("facility")(state));
	const facilities = useSelector((state) => {
		let feedEntities = {};
		facilityFeeds.map((feed) => {
			Object.assign(
				feedEntities,
				getFacilities(state)(state, { feedId: feed.feedId, replayMap, getInitialPlayBarData })
			);
		});
		return feedEntities;
	}, isEqual);

	const [anchorPosition, setAnchorPosition] = useState(null);

	// entities = { entityType1 : [Array of entities], entityType2: [Array of entities] }
	const [entities, setEntities] = useState({});

	const [lngLat, setLngLat] = useState(null);

	const classes = useStyle();

	let currentEntities;

	if (close && anchorPosition !== null) setAnchorPosition(null);

	useEffect(() => {
		facilitiesRef.current = facilities;
		selectedFloorsRef.current = selectedFloors;
	}, [facilities, selectedFloors]);

	const handleContextMenu = (e) => {
		setLngLat(e.lngLat);
		if (!validateFloorPlan(e.lngLat)) {
			const features = map.queryRenderedFeatures(e.point).filter((feature) => feature.source !== "composite");
			if (contextMenuOpening) contextMenuOpening(features, e.lngLat);
			e.preventDefault();
			setupEntities(features);
		}
		const { x, y } = e.point;
		setAnchorPosition({ top: y + 48, left: x });
	};

	const validateFloorPlan = (coords) => {
		currentEntities = {};
		let validation = false;
		if (selectedFloorsRef.current) {
			Object.values(selectedFloorsRef.current).forEach((floorPlan) => {
				if (floorPlan?.geometry) {
					const fpCoords = floorPlan.geometry.coordinates[0];
					const { facilityId } = floorPlan;
					const diagonalA = fpCoords[0];
					const diagonalB = fpCoords[2];
					const minX = diagonalA[0];
					const maxX = diagonalB[0];
					const minY = diagonalB[1];
					const maxY = diagonalA[1];

					if (coords.lng >= minX && coords.lng <= maxX && coords.lat >= minY && coords.lat <= maxY) {
						const filteredFacility = facilitiesRef.current[facilityId];
						const properties = filteredFacility.entityData.properties;
						properties.entityType = properties.entityType || filteredFacility.entityType;
						addEntity(properties);
						setEntities(currentEntities);
						validation = true;
					}
				}
			});
		}
		return validation;
	};

	const handleClose = useCallback(() => {
		setAnchorPosition(null);
		setEntities({});
		setLngLat(null);
		if (contextMenuClosing) contextMenuClosing();
	}, []);

	useEffect(() => {
		map.on("contextmenu", handleContextMenu);
		return () => {
			map.off("contextmenu", handleContextMenu);
			handleClose();
		};
	}, []);

	const setupEntities = (features) => {
		currentEntities = {};
		const clusters = [];

		features.forEach((feature) => {
			if (!includes(feature.layer.id, "-cluster-count")) {
				if (includes(feature.layer.id, "-clusters")) clusters.push(feature);
				else addEntity(feature.properties);
			}
		});

		clusters.forEach((cluster) => {
			const clusterId = cluster.properties.cluster_id,
				point_count = cluster.properties.point_count,
				clusterSource = map.getSource(cluster.layer.source);

			clusterSource.getClusterLeaves(clusterId, point_count, 0, function (err, clusterFeatures) {
				if (!err && clusterFeatures) clusterFeatures.map((f) => addEntity(f.properties));
				clusters.splice(clusters.indexOf(cluster), 1);
				if (!clusters.length) setEntities(currentEntities);
			});
		});

		if (!clusters.length) setEntities(currentEntities);
	};

	const addEntity = (entity) => {
		let entityType = entity.entityType;
		if (!entityType && entity.type) {
			const type = entity.type.toLowerCase();
			if (type === "point" || type === "line" || type === "polygon") entityType = "shapes";
		}

		if (entityType && config[entityType] && entity.type !== "FOV") {
			if (!currentEntities[entityType]) currentEntities[entityType] = [];
			// Have seen duplicate entities at time, hence checking to avoid duplication
			if (currentEntities[entityType].filter((e) => e.id === entity.id).length === 0)
				currentEntities[entityType].push(entity);
		}
	};

	const loadProfileForEntity = (entity) => {
		setAnchorPosition(null);
		dispatch(
			loadProfile(
				entity.id,
				entity.name ? entity.name : entity.id,
				entity.entityType || "shapes",
				"profile",
				"primary"
			)
		);
	};

	const getProfileItems = () => {
		return [...Object.keys(entities)].sort().map((entityType) => {
			return (
				<NestedMenuItem
					key={entityType}
					label={
						// eslint-disable-next-line no-constant-condition
						config[entityType].label == "Shapes" || "Tracks" || "Cameras" || "AccessPoints"
							? getTranslation(`global.map.contextMenu.main.${config[entityType].label}`)
							: config[entityType].label
					}
					parentMenuOpen={!!anchorPosition}
					dir={dir}
				>
					{orderBy(entities[entityType], ["name"], ["asc"]).map((entity) => {
						return (
							<ContextMenuItem key={entity.id} onClick={() => loadProfileForEntity(entity)}>
								<ListItemIcon
									style={{
										color: "#ffffff",
										minWidth: 42
									}}
								>
									{getIcon(entity, entityType)}
								</ListItemIcon>
								<ListItemText
									primary={entity.name}
									style={dir == "rtl" ? { textAlign: "right" } : {}}
								/>
							</ContextMenuItem>
						);
					})}
				</NestedMenuItem>
			);
		});
	};

	const getIcon = (entity, entityType) => {
		const propertyName = config[entityType].propertyName;
		let Icon = null;

		if (hasOwn(entity, propertyName)) {
			const propertyValue = entity[propertyName];
			config[entityType].types.forEach((t) => {
				if (t.propertyValue.toString().toLowerCase() === propertyValue.toString().toLowerCase()) Icon = t.icon;
			});
		}
		if (Icon) {
			if (entityType == "accessPoint") {
				return (
					<SvgIcon style={{ width: 34, height: 34, color: "#fff" }}>
						<path d={Icon} />
					</SvgIcon>
				);
			}
			return <Icon />;
		}
		return null;
	};

	const entitiesExist = Object.keys(entities).length > 0;

	return (
		<Fragment>
			<Popover
				open={!!anchorPosition}
				anchorReference="anchorPosition"
				anchorPosition={anchorPosition}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				onClose={handleClose}
				classes={{ paper: classes.paper }}
			>
				{/* Render App Menu Items if any */}
				{React.Children.map(children, (child) =>
					child && child !== null
						? React.cloneElement(child, { anchorPosition, closeContextMenu: handleClose })
						: null
				)}
				{lngLat && <CopyCoords lngLat={lngLat} coordsCopied={handleClose} />}
				{/* Divider if needed */}
				{children && entitiesExist && (
					<div
						style={{
							height: 1,
							width: "100%",
							backgroundColor: "#8b8d91"
						}}
					/>
				)}
				{getProfileItems()}
				{!children && !entitiesExist && (
					<Typography variant="body2" style={{ padding: "12px 16px" }}>
						<Translate value="global.map.contextMenu.main.noActions" />
					</Typography>
				)}
			</Popover>
		</Fragment>
	);
};

ContextMenu.propTypes = propTypes;

export default ContextMenu;
