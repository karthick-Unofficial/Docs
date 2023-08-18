import React, { Fragment, memo, useCallback, useState, useEffect, useRef } from "react";
import { default as BerthRow } from "./BerthRow/BerthRowContainer";
import PropTypes from "prop-types";
import {
	Button,
	Fab,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Dialog } from "orion-components/CBComponents";
import isEqual from "react-fast-compare";

const propTypes = {
	addBerthGroup: PropTypes.func.isRequired,
	berths: PropTypes.array.isRequired,
	deleteBerthGroup: PropTypes.func.isRequired,
	group: PropTypes.object.isRequired,
	saved: PropTypes.bool.isRequired,
	updateBerthGroup: PropTypes.func.isRequired,
	canManage: PropTypes.bool.isRequired
};

const BerthForm = ({
	addBerthGroup,
	berths,
	deleteBerthGroup,
	group,
	saved,
	updateBerthGroup,
	canManage
}) => {
	const berthsRef = useRef(berths);

	if (!isEqual(berthsRef.current, berths)) {
		berthsRef.current = berths;
	}

	useEffect(() => {
		setGroupData(group);
		setBerthData(berths);
	}, [berthsRef.current, group]);
	const [berthData, setBerthData] = useState(berths);
	const [groupData, setGroupData] = useState(group);
	const [dialogOpen, setDialogOpen] = useState(false);
	const { id, name } = groupData;
	const handleAddBerth = () => {
		const newBerth = {
			id: `${group.id}-${berthData.length}`, // Temporary ID until save
			beginningFootmark: 0,
			endFootmark: 0,
			name: "",
			shapeId: ""
		};
		setBerthData([newBerth, ...berthData]);
	};
	const handleChange = e => {
		setGroupData({ ...groupData, name: e.target.value });
	};
	const handleSave = () => {
		if (!saved) {
			addBerthGroup(name);
		} else {
			updateBerthGroup(id, groupData);
		}
	};
	const handleRemoveBerth = useCallback(
		id => {
			setBerthData(berthData.filter(berth => berth.id !== id));
		},
		[berthData]
	);
	const handleStageDelete = () => {
		setDialogOpen(true);
	};
	const handleDelete = () => {
		deleteBerthGroup(id, berths);
		setDialogOpen(false);
	};
	return (
		<Fragment>
			<div
				style={{ paddingTop: 24, borderBottom: "1px solid #ffffff1f" }}
				key={group.id}
			>	
				<Fragment>
					<div style={{ display: "flex", alignItems: "flex-end" }}>
						{canManage ? (
							<TextField
								id="berth-group"
								label="Berth Group"
								value={groupData.name}
								onChange={handleChange}
							/>
						) : (
							<p
								style={{
									fontSize: "1rem"
								}}
							>
								{groupData.name}
							</p>
						)}
						{saved && canManage ? (
							<Button
								onClick={handleStageDelete}
								style={{ color: "#E85858", textTransform: "none" }}
							>
								Delete
							</Button>
						) : (
							null
						)}
						{name !== group.name && canManage ? (
							<Button
								onClick={handleSave}
								color="primary"
								style={{ textTransform: "none" }}
							>
								Save
							</Button>
						) : (
							null
						)}
					</div>
					<div style={{ padding: "24px 0px 24px 0px" }}>
						<Table>
							{!!berthData.length && canManage ? (
								<TableHead>
									<TableRow style={{ height: "auto" }}>
										<TableCell>Berth Name*</TableCell>
										<TableCell>Zone*</TableCell>
										<TableCell>Beginning Footmark (ft)*</TableCell>
										<TableCell>End Footmark (ft)*</TableCell>
										<TableCell style={{ padding: "4px 0px 4px 12px" }}>
											Delete
										</TableCell>
									</TableRow>
								</TableHead>
							) : (
								<TableHead>
									<TableRow style={{ height: "auto" }}>
										<TableCell>Berth Name*</TableCell>
										<TableCell>Zone*</TableCell>
										<TableCell>Beginning Footmark (ft)*</TableCell>
										<TableCell>End Footmark (ft)*</TableCell>
									</TableRow>
								</TableHead>
							)}
							<TableBody>
								{berthData
									.sort((a, b) => {
										if (a.beginningFootmark < b.beginningFootmark) {
											return -1;
										}
										if (a.beginningFootmark > b.beginningFootmark) {
											return 1;
										}
										return 0;
									})
									.map(berth => {
										const { id } = berth;
										return (
											<BerthRow
												groupId={groupData.id}
												key={id}
												berth={berth}
												saved={!!berths.find(berth => berth.id === id)}
												removeBerth={handleRemoveBerth}
												berthMarks={berthData.map(berth => {
													const { beginningFootmark, endFootmark, id } = berth;
													return { min: beginningFootmark, max: endFootmark, id };
												})}
												canManage={canManage}
											/>
										);
									})}
							</TableBody>
						</Table>
						{name && saved && canManage ? (
							<div
								style={{
									marginTop: 24,
									display: "flex",
									alignItems: "center"
								}}
							>
								<Fab
									onClick={() => handleAddBerth(id)}
									style={{ height: 30, width: 30, minHeight: "unset" }}
									color="primary"
									size="small"
								>
									<Add fontSize="small" />
								</Fab>

								<Typography variant="body1" style={{ marginLeft: 8 }}>
									Add New Berth
								</Typography>
							</div>
						) : (
							null
						)}
					</div>
				</Fragment>
			</div>
			<Dialog
				open={dialogOpen}
				title="Delete Berth Group"
				textContent="Are you sure you want to delete this berth group? Doing so will delete all associated berths."
				confirm={{ label: "Confirm", action: handleDelete }}
				abort={{ label: "Cancel", action: () => setDialogOpen(false) }}
			/>
		</Fragment>
	);
};

BerthForm.propTypes = propTypes;

export default memo(BerthForm);
