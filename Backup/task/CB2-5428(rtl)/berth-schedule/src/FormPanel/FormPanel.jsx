import React, { memo } from "react";
import { Drawer, useMediaQuery } from "@mui/material";
import AssignmentForm from "./AssignmentForm/AssignmentForm";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { closeEventForm } from "./formPanelActions";



const FormPanel = () => {
	const dispatch = useDispatch();

	const formPanel = useSelector(state => state.formPanel);
	const { open } = formPanel;
	const dir = useSelector(state => getDir(state));
	const { locale } = useSelector(state => state.i18n);

	const handleClose = () => {
		dispatch(closeEventForm());
	};
	const mobile = useMediaQuery("(max-width:700px)");
	return (
		<Drawer
			open={open}
			anchor={dir == "rtl" ? "left" : "right"}
			style={{
				width: mobile ? "100%" : 700,
				flexShrink: 0
			}}
			PaperProps={{
				style: {
					width: mobile ? "100%" : 700,
					height: "calc(100vh - 48px)",
					top: 48
				}
			}}
		>
			{open && <AssignmentForm handleClose={handleClose} dir={dir} locale={locale} />}
		</Drawer>
	);
};



export default memo(FormPanel);
