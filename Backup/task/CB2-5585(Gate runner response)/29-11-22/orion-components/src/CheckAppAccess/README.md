[TOC]

## CheckAppAccess

## Overview

A configurable wrapper applied at an app's entry point to call ecosystem and check whether the user
has access to the given app.

## Usage

```
import AppContainer from './AppContainer';
import checkAppAccess from 'orion-components/CheckAppAccess';

const CheckAppContainer = checkAppAccess(AppContainer)('map-app');
```
The second applied parameter should match the app's appId.