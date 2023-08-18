const berthSchedule = {
    en: {
        appBar: {
            title: "Berth Schedule"
        },
        berthGroup: {
            berthTimeline: {
                noData: "No berth data available.",
                clickHere: "Click here",
                toManage: "to manage berths."
            }
        },
        berthSchedule: {
            noData: "No berth data available.",
            clickHere: "Click here",
            toManage: "to manage berths."
        },
        berthToolbar: {
            newEvent: "New Event",
            fieldLabel: {
                search: "Search",
            },
            btnLabel: {
                dailyAgendaList: "Daily Agenda List",
                berthSchedule: "Berth Schedule",
                hideMap: "Hide Berth Map",
                showMap: "Show Berth Map"
            }

        },
        dailyAgenda: {
            dailyAgendaTtl: "Daily Agenda",
            inPortVessel: "In-Port Vessels"
        },
        dateControls: {
            todayLbl: "Today"
        },
        formPanel: {
            assignmentForm: {
                assignmentTooltip: "Assignment Data Not Saved",
                buttonLabels: {
                    printExport: "Print/Export",
                    delete: "Delete",
                    cancel: "Cancel",
                    save: "Save",
                    approveBerth: "Approve Berth Request",
                    approvedBerth: "Berth Request Approved"
                }
            },
            agentInfo: {
                title: "Agent / Owner Information",
                fieldLabel: {
                    agentName: "Agent / Owner Name",
                    contactPersonName: "Contact Person Name",
                    contactPersonEmail: "Contact Person Email",
                    contactPersonPhone: "Contact Person Phone"
                }
            },
            bargeInfo: {
                title: "Barge Information",
                fieldLabel: {
                    bargeName: "Barge Name",
                    bargeIMO: "Barge IMO / Official Num",
                    bargeType: "Barge Type",
                    loa: "LOA (ft)",
                    grt: "GRT"
                },
                clickToAdd: "Click button to add barge information",
                addBargeBtn: "Add Barge"
            },
            cargoBerthAssg: {
                title: "Cargo and Berth Assignment",
                fieldLabel: {
                    berth: "Berth",
                    footmarkAssg: "Footmark Assignment",
                    footmark: "Footmark (ft)"
                },
                table: {
                    head: {
                        cargo: "Cargo",
                        direction: "Direction",
                        weight: "Weight (S/T)",
                        shipper: "Shipper / Receiver",
                        delete: "Delete"
                    }
                },
                helperText: {
                    mustBeNumber: "Footmark must be a number",
                    betweenValues: "Must be between %{value1} and %{value2}"
                },
                clickToAdd: "Click button to add cargo information",
                addCargoBtn: "Add Cargo"
            },
            notes: {
                title: "Additional Information",
                fieldLabel: {
                    additionalInfo: "Additional Information"
                }
            },
            requestingCompanyInfo: {
                title: "Requesting Company Information",
                fieldLabel: {
                    reqCompany: "Requesting Company",
                    contactPersonName: "Contact Person Name",
                    contactPersonEmail: "Contact Person Email",
                    contactPersonPhone: "Contact Person Phone"
                }
            },
            schedule: {
                title: "Schedule",
            },
            services: {
                title: "Services",
                fieldLabel: {
                    comments: "Comments"
                }
            },
            vesselInfo: {
                title: "Vessel Information",
                fieldLabel: {
                    inward: "Inward",
                    outward: "Outward",
                    vesselName: "Vessel or Tug Name",
                    officialNumber: "IMO / Official Number",
                    vesselType: "Vessel Type",
                    loa: "LOA (ft)",
                    draft: "Draft (ft)",
                    voyageNumber: "Voyage Number",
                    mmsiNumber: "MMSI Number",
                    primaryActivity: "Primary Vessel Activity"
                }
            }

        },
        groupSorter: {
            dialog: {
                ok: "OK",
                Cancel: "Cancel"
            }
        },
        lookupManager: {
            fieldLabel: {
                contactFields: {
                    companyName: "Company Name",
                    firstName: "First Name",
                    lastName: "Last Name",
                    email: "Email",
                    phone: "Phone",
                },
                vessel: {
                    name: "Name",
                    mmsiNumber: "MMSI Number",
                    imoNumber: "IMO / Official Number",
                    type: "Type",
                    loa: "LOA (ft)",
                    draft: "Draft (ft)"
                },
                barge: {
                    name: "Name",
                    imoNumber: "IMO / Official Number",
                    type: "Type",
                    loa: "LOA (ft)"
                },
                shipperReceiver: {
                    companyName: "Company Name"
                },
                vesselType: {
                    name: "Name"
                },
                vesselActivity: {
                    activity: "Activity"
                }
            },
            listItemText: {
                berthSettings: "Berth Settings",
                manage: "Manage",
                lookupTables: "Lookup Tables",
                vesselInfo: "Vessel Information",
                bargeInfo: "Barge Information",
                vesselType: "Vessel Type",
                vesselActivity: "Vessel Activity",
                agent: "Agent / Owner",
                requestor: "Requestor",
                shipperReceiver: "Shipper Receiver",
                stevedores: "Stevedores"
            },
            berthSettings: {
                title: "Berth Settings",
                addBerthGroup: "Add New Berth Group",
                berthForm: {
                    berthGroup: "Berth Group",
                    delete: "Delete",
                    save: "Save",
                    table: {
                        head: {
                            berthName: "Berth Name*",
                            zone: "Zone*",
                            beginingFT: "Beginning Footmark (ft)*",
                            endFT: "End Footmark (ft)*",
                            delete: "Delete"
                        }
                    },
                    addBerth: "Add New Berth",
                    dialog: {
                        title: "Delete Berth Group",
                        textContent: "Are you sure you want to delete this berth group? Doing so will delete all associated berths.",
                        confirmBtn: "Confirm",
                        cancelBtn: "Cancel"
                    }
                }
            },
            lookUp: {
                manageType: "Manage %{count}",
                addRecord: "Add New %{count} Record",
                searchBy: "Search by",
                requiredFields: "* Required fields",
                delete: "Delete"
            }
        },
        date: {
            long: "MMMM Do, YYYY",
            short: "MMM D YYYY"
        }
    },
    ar: {
        appBar: {
            title: "الجدول الزمني للرصيف"
        },
        berthGroup: {
            berthTimeline: {
                noData: "لا توجد بيانات متاحة عن الرصيف.",
                clickHere: "انقر هنا",
                toManage: "لإدارة berths"
            },
        },
        berthSchedule: {
            noData: "لا توجد بيانات متاحة عن الرصيف.",
            clickHere: "انقر هنا",
            toManage: "لإدارة berths"
        },
        berthToolbar: {
            newEvent: "حدث جديد",
            fieldLabel: {
                search: "بحث",
            },
            btnLabel: {
                dailyAgendaList: "قائمة الأجندة اليومية",
                berthSchedule: "الجدول الزمني للرصيف",
                hideMap: "إخفاء Berth خريطة",
                showMap: "عرض Berth خريطة"
            }

        },
        dailyAgenda: {
            dailyAgendaTtl: "الأجندة اليومية",
            inPortVessel: "السفن داخل الميناء"
        },
        dateControls: {
            todayLbl: "اليوم"
        },
        formPanel: {
            assignmentForm: {
                assignmentTooltip: "لم يتم حفظ بيانات الواجب",
                buttonLabels: {
                    printExport: "طباعة / تصدير",
                    delete: "حذف",
                    cancel: "إلغاء",
                    save: "حفظ",
                    approveBerth: "يوافق Berth طلب",
                    approvedBerth: "تمت الموافقة على الطلب Berth"
                }
            },
            agentInfo: {
                title: "معلومات الوكيل / المالك",
                fieldLabel: {
                    agentName: "الوكيل / اسم المالك",
                    contactPersonName: "اسم شخص الاتصال",
                    contactPersonEmail: "البريد الإلكتروني لشخص الاتصالl",
                    contactPersonPhone: "هاتف شخص الاتصال"
                }
            },
            bargeInfo: {
                title: "معلومات البارجة",
                fieldLabel: {
                    bargeName: "اسم البارجة",
                    bargeIMO: "Barge IMO / Official Num",
                    bargeType: "نوع البارجة",
                    loa: "LOA (قدم)",
                    grt: "GRT"
                },
                clickToAdd: "انقر فوق الزر لإضافة معلومات المداخلة",
                addBargeBtn: "إضافة بارج"
            },
            cargoBerthAssg: {
                title: "تخصيص البضائع والرصيف",
                fieldLabel: {
                    berth: "رصيف",
                    footmarkAssg: "احالة خط القدم",
                    footmark: "خط القدم (قدم)"
                },
                table: {
                    head: {
                        cargo: "البضائع",
                        direction: "الاتجاه",
                        weight: "الوزن (S / T)",
                        shipper: "الشاحن / المستقبل",
                        delete: "حذف"
                    }
                },
                helperText: {
                    mustBeNumber: "يجب أن يكون Footmark رقم",
                    betweenValues: "يجب ان يكون وسطا %{value1} و %{value2}"
                },
                clickToAdd: "انقر فوق الزر لإضافة معلومات الشحن",
                addCargoBtn: "أضف البضائع"
            },
            notes: {
                title: "معلومة اضافية",
                fieldLabel: {
                    additionalInfo: "معلومة اضافية"
                }
            },
            requestingCompanyInfo: {
                title: "طلب معلومات الشركة",
                fieldLabel: {
                    reqCompany: "الشركة الطالبة",
                    contactPersonName: "اسم شخص الاتصال",
                    contactPersonEmail: "البريد الإلكتروني لشخص الاتصالl",
                    contactPersonPhone: "هاتف شخص الاتصال"
                }
            },
            schedule: {
                title: "الجدول الزمني",
            },
            services: {
                title: "خدمات",
                fieldLabel: {
                    comments: "تعليقات"
                }
            },
            vesselInfo: {
                title: "معلومات السفينة",
                fieldLabel: {
                    inward: "إلى الداخل",
                    outward: "الخارج",
                    vesselName: "اسم السفينة أو القاطرة",
                    officialNumber: "IMO / الرقم الرسمي",
                    vesselType: "نوع السفينة",
                    loa: "LOA (قدم)",
                    draft: "المسودة (قدم)",
                    voyageNumber: "رقم الرحلة",
                    mmsiNumber: "رقم MMSI",
                    primaryActivity: "نشاط السفينة الأساسية"
                }
            }
        },
        groupSorter: {
            dialog: {
                ok: "حسنا",
                Cancel: "إلغاء"
            }
        },
        lookupManager: {
            fieldLabel: {
                contactFields: {
                    companyName: "اسم الشركة",
                    firstName: "الاسم الأول",
                    lastName: "اسم العائلة",
                    email: "بريد الالكتروني",
                    phone: "هاتف",
                },
                vessel: {
                    name: "الاسم",
                    mmsiNumber: "رقم MMSI",
                    imoNumber: "IMO / الرقم الرسمي",
                    type: "نوع",
                    loa: "LOA (قدم)",
                    draft: "المسودة (قدم)"
                },
                barge: {
                    name: "الاسم",
                    imoNumber: "IMO / الرقم الرسمي",
                    type: "نوع",
                    loa: "LOA (قدم)"
                },
                shipperReceiver: {
                    companyName: "اسم الشركة"
                },
                vesselType: {
                    name: "الاسم"
                },
                vesselActivity: {
                    activity: "نشاط"
                }
            },
            listItemText: {
                berthSettings: "إعدادات الرصيف",
                manage: "يدير",
                lookupTables: "جداول البحث",
                vesselInfo: "السفينة المعلومات",
                bargeInfo: "معلومات البارجة",
                vesselType: "نوع السفينة",
                vesselActivity: "نشاط السفينة",
                agent: "وكيل / مالك",
                requestor: "الطالب",
                shipperReceiver: "جهاز استقبال الشاحن",
                stevedores: "تحميل والتفريغ"
            },
            berthSettings: {
                title: "إعدادات الرصيف",
                addBerthGroup: "إضافة مجموعة مرسى جديد",
                berthForm: {
                    berthGroup: "مجموعة مرسى",
                    delete: "حذف",
                    save: "حفظ",
                    table: {
                        head: {
                            berthName: "اسم الرصيف *",
                            zone: "المنطقة*",
                            beginingFT: "بداية خط القدم (قدم) *",
                            endFT: "نهاية الحاشية (قدم) *",
                            delete: "حذف",
                        }
                    },
                    addBerth: "إضافة رصيف جديد",
                    dialog: {
                        title: "حذف مجموعة Berth",
                        textContent: "هل أنت متأكد أنك تريد حذف مجموعة الرصيف هذه؟ سيؤدي القيام بذلك إلى حذف جميع الولادات المرتبطة.",
                        confirmBtn: "تأكيد",
                        cancelBtn: "إلغاء"
                    }
                }
            },
            lookUp: {
                manageType: "%{count} يدير",
                addRecord: "يسجل %{count} اضف جديد",
                searchBy: "البحث عن طريق",
                requiredFields: "* الحقول المطلوبة",
                delete: "حذف"
            }
        },
        date: {
            long: "MMMM Do، YYYY",
            short: "MMM D، YYYY"
        }
    }
};

export default berthSchedule;