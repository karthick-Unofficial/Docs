const berthRequest = {
    en: {
        berthRequestForm: {
            main: {
                title: {
                    agent: "Agent",
                    vesselInfo: "Vessel Information",
                    bargeInfo: "Barge Information",
                    schedule: "Schedule",
                    berth: "Berth",
                    requestedBy: "Requested By",
                    cargo: "Cargo",
                    services: "Services",
                    additionalInfo: "Additional Information"
                },
                fieldLabel: {
                    selectAgent: "Please select an Agent*",
                    agentName: "Agent Name*",
                    company: "Company",
                    agentEmail: "Agent Email*",
                    agentPhone: "Agent Phone",
                    inward: "Inward",
                    outward: "Outward",
                    vesselName: "Vessel or Tug Name",
                    imoNumber: "IMO / Official Number",
                    vesselType: "Vessel Type",
                    loa: "LOA (ft)",
                    draft: "Draft (ft)",
                    voyageNumber: "Voyage Number",
                    mmsiNumber: "MMSI Number",
                    primaryActivity: "Primary Vessel Activity",
                    berthName: "Berth Name",
                    selectRequestor: "Please select a Requester*",
                    requestedBy: "Requested By*",
                    company: "Company",
                    contactEmail: "Contact Email*",
                    contactPhone: "Contact Phone"
                },
                submitReq: "Submit Request",
                dialog: {
                    title: "Consent to the Terms of the Tariff (N) Item 107",
                    textContent: "The use of the facilities under the jurisdiction of the Galveston Wharves shall constitute a consent to the terms and conditions of this Tariff and evidences an agreement on the part of all vessels, their owners, agents and other “users” of such facilities to pay all charges specified in this Tariff, to be governed by all rules and regulations herein contained, to abide by the local rules and regulations as set forth by the Board of Trustees of the Galveston Wharves and to be responsible for the disciplining of any infractions thereof by such person and / or such firms and their employees, and all claims, damages …et. cetera.",
                    confirm: "Confirm",
                    cancel: "Cancel"
                }
            },
            bargeFields: {
                addBargeBtn: "Add Barge",
                fieldLabel: {
                    bargeName: "Barge Name",
                    bargeIMO: "Barge IMO / Official Num",
                    bargeType: "Barge Type",
                    loa: "LOA (ft)"
                }
            },
            cargoTable: {
                table: {
                    head: {
                        cargo: "Cargo*",
                        direction: "Direction",
                        weight: "Weight (Lb)",
                        shipper: "Shipper / Receiver",
                        delete: "Delete"
                    }
                },
                fieldLabel: {
                    inward: "Inward",
                    outward: "Outward"
                },
                addCargoBtn: "Add Cargo"
            },
            CBDialog: {
                confirmDel: "Confirm Delete",
            },
            notesField: {
                fieldLabel: {
                    additionalInfo: "Additional Information"
                }
            },
            servicesField: {
                comments: "Comments"
            },
            typeAhead: {
                noResults: "No Results"
            }
        },
        vesselReport: {
            main: {
                vesselReceived: "Thank you, your vessel report has been received.",
                vesselReport: "VESSEL REPORT",
                vesselManifest: "VESSEL MANIFEST",
                certifyStmt: "I hereby certify that the above statement is true and correct.",
                submitRequest: "Submit Request",
                fieldLabel: {
                    date: "Date:",
                    vessel: "Vessel:",
                    agent: "Agent:",
                    registryNum: "Registry No.:",
                    owner: "Owner:",
                    vesselType: "Vessel Type:",
                    steveadore: "Stevedore:",
                    berth: "Berth:",
                    length: "Length (in feet):",
                    arrivalDate: "Arrival Date:",
                    nationality: "Nationality/Flag:",
                    departureDate: "Departure Date:",
                    voyageNum: "Voyage Number:",
                    submittedBy: "Submitted by*:",
                    title: "Title*:",
                    phone: "Phone No.*:"
                }
            },
            vesselReportCargoTable: {
                table: {
                    head: {
                        totalCargoWeight: "TOTAL CARGO WEIGHT",
                        cargo: "Cargo",
                        inboundOutbound: "Inbound/Outbound",
                        weight: "Weight (Lb)",
                        delete: "Delete"
                    }
                },
                fieldLabel: {
                    inward: "Inward",
                    outward: "Outward"
                },
                totalPounds: "TOTAL POUNDS",
                addCargoBtn: "Add Cargo"
            }
        }
    },
    ar: {
        berthRequestForm: {
            main: {
                title: {
                    agent: "وكيلات",
                    vesselInfo: "معلومات السفينة",
                    bargeInfo: "معلومات البارجة",
                    schedule: "برنامج",
                    berth: "رصيف",
                    requestedBy: "طلب من قبل",
                    cargo: "البضائع",
                    services: "خدمات",
                    additionalInfo: "معلومة اضافية"
                },
                fieldLabel: {
                    selectAgent: "الرجاء تحديد وكيل *",
                    agentName: "اسم العميل*",
                    company: "شركة",
                    agentEmail: "البريد الإلكتروني للوكيل *",
                    agentPhone: "هاتف الوكيل",
                    inward: "إلى الداخل",
                    outward: "الخارج",
                    vesselName: "اسم السفينة أو القاطرة",
                    imoNumber: "IMO / الرقم الرسمي",
                    vesselType: "نوع السفينة",
                    loa: "LOA (قدم)",
                    draft: "المسودة (قدم)",
                    voyageNumber: "رقم الرحلة",
                    mmsiNumber: "رقم MMSI",
                    primaryActivity: "نشاط السفينة الأساسية",
                    berthName: "اسم الرصيف",
                    selectRequestor: "Please select a Requester*",
                    requestedBy: "طلب من قبل*",
                    company: "شركة",
                    contactEmail: "البريد الالكتروني*",
                    contactPhone: "هاتف الاتصال"
                },
                submitReq: "تقديم الطلب",
                dialog: {
                    title: "الموافقة على شروط التعرفة (ن) البند 107",
                    textContent: "يجب أن يشكل استخدام المرافق الخاضعة للولاية القضائية لـ Galveston Wharves موافقة على شروط وأحكام هذه التعريفة ويدل على وجود اتفاق من جانب جميع السفن ومالكيها ووكلائها و مستخدمي هذه المرافق الآخرين لدفع جميع الرسوم المحددة في هذه التعرفة ، يجب أن تحكمها جميع القواعد واللوائح الواردة في هذه الوثيقة ، للالتزام بالقواعد واللوائح المحلية على النحو المنصوص عليه من قبل مجلس أمناء Galveston Wharves وأن تكون مسؤولاً عن تأديب أي مخالفات لها من قبل هذه شخص و / أو هذه الشركات وموظفيها ، وجميع المطالبات والأضرار… وآخرون. cetera.",
                    confirm: "تأكيد",
                    cancel: "إلغاء"
                }
            },
            bargeFields: {
                addBargeBtn: "إضافة بارج",
                fieldLabel: {
                    bargeName: "اسم البارجة",
                    bargeIMO: "Barge IMO / Official Num",
                    bargeType: "نوع البارجة",
                    loa: "LOA (قدم)"
                }
            },
            cargoTable: {
                table: {
                    head: {
                        cargo: "الشحن *",
                        direction: "اتجاه",
                        weight: "الوزن (رطل)",
                        shipper: "الشاحن / المتلقي",
                        delete: "حذف"
                    }
                },
                fieldLabel: {
                    inward: "إلى الداخل",
                    outward: "الخارج"
                },
                addCargoBtn: "أضف البضائع"
            },
            CBDialog: {
                confirmDel: "تأكيد الحذف",
            },
            notesField: {
                fieldLabel: {
                    additionalInfo: "معلومة اضافية"
                }
            },
            servicesField: {
                comments: "تعليقات"
            },
            typeAhead: {
                noResults: "لا نتائج"
            }
        },
        vesselReport: {
            main: {
                vesselReceived: "شكرا لك ، لقد تم استلام تقرير سفينتك.",
                vesselReport: "تقرير السفينة",
                vesselManifest: "بيان السفينة",
                certifyStmt: "أقر بموجبه أن البيان أعلاه صحيح وصحيح.",
                submitRequest: "تقديم الطلب",
                fieldLabel: {
                    date: "تاريخ:",
                    vessel: "إناء:",
                    agent: "وكيلات:",
                    registryNum: "رقم التسجيل:",
                    owner: "صاحب:",
                    vesselType: "نوع السفينة:",
                    steveadore: "Stevedore:",
                    berth: "مرسى:",
                    length: "طول (قدم):",
                    arrivalDate: "تاريخ الوصول:",
                    nationality: "الجنسية / العلم:",
                    departureDate: "تاريخ المغادرة:",
                    voyageNum: "رقم الرحلة:",
                    submittedBy: "مقدم من *:",
                    title: "عنوان*:",
                    phone: "رقم الهاتف.*:"
                }
            },
            vesselReportCargoTable: {
                table: {
                    head: {
                        totalCargoWeight: "الوزن الإجمالي للبضائع",
                        cargo: "البضائع",
                        inboundOutbound: "واردة / صادرة",
                        weight: "الوزن (رطل)",
                        delete: "حذف"
                    }
                },
                fieldLabel: {
                    inward: "إلى الداخل",
                    outward: "الخارج"
                },
                totalPounds: "مجموع الجنيهات",
                addCargoBtn: "أضف البضائع"
            }
        }
    }
}