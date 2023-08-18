import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "orion-components/CBComponents";
import { getIcon } from "orion-components/SharedComponents";
import DockItemLabel from "../../shared/components/DockItemLabel";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const HiddenEntityDialog = ({
	open,
	toggleDialog,
	unignoreEntities,
	exclusions
}) => {
	const dispatch = useDispatch();

	const [removalArray, setRemovalArray] = useState([]);
	const focusRef = useRef(0);

	const focusDiv = () => {
		if (open && focusRef.current) {
			focusRef.current.focus();
		} else {
			setTimeout(() => {
				focusDiv();
			}, 100);
		}
	};

	useEffect(() => {
		focusDiv();
	}, []);

	const handleRemoveMember = (id) => {
		if (removalArray.includes(id)) {
			setRemovalArray(removalArray.filter((item) => item.id === id));
		} else {
			const removeItems = [...removalArray, id];
			setRemovalArray(removeItems);
		}
	};

	const submit = () => {
		dispatch(unignoreEntities(removalArray));
		setRemovalArray([]);
		toggleDialog();
	};

	const close = () => {
		setRemovalArray([]);
		toggleDialog();
	};

	return (
		<Dialog
			open={open}
			title={getTranslation("listPanel.hiddenEntityDialog.title")}
			confirm={{
				label: getTranslation("listPanel.hiddenEntityDialog.save"),
				action: submit
			}}
			abort={{
				label: getTranslation("listPanel.hiddenEntityDialog.cancel"),
				action: close
			}}
		>
			<div
				className="hiddenEntityScroll scrollbar"
				tabIndex="0"
				ref={focusRef}
				style={{ width: "360px" }}
			>
				{exclusions
					.sort((a, b) => {
						if (a.name.toLowerCase() < b.name.toLowerCase())
							return -1;
						if (a.name.toLowerCase() > b.name.toLowerCase())
							return 1;
						return 0;
					})
					.map((item) => {
						return (
							<div
								className={`ec-dialog-item dockItem ${
									removalArray.includes(item.entityId)
										? "ec-remove"
										: "ec-keep"
								}`}
								key={item.entityId}
							>
								{getIcon(item.iconType)}
								<DockItemLabel
									primary={item.name}
									secondary={
										item.iconType ===
										("Emergent" || "Planned")
											? getTranslation(
													"listPanel.hiddenEntityDialog.event"
											  )
											: item.iconType
									}
								/>
								<i
									className="material-icons"
									onClick={() =>
										handleRemoveMember(item.entityId)
									}
								>
									{removalArray.includes(item.entityId)
										? "add_circle"
										: "cancel"}
								</i>
							</div>
						);
					})}
			</div>
		</Dialog>
	);
};
export default HiddenEntityDialog;
