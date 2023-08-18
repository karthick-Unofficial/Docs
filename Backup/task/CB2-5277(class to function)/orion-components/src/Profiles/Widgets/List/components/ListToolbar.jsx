import React, { Component } from "react";

import { FlatButton } from "material-ui";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import Toolbar from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import ActionDelete from "material-ui/svg-icons/action/delete";
import ActionDone from "material-ui/svg-icons/action/done";
import MoreVert from "material-ui/svg-icons/navigation/more-vert";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const DeleteMenu = props => {
	if (props.removing)
		return (
			<IconButton
				onClick={() => props.submitDeleteMode(props.listId)}
				style={{ height: "100%", padding: 0 }}
			>
				<ActionDelete color={"#6C6C6E"} />
			</IconButton>
		);
	else if (props.editableRow)
		return (
			<IconButton style={{ height: "100%" }}>
				<ActionDone onClick={props.submitAddRow} color={"#6C6C6E"} />
			</IconButton>
		);
	else if (props.canRemove && !props.editTitle)
		return (
			<IconMenu
				style={{ height: "100%" }}
				iconButtonElement={
					<IconButton style={{ height: "100%", padding: 0 }}>
						<MoreVert />
					</IconButton>
				}
				iconStyle={{ color: "#9C9DA1" }}
				anchorOrigin={{ horizontal: "right", vertical: "top" }}
				targetOrigin={{ horizontal: "right", vertical: "top" }}
				useLayerForClickAway={true}
			>
				<MenuItem
					primaryText={getTranslation("global.profiles.widgets.list.listToolbar.deleteList")}
					onClick={() => props.toggleDialog("deleteList" + props.listId)}
				/>
				<MenuItem
					primaryText={getTranslation("global.profiles.widgets.list.listToolbar.renameList")}
					onClick={() => props.toggleEditTitle()}
				/>
			</IconMenu>
		);
	else return <div />;
};

const EditMenu = props => {
	if (props.editableRow)
		return (
			<FlatButton label={getTranslation("global.profiles.widgets.list.listToolbar.cancel")} primary={true} onClick={props.cancelAddRow} />
		);
	else if (props.removing)
		return (
			<FlatButton
				label={getTranslation("global.profiles.widgets.list.listToolbar.cancel")}
				primary={true}
				onClick={props.cancelDeleteMode}
				style={{ marginTop: 1 }}
			/>
		);
	else if (props.editTitle)
		return (
			<React.Fragment>
				<FlatButton
					label={getTranslation("global.profiles.widgets.list.listToolbar.save")}
					labelStyle={{ padding: 0 }}
					style={{ width: "30%", minWidth: 0 }}
					primary={true}
					onClick={props.handleSaveNewTitle}
				/>
				<FlatButton
					label={getTranslation("global.profiles.widgets.list.listToolbar.cancel")}
					style={{ width: "70%", minWidth: 0 }}
					primary={true}
					onClick={props.handleCancelRename}
				/>
			</React.Fragment>
		);
	else
		return (
			<React.Fragment>
				<FlatButton
					label={getTranslation("global.profiles.widgets.list.listToolbar.add")}
					labelStyle={{ padding: 0 }}
					style={{ width: "30%", minWidth: 0 }}
					primary={true}
					onClick={() => props.toggleDialog("rowAdd" + props.listId)}
				/>
				<FlatButton
					label={getTranslation("global.profiles.widgets.list.listToolbar.remove")}
					style={{ width: "70%", minWidth: 0 }}
					primary={true}
					onClick={props.startDeleteMode}
				/>
			</React.Fragment>
		);
};

const ListToolbar = ({
	expanded,
	editableRow,
	removing,
	listStyle,
	canRemove,
	canEdit,
	toggleEditTitle,
	editTitle,
	handleCancelRename,
	handleSaveNewTitle,
	listId,
	dir,
	cancelAddRow,
	cancelDeleteMode,
	addRow,
	startDeleteMode,
	toggleDialog,
	submitDeleteMode,
	submitAddRow
}) => {

	return canEdit || canRemove ? (
		<div>
			<Toolbar
				style={{
					backgroundColor: expanded ? "#35383c" : "#2c2d2f",
					padding: "none",
					borderBottom: "1px solid #41454A",
					height: 40
				}}
			>
				<div className={listStyle.buttons} style={dir == "rtl" ? { paddingRight: 8 } : { paddingLeft: 8 }}>
					<div
						style={{ height: "100%", display: "flex", alignItems: "center" }}
					>
						<EditMenu
							editableRow={editableRow}
							removing={removing}
							// Methods
							cancelAddRow={cancelAddRow}
							cancelDeleteMode={cancelDeleteMode}
							addRow={addRow}
							startDeleteMode={startDeleteMode}
							editTitle={editTitle}
							handleCancelRename={handleCancelRename}
							handleSaveNewTitle={handleSaveNewTitle}
							toggleDialog={toggleDialog}
							listId={listId}
							dir={dir}
						/>
					</div>
				</div>
				<div className={listStyle.spacer} />
				<div>
					<DeleteMenu
						canRemove={canRemove}
						removing={removing}
						editableRow={editableRow}
						// Methods
						submitDeleteMode={submitDeleteMode}
						submitAddRow={submitAddRow}
						toggleDialog={toggleDialog}
						toggleEditTitle={toggleEditTitle}
						editTitle={editTitle}
						listId={listId}
					/>
				</div>
			</Toolbar>
		</div>
	) : null;
};

export default ListToolbar;
