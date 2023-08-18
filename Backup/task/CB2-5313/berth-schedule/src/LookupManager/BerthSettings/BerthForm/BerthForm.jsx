import React, { Fragment, memo, useCallback, useState, useEffect, useRef } from "react";
import BerthRow from "./BerthRow/BerthRow";
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
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Dialog } from "orion-components/CBComponents";
import isEqual from "react-fast-compare";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { getBerthsByGroup } from "../../../selectors";
import { addBerthGroup, deleteBerthGroup, updateBerthGroup } from "./berthFormActions";



const BerthForm = (props) => {
	const {
		group,
		saved,
		canManage
	} = props;
	const dispatch = useDispatch();
	const berths = useSelector(state => getBerthsByGroup(state, props));
	const dir = useSelector(state => getDir(state));
	const styles = {
		tableCell: {
			...(dir === "rtl" && { textAlign: "right" }),
			color: "#fff",
			fontSize: "12px"
		}
	};

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
			dispatch(addBerthGroup(name));
		} else {
			dispatch(updateBerthGroup(id, groupData));
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
		dispatch(deleteBerthGroup(id, berths));
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
								variant="standard"
								label={getTranslation("lookupManager.berthSettings.berthForm.berthGroup")}
								value={groupData.name}
								onChange={handleChange}
								InputLabelProps={{
									style: {
										transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"),
										textAlign: (dir && dir == "rtl" ? "right" : "left"),
										right: (dir && dir == "rtl" ? 0 : "unset")
									}
								}}
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
								<Translate value="lookupManager.berthSettings.berthForm.delete" />
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
								<Translate value="lookupManager.berthSettings.berthForm.save" />
							</Button>
						) : (
							null
						)}
					</div>
					<div style={{ padding: "24px 0px 24px 0px" }}>
						<Table >
							{!!berthData.length && canManage ? (
								<TableHead style={{ borderBottom: "none" }} >
									<TableRow style={{ height: "auto" }}>
										<TableCell style={styles.tableCell}>
											<Translate value="lookupManager.berthSettings.berthForm.table.head.berthName" />
										</TableCell>
										<TableCell style={styles.tableCell}>
											<Translate value="lookupManager.berthSettings.berthForm.table.head.zone" />
										</TableCell>
										<TableCell style={styles.tableCell}>
											<Translate value="lookupManager.berthSettings.berthForm.table.head.beginingFT" />
										</TableCell>
										<TableCell style={styles.tableCell}>
											<Translate value="lookupManager.berthSettings.berthForm.table.head.endFT" />
										</TableCell>
										<TableCell style={dir == "rtl" ? { textAlign: "right", padding: "4px 0px 4px 12px", color: "#fff" }
											: { padding: "4px 0px 4px 12px", color: "#fff" }}>
											<Translate value="lookupManager.berthSettings.berthForm.table.head.delete" />
										</TableCell>
									</TableRow>
								</TableHead>
							) : (
								<TableHead>
									<TableRow style={{ height: "auto" }}>
										<TableCell style={styles.tableCell}>
											<Translate value="lookupManager.berthSettings.berthForm.table.head.berthName" />
										</TableCell>
										<TableCell style={styles.tableCell}>
											<Translate value="lookupManager.berthSettings.berthForm.table.head.zone" />
										</TableCell>
										<TableCell style={styles.tableCell}>
											<Translate value="lookupManager.berthSettings.berthForm.table.head.beginingFT" />
										</TableCell>
										<TableCell style={styles.tableCell}>
											<Translate value="lookupManager.berthSettings.berthForm.table.head.endFT" />
										</TableCell>
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
												dir={dir}
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

								<Typography variant="body1" style={dir == "rtl" ? { marginRight: 8 } : { marginLeft: 8 }}>
									<Translate value="lookupManager.berthSettings.berthForm.addBerth" />
								</Typography>
							</div>
						) : (
							null
						)}
					</div>
				</Fragment>
			</div >
			<Dialog
				open={dialogOpen}
				title={getTranslation("lookupManager.berthSettings.berthForm.dialog.title")}
				textContent={getTranslation("lookupManager.berthSettings.berthForm.dialog.textContent")}
				confirm={{ label: getTranslation("lookupManager.berthSettings.berthForm.dialog.confirmBtn"), action: handleDelete }}
				abort={{ label: getTranslation("lookupManager.berthSettings.berthForm.dialog.cancelBtn"), action: () => setDialogOpen(false) }}
				dir={dir}
			/>
		</Fragment >
	);
};



export default memo(BerthForm);
