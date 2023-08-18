import React, { memo } from "react";
import PropTypes from "prop-types";
import { Drawer } from "@material-ui/core";
import AssignmentForm from "./AssignmentForm/AssignmentForm";
import { useMediaQuery } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { closeEventForm } from "./formPanelActions";

const propTypes = {
	closeEventForm: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	dir: PropTypes.string,
	locale: PropTypes.string
};

const FormPanel = () => {
	const dispatch = useDispatch();

	const berths = useSelector(state => state.berths);
	const formPanel = useSelector(state => state.formPanel);
	const { data, editing, open, type } = formPanel;
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

FormPanel.propTypes = propTypes;

export default memo(FormPanel);
