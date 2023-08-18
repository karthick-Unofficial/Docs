const cameraWall = {
    en: {
        appBar: {
            title: "Camera Wall"
        },
        cameraWall: {
            cameraSlot: {
                cameraControls: {
                    hideControls: "Hide Controls",
                    showControls: "Show Controls"
                },
                emptySlot: {
                    placeholder: "Search for camera",
                    noResults: "No Results"
                }
            },
            toolBar: {
                edit: "Edit",
                save: "Save",
                pin: "Pin to My Items",
                copy: "Copy To My Camera Groups",
                copyDialog: {
                    create: "Create",
                    cancel: "Cancel",
                    fieldLabel: {
                        cameraGroup: "Camera Group Name"
                    }
                },
                editGroupDialog: {
                    title: "Are you sure you want to remove this group?",
                    textContent: "The saved group layout will be removed",
                    confirm: "Confirm",
                    save: "Save",
                    cancel: "Cancel",
                    removeCameraGrp: "Remove Camera Group",
                    fieldLabel: {
                        cameraGroup: "Camera Group Name"
                    }
                },
                newGroupDialog: {
                    save: "Save",
                    cancel: "Cancel",
                    fieldLabel: {
                        cameraGroup: "Camera Group Name"
                    }
                }
            }
        },
        listPanel: {
            newCamGroup: "New Camera Group",
            myCamGroups: "My Camera Groups",
            pinnedItems: "Pinned Items",
            noGroupText: "You currently have no camera groups. Click the button above to create a new one, or search for a contextual group.",
            cameraGroup: {
                cameraSingular: "%{count} Camera",
                cameraPlural: "%{count} Cameras"
            },
            pinnedItemJSX: {
                cameraSingular: "%{type} - %{count} Camera",
                cameraPlural: "%{type} - %{count} Cameras"
            },
            searchField: {
                search: "Search...",
                recentlySelected: "Recently Selected",
                noResults: "No Results"
            }
        }
    },
    ar: {
        appBar: {
            title: "جدار الكاميرا"
        },
        cameraWall: {
            cameraSlot: {
                cameraControls: {
                    hideControls: "إخفاء الضوابط",
                    showControls: "إظهار الضوابط"
                },
                emptySlot: {
                    placeholder: "البحث عن الكاميرا"
                }
            },
            toolBar: {
                edit: "تحرير",
                save: "حفظ",
                pin: "دبوس إلى البنود بلدي",
                copy: "نسخ إلى مجموعات الكاميرا الخاصة بي",
                copyDialog: {
                    create: "إنشاء",
                    cancel: "إلغاء",
                    fieldLabel: {
                        cameraGroup: "اسم مجموعة الكاميرا"
                    }
                },
                editGroupDialog: {
                    title: "هل أنت متأكد أنك تريد إزالة هذه المجموعة؟",
                    textContent: "ستتم إزالة تخطيط المجموعة المحفوظة",
                    confirm: "تأكيد",
                    save: "حفظ",
                    cancel: "إلغاء",
                    removeCameraGrp: "إزالة مجموعة الكاميرا",
                    fieldLabel: {
                        cameraGroup: "اسم مجموعة الكاميرا"
                    }
                },
                newGroupDialog: {
                    save: "حفظ",
                    cancel: "إلغاء",
                    fieldLabel: {
                        cameraGroup: "اسم مجموعة الكاميرا"
                    }
                }
            }
        },
        listPanel: {
            newCamGroup: "مجموعة الكاميرا الجديدة",
            myCamGroups: "مجموعات الكاميرا الخاصة بي",
            pinnedItems: "العناصر المثبتة",
            noGroupText: "ليس لديك حاليا أي مجموعات الكاميرا. انقر فوق الزر أعلاه لإنشاء مجموعة جديدة ، أو ابحث عن مجموعة سياقية.",
            cameraGroup: {
                cameraSingular: "%{count} الة تصوير",
                cameraPlural: "%{count} الكاميرات"
            },
            pinnedItemJSX: {
                cameraSingular: "%{type} - %{count} الة تصوير",
                cameraPlural: "%{type} - %{count} الكاميرات"
            },
            searchField: {
                search: "بحث...",
                recentlySelected: "تم تحديده مؤخرًا",
                noResults: "لا نتائج"
            }
        }
    }
};

export default cameraWall;