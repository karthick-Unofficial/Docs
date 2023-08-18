import React, { memo, useState } from "react";
import isEqual from "react-fast-compare";
// material-ui
import Avatar from "@mui/material/Avatar";

import ImageFallBack from "./ImageFallBack";

const UserAvatar = (props) => {
	const [imageFound, setImageFound] = useState(true);
	const { user, size, style } = props;
	const name = user.name;
	const getInitials = name.match(/\b(\w)/g);
	const initials = getInitials.slice(0, 2).join("");

	const avatarStyle = {
		height: size,
		width: size,
		backgroundColor: "#1F1F21",
		color: "white",
		...style
	};

	const imageNotFoundInMinio = () => {
		setImageFound(!imageFound);
	}

	return user.profileImage && imageFound ? (
		<ImageFallBack
			user={user}
			avatarStyle={avatarStyle}
			widthSize={size}
			heightSize={size}
			checkImageAvaiablity={imageNotFoundInMinio}
		/>
	) : (
		<Avatar style={avatarStyle}>{initials}</Avatar>
	);
};

const shouldComponentUpdate = (prevProps, nextProps) => {
	return isEqual(prevProps, nextProps);
};

export default memo(UserAvatar, shouldComponentUpdate);
