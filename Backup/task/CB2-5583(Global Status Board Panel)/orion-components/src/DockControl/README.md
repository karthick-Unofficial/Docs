[TOC]

# DockControl

## Overview

DockControl consists of a slide-out panel and associated controls as well as an optional second panel that slides
out from the first. It is featured most prominently as the ListPanel/EntityProfile in-app.

## Usage

As controlled component:

```
import { DockControl } from 'orion-components/DockControl';

<DockControl
    open={open} <-- Main panel isOpen flag
    styles={styles} <-- Styles that will be applied to the main panel element
    className={className} <-- Classname that will be added to the main panel element
    secondaryStyles={secondaryStyles} <-- Styles that will be applied to the secondary panel element
    secondaryPanelOpen={secondaryOpen} <-- Secondary panel isOpen flag
    onArrowClick={handleClick} <-- Left Chevron click callback
    onPanelClick={handlePanelClick} <-- First (default) button click callback
    actionButtons={actionButtons} <-- Array of action button react elements to be inserted after default button
    closeSecondary={handleCloseClick} <-- Close button click callback
>
    <ListPanel />   <-- First child will be the content of the main panel
    <EntityProfile />   <-- Second child will be the content of the secondary panel
</DockControl>
```

## Properties

open (bool) --
Whether the main panel is open. If true or false, the component is controlled and other properties must be passed in manually.
If null, the component is uncontrolled and manages its open/closed state and click handlers internally.

styles (object) --
Object of styles applied inline to the main panel element.

className (string) --
Classname applied to the main panel element.

secondaryClassName (string) --
Classname applied to the secondary panel element.

secondaryStyles (object) --
Object of styles applied inline to the secondary panel element.

secondaryPanelOpen (bool) --
Whether the secondary panel is open.

onArrowClick (func) --
Callback function executed on the chevron arrow click.

onPanelClick (func) --
Callback function executed on the default action button click.

actionButtons (arr) --
Array of react elements rendered in the control-sidebar after the first default button.

closeSecondary (func) --
Callback function executed on the secoundary panel's close button click.
