"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.appState = void 0;
var appState = {
  contextPanel: {
    contextPanelData: {
      primaryOpen: true,
      secondaryOpen: false,
      viewingHistory: [],
      selectedContext: {
        primary: null,
        secondary: null
      }
    },
    listPanel: {
      searchValue: "",
      searchResult: [],
      mapFilters: {},
      eventSearch: "",
      eventTemplateSearch: ""
    },
    profile: {
      selectedEntity: null
    }
  },
  errors: {
    newUserErrorMessage: null,
    passwordChangeError: null,
    shareDialogError: null,
    createOrgError: null
  },
  dialog: {
    openDialog: null,
    dialogData: null
  },
  dock: {
    dockData: {
      WavCam: {}
    },
    cameraDock: {
      dockedCameras: []
    }
  },
  loading: {
    profileLoading: false
  },
  sharingTokens: {
    enabled: true
  },
  viewing: {
    selectedEntity: {
      type: "org",
      id: "ares_security_corporation_f2de9e6b-7f8b-4de6-b1a7-b902e083e11b"
    }
  },
  persisted: {
    mapSettings: {
      entityLabelsVisible: true,
      mapCenter: [60.40602577561299, 37.28484233975651],
      mapStyle: "satellite",
      mapZoom: 2,
      nauticalChartsVisible: false,
      roadsVisible: true,
      weatherVisible: false
    },
    nauticalChartLayerOpacity: 1,
    roadAndLabelLayerOpacity: 1,
    undefined: {},
    weatherRadarLayerOpacity: 0.2,
    orderedGroups: []
  },
  global: {
    timeFormat: ""
  },
  mapRef: {
    entities: {}
  }
};
exports.appState = appState;