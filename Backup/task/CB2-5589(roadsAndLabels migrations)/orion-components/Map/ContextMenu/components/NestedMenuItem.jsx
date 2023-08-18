// This component has been derived from azmenak/material-ui-nested-menu-item
// (https://github.com/azmenak/material-ui-nested-menu-item) and adapted based on C2 requirements.
//
// The component has an MIT license as below:
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
// associated documentation files (the "Software"), to deal in the Software without restriction, 
// including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
// subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions 
// of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
// TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React, { useRef, useImperativeHandle, useState } from "react";
import { makeStyles } from "@mui/styles";
import Menu from "@mui/material/Menu";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import clsx from "clsx";
import ContextMenuItem from "./ContextMenuItem";

const useMenuStyles = makeStyles({
	root: (props) => ({
		backgroundColor: props.open ? "#2c2d2f" : "#494d53"
	}),
	gutters: {
		paddingRight: 11
	},
	paper: {
		boxShadow: "rgb(0,0,0,0.7) -5px 5px 10px 0px",
		backgroundColor: "#494d53"
	}
});

/**
 * Use as a drop-in replacement for `<MenuItem>` when you need to add cascading
 * menu elements as children to this component.
 */
const NestedMenuItem = React.forwardRef(function NestedMenuItem(props, ref) {
	const {
		parentMenuOpen,
		label,
		rightIcon = <ChevronRight />,
		leftIcon = <ChevronLeft />,
		children,
		className,
		tabIndex: tabIndexProp,
		ContainerProps: ContainerPropsProp = {},
		dir,
		...MenuItemProps
	} = props;

	const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;

	const menuItemRef = useRef(null);
	useImperativeHandle(ref, () => menuItemRef.current);

	const containerRef = useRef(null);
	useImperativeHandle(containerRefProp, () => containerRef.current);

	const menuContainerRef = useRef(null);

	const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

	const handleMouseEnter = (event) => {
		setIsSubMenuOpen(true);

		if (ContainerProps && ContainerProps.onMouseEnter) {
			ContainerProps.onMouseEnter(event);
		}
	};

	const handleMouseLeave = (event) => {
		setIsSubMenuOpen(false);

		if (ContainerProps && ContainerProps.onMouseLeave) {
			ContainerProps.onMouseLeave(event);
		}
	};

	// To address situations where the mouse is already on this menu item when the menu item is 
	// rendered because of which mouse enter would not get fired.
	const handleMouseMove = (event) => {
		if (!isSubMenuOpen) {
			setIsSubMenuOpen(true);

			if (ContainerProps && ContainerProps.onMouseEnter) {
				ContainerProps.onMouseEnter(event);
			}
		}
	};

	// Check if any immediate children are active
	const isSubmenuFocused = () => {
		let active = null;
		if (containerRef.current && containerRef.current.ownerDocument)
			active = containerRef.current.ownerDocument.activeElement;
		let children = [];
		if (menuContainerRef && menuContainerRef.current && menuContainerRef.current.children)
			children = menuContainerRef.current.children;
		for (const child of children) {
			if (child === active) {
				return true;
			}
		}
		return false;
	};

	const handleFocus = (event) => {
		if (event.target === containerRef.current) {
			setIsSubMenuOpen(true);
		}

		if (ContainerProps && ContainerProps.onFocus) {
			ContainerProps.onFocus(event);
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === "Escape") {
			return;
		}

		if (isSubmenuFocused()) {
			event.stopPropagation();
		}

		let active = null;
		if (containerRef.current && containerRef.current.ownerDocument)
			active = containerRef.current.ownerDocument.activeElement;

		if (event.key === "ArrowLeft" && isSubmenuFocused()) {
			if (containerRef.current)
				containerRef.current.focus();
		}

		if (event.key === "ArrowRight" &&
			event.target === containerRef.current &&
			event.target === active
		) {
			if (menuContainerRef && menuContainerRef.current && menuContainerRef.current.children)
				menuContainerRef.current.children[0].focus();
		}
	};

	const open = isSubMenuOpen && parentMenuOpen;
	const menuClasses = useMenuStyles({ open });

	// Root element must have a `tabIndex` attribute for keyboard navigation
	let tabIndex;
	if (!props.disabled) {
		tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
	}
	const style = {
		width: "100%",
		...(dir === "ltr" && { textAlign: "left" }),
		...(dir === "rtl" && { textAlign: "right" })
	};

	return (
		<div
			{...ContainerProps}
			ref={containerRef}
			onFocus={handleFocus}
			tabIndex={tabIndex}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
			onKeyDown={handleKeyDown}
		>
			<ContextMenuItem
				{...MenuItemProps}
				className={clsx(menuClasses.root, className)}
				classes={{ gutters: menuClasses.gutters }}
				ref={menuItemRef}
			>
				<span style={style}>{label}</span>
				{dir === "rtl" ? leftIcon : rightIcon}
			</ContextMenuItem>
			<Menu
				// Set pointer events to "none" to prevent the invisible Popover div
				// from capturing events for clicks and hovers
				style={{ pointerEvents: "none" }}
				anchorEl={menuItemRef.current}
				anchorOrigin={{
					horizontal: dir === "rtl" ? "left" : "right",
					vertical: "bottom"
				}}
				transformOrigin={{
					horizontal: dir === "rtl" ? "right" : "left",
					vertical: "top"
				}}
				open={open}
				autoFocus={false}
				disableAutoFocus
				disableEnforceFocus
				onClose={() => {
					setIsSubMenuOpen(false);
				}}
				classes={{ paper: menuClasses.paper }}
			>
				<div ref={menuContainerRef} style={{ pointerEvents: "auto", overflowY: "scroll", maxHeight: "calc(100vh - 96px)" }}>
					{children}
				</div>
			</Menu>
		</div>
	);
});

export default NestedMenuItem;