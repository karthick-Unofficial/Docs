import React, { Fragment, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { memo } from "react";
import isEqual from "react-fast-compare";
import { Avatar } from "@mui/material";

const ImageFallBack = ({ user, avatarStyle, checkImageAvaiablity }) => {
	const { profileImage } = user;

	const [imgSrc, setImgSrc] = useState(null);
	const [imgError, setImgError] = useState(false);
	const [errorCount, setErrorCount] = useState(0);

	useEffect(() => {
		setImgSrc("/_download?handle=" + profileImage + "-thumbnail");
	}, [profileImage]);

	const fallbackImages = [
		"/_download?handle=" + profileImage + "-thumbnail",
		"/_download?handle=" + profileImage + "-thumbnail&timestamp=" + new Date().getTime(),
		"/_download?handle=" + profileImage
	];

	const handleImgError = () => {
		if (errorCount >= 2) {
			setImgSrc(null);
			setImgError(!imgError);
		} else {
			const currentSrc = imgSrc;
			const currentIndex = fallbackImages.findIndex((image, index) => {
				if (image === currentSrc) {
					return index;
				} else {
					return -1;
				}
			});
			if (currentIndex !== -1) {
				setImgSrc(fallbackImages[currentIndex + 1]);
				setErrorCount(errorCount + 1);
			}
		}
	};

	useEffect(() => {
		if (imgError && errorCount >= 2) {
			checkImageAvaiablity();
		}
	}, [errorCount, imgError]);

	return (
		<div>
			{imgSrc !== null && !imgError && (
				<Fragment>
					<img src={imgSrc} onError={handleImgError} style={{ display: "none" }} />
					<Avatar style={avatarStyle} src={imgSrc} />
				</Fragment>
			)}
			{imgError && <CircularProgress size={40} thickness={4} color="primary" />}
		</div>
	);
};

const shouldComponentUpdate = (prevProps, nextProps) => {
	return isEqual(prevProps, nextProps);
};

export default memo(ImageFallBack, shouldComponentUpdate);
