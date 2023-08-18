const statusBoard = {
    en: {
        appBar: {
            title: "Status Board"
        },
        listPanel: {
            main: {
                newCard: "New Status Card",
                organization: "Organization"
            },
            dialog: {
                save: "Save",
                cancel: "Cancel",
                fieldLabel: {
                    cardName: "Card Name",
                    cardType: "Card Type",
                    slides: "Slides",
                    text: "Text"
                }
            }
        },
        searchField: {
            searchStatusCard: "Search Status Cards..."
        },
        shared: {
            statusCard: {
                main: {
                    edit: "Edit",
                    sharedFrom: "Shared from",
                    changed: "Changed",
                    by: "by"
                },
                shareStatusCardDialog: {
                    title: "Share with Organizations",
                    save: "Save",
                    cancel: "Cancel",
                },
                StatusCardDialog: {
                    save: "Save",
                    cancel: "Cancel",
                    delete: "Delete",
                    fieldLabel: {
                        cardName: "Card Name"
                    },
                    editSlide: {
                        fieldLabel: {
                            text: "Text",
                            atleastOne: "Must have at least one slide"
                        },
                        newSlide: "New Slide"
                    },
                    editText: {
                        unordered: "unordered",
                        ordered: "ordered"
                    }
                },
                statusControls: {
                    selector: "Selector"
                }
            }
        }
    },
    ar: {
        appBar: {
            title: "مجلس الحالة"
        },
        listPanel: {
            main: {
                newCard: "بطاقة الحالة الجديدة",
                organization: "منظمة"
            },
            dialog: {
                save: "حفظ",
                cancel: "إلغاء",
                fieldLabel: {
                    cardName: "اسم البطاقة",
                    cardType: "نوع البطاقة",
                    slides: "الشرائح",
                    text: "نص"
                }
            }
        },
        searchField: {
            searchStatusCard: "بطاقات حالة البحث ..."
        },
        shared: {
            statusCard: {
                main: {
                    edit: "حرر",
                    sharedFrom: "مشترك من",
                    changed: "تغير",
                    by: "بواسطة"
                },
                shareStatusCardDialog: {
                    title: "شارك مع المنظمات",
                    save: "حفظ",
                    cancel: "إلغاء"
                },
                StatusCardDialog: {
                    save: "حفظ",
                    cancel: "إلغاء",
                    delete: "حذف",
                    fieldLabel: {
                        cardName: "اسم البطاقة"
                    },
                    editSlide: {
                        fieldLabel: {
                            text: "نص",
                            atleastOne: "يجب أن تحتوي على شريحة واحدة على الأقل"
                        },
                        newSlide: "شريحة جديدة"
                    },
                    editText: {
                        unordered: "غير مرتبة",
                        ordered: "أمر"
                    }
                },
                statusControls: {
                    selector: "محدد"
                }
            }
        }
    }
};

export default statusBoard;