const facilitiesApp = {
    en: {
        appBar: {
            title: "Cameras"
        },
        drawingPanel: {
            cameraForm: {
                addCamera: "Add Camera to %{count}",
                cancel: "Cancel",
                save: "Save",
                cameras: "Cameras",
                noCameras: "No cameras available.",
                clickToPlaceCam: "Click on the map to place the camera"
            },
            facilityForm: {
                editFacility: "Edit Facility",
                createFacility: "Create Facility",
                cancel: "Cancel",
                save: "Save",
                fieldLabel: {
                    name: "Name",
                    desc: "Description"
                },
                clickToPlaceFac: "Click on the map to place the facility"
            },
            floorPlanForm: {
                editFloorPlan: "Edit Floor Plan",
                createFloorPlan: "Create Floor Plan",
                cancel: "Cancel",
                save: "Save",
                fieldLabel: {
                    name: "Name"
                },
                uploadFloorPlan: "Upload Floor Plan",
                delete: "Delete",
                dialog: {
                    confirmationText: "Are you sure you want to delete this floor plan? Any item placed on this floor plan will lose its location.",
                    confirm: "Confirm",
                    cancel: "Cancel"
                }
            }
        },
        facilityMap: {
            facilityMenu: {
                addNewFac: "Add new facility",
                editFacLocation: "Edit facility location",
                addFloorPlan: "Add floor plan",
                editFloorPlan: "Edit floor plan",
                addCamToFloor: "Add camera to floorplan"
            }
        },
        listPanel: {
            main: {
                newFac: "New Facility",
                importFac: "Import Facilities",
                myFac: "My Facilities",
                noFacAvail: "No facilities available. Click the + button above or on the map to add a facility.",
                fieldLabel: {
                    searchFac: "Search facilities..."
                }
            },
            importFac: {
                dialog: {
                    title: "Import Facilities",
                    uploadFile: "Upload Import File",
                    cancel: "Cancel",
                    close: "Close"
                },
                errorMessage: {
                    malformed: "ERROR: Facility object is malformed",
                    missingGeo: "ERROR: Facility geometry is missing",
                    missingName: "ERROR: Facility name is missing",
                    missingFloorPlanName: "ERROR: Floorplan name is missing",
                    missingFloorPlanGeo: "ERROR: Floorplan geometry is missing",
                    missingFloorPlanOrder: "ERROR: Floorplan order is missing",
                    missingFloorPlanImgName: "ERROR: Floorplan image name is missing in configuration",
                    imageNotFound: "ERROR: Floorplan image not found in tar"
                }
            }
        },
        settingsMenu: {
            main: {
                fieldLabel: {
                    mapLabels: "Map Labels",
                    nauticalChart: "Nautical Charts",
                    roadsLabel: "Roads and Labels",
                    weatherRadar: "Weather Radar"
                },
            },
            tileOptions: {
                baseMap: "BASE MAP"
            }
        }
    },
    ar: {
        appBar: {
            title: "الكاميرات"
        },
        drawingPanel: {
            cameraForm: {
                addCamera: "%{count} أضف الكاميرا إلى",
                cancel: "إلغاء",
                save: "حفظ",
                cameras: "الكاميرات",
                noCameras: "لا الكاميرات المتاحة.",
                clickToPlaceCam: "انقر على الخريطة لوضع الكاميرا"
            },
            facilityForm: {
                editFacility: "تحرير مرفق",
                createFacility: "إنشاء مرفق",
                cancel: "إلغاء",
                save: "حفظ",
                fieldLabel: {
                    name: "الاسم",
                    desc: "الوصف"
                },
                clickToPlaceFac: "انقر على الخريطة لوضع المرفق"
            },
            floorPlanForm: {
                editFloorPlan: "تحرير مخطط الطابق",
                createFloorPlan: "إنشاء مخطط الطابق",
                cancel: "إلغاء",
                save: "حفظ",
                fieldLabel: {
                    name: "الاسم"
                },
                uploadFloorPlan: "تحميل مخطط الطابق",
                delete: "حذف",
                dialog: {
                    confirmationText: "هل أنت متأكد أنك تريد حذف مخطط المبنى هذا؟ أي عنصر يتم وضعه في مخطط الطابق هذا سيفقد موقعه.",
                    confirm: "تأكيد",
                    cancel: "إلغاء"
                }
            }
        },
        facilityMap: {
            facilityMenu: {
                addNewFac: "إضافة منشأة جديدة",
                editFacLocation: "تحرير موقع المنشأة",
                addFloorPlan: "أضف مخطط المبنى",
                editFloorPlan: "تعديل مخطط الطابق",
                addCamToFloor: "أضف الكاميرا إلى مخطط الأرضية"
            }
        },
        listPanel: {
            main: {
                newFac: "منشأة جديدة",
                importFac: "تسهيلات الاستيراد",
                myFac: "مرافق بلدي",
                noFacAvail: "لا توجد مرافق متاحة. انقر فوق الزر + أعلاه أو على الخريطة لإضافة منشأة.",
                fieldLabel: {
                    searchFac: "تسهيلات البحث ..."
                }
            },
            importFac: {
                dialog: {
                    title: "تسهيلات الاستيراد",
                    uploadFile: "تحميل ملف الاستيراد",
                    cancel: "إلغاء",
                    close: "إغلاق"
                },
                errorMessage: {
                    malformed: "خطأ: كائن المنشأة مشوه",
                    missingGeo: "خطأ: هندسة المرفق مفقودة",
                    missingName: "خطأ: اسم المرفق مفقود",
                    missingFloorPlanName: "خطأ: اسم مخطط الطابق مفقود",
                    missingFloorPlanGeo: "خطأ: هندسة مخطط الطوابق مفقودة",
                    missingFloorPlanOrder: "خطأ: طلب مخطط الطابق مفقود",
                    missingFloorPlanImgName: "خطأ: اسم صورة مخطط الطابق مفقود في التكوين",
                    imageNotFound: "خطأ: لم يتم العثور على صورة مخطط الطابق في القطران"
                }
            }
        },
        settingsMenu: {
            main: {
                fieldLabel: {
                    mapLabels: "تسميات الخريطة",
                    nauticalChart: "مخططات بحرية",
                    roadsLabel: "الطرق ولتسميات",
                    weatherRadar: "رادار الطقس"
                },
            },
            tileOptions: {
                baseMap: "الخريطة الأساسية"
            }
        }
    }
};

export default facilitiesApp;