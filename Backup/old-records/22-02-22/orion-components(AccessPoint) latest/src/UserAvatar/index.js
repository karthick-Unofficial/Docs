import React, { Component } from "react";
import isEqual from "react-fast-compare";
// material-ui
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Img from "react-image";
// import { log, error } from "util";

class UserAvatar extends Component {

	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
		);
	}

	render () {
		const {
			user,
			size,
			style
		} = this.props;
		const name = user.name;
		const getInitials = name.match(/\b(\w)/g);
		const initials = getInitials.slice(0, 2).join("");

		const thumbHandle = user.profileImage + "-thumbnail";
		const fullsizeHandle = user.profileImage;
		const avatarStyle = {
			height: size,
			width: size,
			backgroundColor: "#1F1F21",
			color: "white",
			...style
		};
		return user.profileImage ? ( 
			<Img
				src={
					[
						`/_download?handle=${thumbHandle}`,
						"/_download?handle=" + user.profileImage + "-thumbnail&timestamp=" + new Date().getTime(),
						"/_download?handle=" + fullsizeHandle
					]
				}
				loader={
					<CircularProgress />
				}
				unloader={
					initials
				}
				height={size}
				width={size}
				container={
					children => {
						return ( 
							<Avatar 
								style={avatarStyle}
								children={children}
							/>
						);
					}
				}
			/>
		) : ( 
			<Avatar 
				style={avatarStyle}
			>
				{initials} 
			</Avatar>
		);
	}
}


export default UserAvatar;
