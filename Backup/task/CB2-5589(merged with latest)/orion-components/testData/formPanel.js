"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.formPanel = void 0;
var formPanel = {
  open: false,
  editing: false,
  data: {
    agent: {
      name: {
        firstName: "",
        lastName: ""
      },
      email: "",
      company: "",
      phone: ""
    },
    requestedBy: {
      company: "",
      name: {
        firstName: "",
        lastName: ""
      },
      email: "",
      phone: ""
    },
    vessel: {
      name: "",
      mmsid: "",
      imo: "",
      loa: 0,
      type: "",
      grt: 0,
      draft: 0
    },
    barges: [],
    cargo: [],
    schedule: {
      eta: null,
      etd: null,
      ata: null,
      atd: null
    },
    berth: {
      id: "",
      footmark: ""
    },
    approved: false,
    primaryActivity: {
      id: ""
    }
  },
  isGeneratingPdf: false,
  exportingError: null
};
exports.formPanel = formPanel;