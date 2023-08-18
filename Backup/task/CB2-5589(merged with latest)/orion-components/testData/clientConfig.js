"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.clientConfig = void 0;
var clientConfig = {
  agentOwner: {
    enabled: true,
    required: false
  },
  cargoDirectionLevel: "assignment",
  imoRequired: true,
  mapFeedIds: ["aishub"],
  mapInclusionZone: {
    coordinates: [[[-91.25138564076504, 30.4940252827664], [-91.1463635669389, 30.495258715463777], [-91.14410047863437, 30.36511827910914], [-91.25323442238617, 30.36413227285803], [-91.25138564076504, 30.4940252827664]]],
    type: "Polygon"
  },
  mapSettings: {
    AERIS_API_KEY: "break-key_cq4vb4g7DW4d3H6pbWGSG_Hc2AQ3xUuCjOoqJMahZuCeZfbKtoJFLbqPkt4M8n",
    center: [-98.2015, 39.4346],
    nauticalChartsEnabled: true,
    weatherEnabled: true,
    zoom: 3
  },
  requestingCompany: {
    enabled: true,
    required: false
  },
  servicesConfig: [{
    label: "Crew Change",
    property: "crewChange",
    subLabel: "Mark this for crew changes."
  }, {
    label: "Stores/Deliveries",
    property: "storesDeliveries",
    subLabel: ""
  }, {
    label: "Shore Cranes",
    property: "shoreCranes",
    subLabel: ""
  }, {
    label: "Inspection",
    property: "inspection",
    subLabel: ""
  }, {
    label: "Water Hookup",
    property: "waterHookup",
    subLabel: ""
  }, {
    label: "Security",
    property: "security",
    subLabel: ""
  }, {
    label: "Other",
    property: "other",
    subLabel: ""
  }],
  supportEmail: {
    address: "c2support@aressecuritycorp.com",
    body: "[Use this space to describe the issue you are experiencing.]",
    subject: "Avert C2 Support Issue"
  },
  voyageNumber: {
    enabled: true,
    required: true
  },
  apm: {
    active: false
  }
};
exports.clientConfig = clientConfig;