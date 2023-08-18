import React, { useEffect, useRef, useState } from "react";
import { attachmentService } from "client-app-core";
import ReactQuill from "react-quill";
import {
	Dialog,
	SelectField,
	TextField,
	DatePicker,
	DateTimePicker,
	FileLink,
	CBCheckbox
} from "orion-components/CBComponents";
import {
	useMediaQuery,
	MenuItem,
	Button,
	FormLabel
} from "@mui/material";
import { withStyles, useTheme } from "@mui/styles";
import Dropzone from "react-dropzone";
import _ from "lodash";
import moment from "moment-timezone";
import { Translate, getTranslation } from "orion-components/i18n";



const styles = {
	text: {
		textTransform: "none",
		color: "#35b7f3",
		padding: 0,
		textAlign: "left",
		"&:hover": {
			backgroundColor: "transparent"
		},
		justifyContent: "flex-start"
	},
	textRTL: {
		textTransform: "none",
		color: "#35b7f3",
		padding: 0,
		textAlign: "right",
		"&:hover": {
			backgroundColor: "transparent"
		},
		justifyContent: "flex-start"
	}
};

const modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }],
		["bold", "italic", "underline", "strike"],
		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "+1" }
		],
		["link"],
		["clean"]
	]
};

const RowEdit = ({
	row,
	list,
	adding,
	lookupData,
	handleCloseDialog,
	dialogRef,
	updateList,
	user,
	timeFormatPreference,
	dir,
	locale,
	classes,
	dialog
}) => {
	const [attachments, setAttachments] = useState([]);
	const [newFiles, setNewFiles] = useState([]);
	const [deleted, setDeleted] = useState([]);
	const [state, setState] = useState({});
	const dropzone = useRef(null);
	const attachmentRef = useRef([]);

	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.only('xs'));

	useEffect(() => {
		if (row && !adding) {
			_.each(row.data, (item, key) => setState(initialState => ({ ...initialState, [key]: item })));
		}
		// Set default value in dialog if adding
		else {
			_.each(list.columns, column => {
				setState(initialState => ({ ...initialState, [column.id]: column.defaultValue }))
				if (column.type === "date-time") {
					setState(initialState => ({ ...initialState, [column.id]: new Date() }))
				}
			}
			);
		}

		if (row || adding) {
			// Pull all attachments from list
			attachmentService.subscribeByTarget(list.id, (err, response) => {
				if (err) console.log(err);
				if (response) {
					switch (response.type) {
						case "initial":
						case "add":
							attachmentRef.current = _.uniqBy(
								_.compact([...attachmentRef.current, response.new_val]),
								"id"
							);
							setAttachments(_.uniqBy(
								_.compact([...attachments, response.new_val]),
								"id"
							));
							break;
						case "remove":
							attachmentRef.current = _.filter(
								attachmentRef.current,
								attachment => attachment.fileId !== response.old_val.fileId
							);
							setAttachments(_.filter(
								attachments,
								attachment => attachment.fileId !== response.old_val.fileId
							));
							break;
						default:
							break;
					}
				}
			});
		}
	}, []);


	const handleChange = name => event => {
		let lookupName = "";
		const lookupType = list.columns.find(column => column.id === name).lookupType;
		if (lookupType && lookupData[lookupType] && event && event.target && event.target.hasOwnProperty("value")) {
			lookupName = lookupData[lookupType].find(data => data.id === event.target.value);
		}
		/**
		 * Date Picker event does not have target prop, returns a moment date object
		 * Checkbox event target uses checked prop instead of value
		 */
		const value =
			lookupName ? { id: lookupName.id, name: lookupName.name } :
				event && event.target && event.target.hasOwnProperty("value")
					? event.target.value
					: event && event.target && _.isBoolean(event.target.checked)
						? event.target.checked
						: event;
		
		setState(prevState => ({ ...prevState, [name]: value }));
	};

	const handleNotesChange = (column, text) => {
		setState(prevState => ({ ...prevState, [column]: text }));
	};

	const handleClose = () => {
		handleCloseDialog(dialogRef);
	};

	/**
	 * Remove files that have been added in this instance of the dialog being open
	 * Files must be attached in order to receive the correct data for rendering FileLink
	 */
	const handleCancel = () => {
		if (_.size(newFiles) > 0) {
			const removals = _.filter(attachmentRef.current, attachment =>
				_.includes(newFiles, attachment.fileId)
			);
			_.each(removals, file => handleDeleteFile(file.handle, file.fileId));
		}

		handleClose();
	};

	const handleConfirm = () => {
		let update;
		const newRow = {};
		const rows = list.rows ? [...list.rows] : [];

		// Confirm deletion of files that have been staged
		if (_.size(deleted) > 0) {
			const removals = _.filter(attachmentRef.current, attachment =>
				_.includes(deleted, attachment.fileId)
			);
			_.each(removals, file => handleDeleteFile(file.handle, file.fileId));
		}

		_.each(list.columns, column => {
			// Pull correct value from choice, checkbox, and date columns
			if (!column.id.includes("_user-completed") && !column.id.includes("_show-time")) {
				let value;
				switch (column.type) {
					case "choice":
						{
							const option = _.find(column.options, option => {
								return (
									option.id === state[column.id] ||
									option.value === state[column.id]
								);
							});
							value = option ? option.id : "";
						}
						break;
					case "checkbox": {
						const toggled = state[column.id];
						if (row && `${column.id}_user-completed` in row.data) {
							if (!toggled) {
								newRow[column.id + "_user-completed"] = "";
							} else {
								newRow[column.id + "_user-completed"] = user.name;
							}

						}
						if (row && `${column.id}_show-time` in row.data) {
							if (!toggled) {
								newRow[column.id + "_show-time"] = "";
							} else {
								newRow[column.id + "_show-time"] = moment();
							}

						}
						if (!row) {
							if (!toggled) {
								newRow[column.id + "_show-time"] = "";
								newRow[column.id + "_user-completed"] = "";
							} else {
								newRow[column.id + "_user-completed"] = user.name;
								newRow[column.id + "_show-time"] = moment();
							}
						}
						value = state[column.id];
					}
						break;
					default:
						value = state[column.id];
						break;
				}

				newRow[column.id] = value;
			}
			if (column.type === "date-time" && !column.forCheckBox) {

				setState(prevState => ({ ...prevState, [column.id]: moment(state[column.id]) }))
				newRow[column.id] = moment(state[column.id]);
			}
		});
		if (adding) {
			const rowOrders = _.map(rows, row => row.order);
			update = [
				...rows,
				{
					data: newRow,
					order: _.size(rowOrders) ? Math.max(...rowOrders) + 1 : 0,
					attachments: newFiles
				}
			];
		} else {
			const updateRow = _.find(
				rows,
				updateRow => updateRow.order === row.order
			);
			updateRow.data = newRow;

			update = rows;
		}

		updateList(list.id, { rows: update });
		handleClose();

	};

	const onDrop = acceptedFiles => {
		attachmentService.uploadFiles(list.id, "list", acceptedFiles).then(
			result => {
				const fileIds = [result.result.attachmentId];
				if (!adding) {
					const newRows = list.rows;
					const updateRow = _.find(
						newRows,
						updateRow => updateRow.order === row.order
					);
					updateRow.attachments = updateRow.attachments
						? [...updateRow.attachments, ...fileIds]
						: fileIds;
					updateList(list.id, { rows: newRows });
				}
				setNewFiles([...newFiles, ...fileIds]);
			},
			err => console.log(err)
		);
	};

	const handleAttachFile = () => {
		dropzone.current.open();
	};

	const getRowFields = () => {
		let fields = null;
		const columns = list.columns;
		const filteredColumns = columns.filter(column => !column.forCheckBox);
		fields = filteredColumns
			? _.map(filteredColumns, column => {
				const type = column.type;
				const options = column.options;
				const label = column.name;
				let value = state[column.id];
				const includeTime = column.includeTime;
				/**
					 * Values may be empty strings and potentially false
					 * Empty time values are null
					 */
				if (value !== undefined) {
					switch (type) {
						case "lookup":
							return (
								<SelectField
									id={column.id}
									key={column.id}
									label={label}
									handleChange={handleChange(column.id)}
									value={value && value.id ? value.id : ""}
									items={lookupData[column.lookupType]}
									dir={dir}
								/>

							);
						case "text":
							return (
								<TextField
									id={column.id}
									key={column.id}
									label={label}
									value={value}
									handleChange={handleChange(column.id)}
									required={column.required}
									autoFocus={label === "Item"}
									dir={dir}
								/>
							);
						case "choice": {
							const choice = _.find(
								options,
								option => option.value === value
							);
							return (
								<SelectField
									id={column.id}
									key={column.id}
									label={label}
									value={choice ? choice.id : value}
									items={options}
									handleChange={handleChange(column.id)}
									dir={dir}
								>
									<MenuItem value=""><Translate value="global.sharedComponents.rowEdit.none" /></MenuItem>
								</SelectField>
							);
						}
						case "checkbox":
							return (
								// Mimic other field margins
								<div
									id={column.id}
									key={column.id}
									style={{ marginTop: 16, marginBottom: 8 }}
								>
									<CBCheckbox
										label={column.name}
										checked={value}
										handleChange={handleChange(column.id)}
									/>
								</div>
							);
						// TODO: Add date format config
						case "date-time": {
							value = value === false ? new Date() : value;
							const format = timeFormatPreference ? `full_${timeFormatPreference}` : "full_12-hour";
							return !includeTime ? (
								<DatePicker
									id={column.id}
									key={column.id}
									label={label}
									value={value}
									handleChange={handleChange(column.id)}
									dir={dir}
									locale={locale}
									okLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.ok")}
									cancelLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}
									clearLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.clear")}
								/>
							) : (
								<DateTimePicker
									id={column.id}
									key={column.id}
									label={label}
									value={value}
									handleChange={handleChange(column.id)}
									format={format}
									dir={dir}
									locale={locale}
									okLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.ok")}
									cancelLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}
									clearLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.clear")}
								/>
							);
						}
						case "notes":
							return (
								<div style={{
									marginTop: 32,
									marginBottom: 8,
									position: "relative"
								}}>
									<FormLabel style={{
										top: 0,
										left: 0,
										position: "absolute",
										transform: "translate(0, -20.5px) scale(0.75)",
										transformOrigin: "top left",
										transition: "color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms"
									}}>
										{label}
									</FormLabel>
									<ReactQuill
										id={`${column.id}-notes-row`}
										value={value}
										theme={"snow"}
										style={{
											width: 700,
											overflowY: "scroll"
										}}
										formats={[
											"header",
											"font",
											"size",
											"bold",
											"italic",
											"underline",
											"strike",
											"blockquote",
											"list",
											"bullet",
											"indent",
											"link"
										]}
										modules={modules}
										onChange={(content, delta, source, editor) => {
											handleNotesChange(column.id, editor.getHTML());
										}}
									/>
								</div>

							);
						default:
							break;
					}
				}
			})
			: null;

		if (fields) return fields;
	};

	// Soft delete files (add to an array in component state) and wait for confirmation
	const handleSoftDelete = id => {
		setDeleted([...deleted, id]);
		setNewFiles([..._.pull(newFiles, id)]);
	};

	const handleDeleteFile = (handle, fileId) => {
		attachmentService.removeAttachment(list.id, "list", fileId, (err, response) => {
			if (err) console.log(err);
			else if (!adding) {
				const newRows = list.rows;
				const updateRow = _.find(
					newRows,
					updateRow => updateRow.order === row.order
				);
				updateRow.attachments = _.filter(
					updateRow.attachments,
					attachmentId => attachmentId !== fileId
				);
				updateList(list.id, { rows: newRows });
			}
		});
	};

	const hasNotes = list.columns.some(column => {
		return column.type === "notes";
	});
	const rCId = _.find(list.columns, column => column.required).id;
	const disabled = !state[rCId];
	const rowFileIds =
		row && row.attachments
			? [...row.attachments, ...newFiles]
			: [...newFiles];
	const rowAttachments = _.filter(attachmentRef.current, attachment =>
		_.includes(rowFileIds, attachment.fileId)
	);

	// Prevent Edit and Add dialog from rendering simultaneously
	return dialog === dialogRef ? (
		<Dialog
			key="list-manager"
			open={dialog === dialogRef}
			paperPropStyles={hasNotes ? { height: 650, maxWidth: 750, width: 750 } : {}}
			confirm={{
				label: getTranslation("global.sharedComponents.rowEdit.save"),
				action: handleConfirm,
				disabled
			}}
			abort={{ label: getTranslation("global.sharedComponents.rowEdit.cancel"), action: handleCancel }}
			dir={dir}
		>
			<div style={{ width: isXS ? "auto" : 350 }}>
				{getRowFields()}
				<div style={{ paddingTop: 24 }}>
					<Dropzone
						ref={dropzone}
						onDrop={onDrop}
						style={{ display: "none" }}
						multiple={false}
					/>
					<Button
						className={dir == "rtl" ? classes.textRTL : classes.text}
						style={{ paddingBottom: 24 }}
						variant="text"
						onClick={handleAttachFile}
						disableFocusRipple={true}
						disableRipple={true}
					>
						<Translate value="global.sharedComponents.rowEdit.addAttachments" />
					</Button>
					{_.map(
						_.filter(
							rowAttachments,
							attachment => !_.includes(deleted, attachment.fileId)
						),
						attachment => (
							<FileLink
								key={attachment.fileId}
								attachment={attachment}
								handleDeleteFile={handleSoftDelete}
								canEdit={true}
								dir={dir}
							/>
						)
					)}
				</div>
			</div>
		</Dialog >
	) : null;
};


export default withStyles(styles)(RowEdit);
