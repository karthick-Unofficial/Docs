import React, { memo } from "react";
import PropTypes from "prop-types";
import { SearchSelectField } from "orion-components/CBComponents";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const propTypes = {
	addToWall: PropTypes.func.isRequired,
	cameras: PropTypes.object,
	canManage: PropTypes.bool,
	gridHeight: PropTypes.number,
	groupId: PropTypes.string,
	index: PropTypes.string.isRequired,
	readOnly: PropTypes.bool,
	addToGroup: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	cameras: {},
	group: null,
	gridHeight: null,
	readOnly: false
};

const EmptySlot = ({
	addToWall,
	cameras,
	canManage,
	groupId,
	gridHeight,
	index,
	readOnly,
	addToGroup,
	dir
}) => {
	const styles = {
		empty: {
			border: readOnly ? "none" : "2px dashed #41454a",
			padding: "0px 36px",
			height: gridHeight,
			width: "100%",
			display: "flex",
			alignItems: "center"
		}
	};
	const handleSelect = id => {
		if (!groupId) {
			addToWall(id, index);
		} else {
			addToGroup(groupId, index, id);
		}
	};
	const placeholderTxt = renderToStaticMarkup(<Translate value="cameraWall.cameraSlot.emptySlot.placeholder"/>);
	const noResultTxt = renderToStaticMarkup(<Translate value="cameraWall.cameraSlot.emptySlot.noResult"/>);
	let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
	let noResultString = noResultTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
	return (
		<div style={styles.empty}>
			{!readOnly && canManage && (
				<SearchSelectField
					closeOnSelect={true}
					id={index}
					items={cameras}
					handleSelect={handleSelect}
					placeholder={placeholderString}
					dir={dir}
					noResultString={noResultString}
				/>
			)}
		</div>
	);
};

EmptySlot.propTypes = propTypes;
EmptySlot.defaultProps = defaultProps;

export default memo(EmptySlot);
