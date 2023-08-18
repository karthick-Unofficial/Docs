const global = {
    en: {
        appMenu: {
            main: {
                settings: "Settings",
                support: "Support",
                home: "Home",
                ecoAdmin: "Ecosystem Administrator",
                orgAdmin: "Organization Administrator",
                logOut: "Log Out",
                emailSupport: "Email Support"
            }
        },
        CBComponents: {
            CBAppMenu: {
                logOut: "Log Out",
                settings: "Settings",
                support: "Support"
            },
            CBDialog: {
                confirmDelete: "Confirm Delete"
            },
            CBDock: {
                drawer: "DRAWER!"
            },
            CBFileLink: {
                downloadImg: "Download Image",
                dialog: {
                    title: "DELETE ATTACHMENT",
                    textContent: "Are you sure you want to delete this attachment?",
                    delete: "Delete",
                    cancel: "Cancel"
                }
            },
            CBList: {
                helpers: {
                    nameNotFound: "Name not found"
                }
            },
            CBNewWindow: {
                newWindow: "New Window"
            },
            CBSearchField: {
                searchField: {
                    clear: "(%{count}) Clear"
                },
                searchSelectField: {
                    noResults: "No Results"
                }
            },
            CBTable: {
                attachments: "Attachments",
                viewNotes: "View Notes",
                setNow: "Set Now"
            },
            icons: {
                target: {
                    targettingIcon: "targeting-icon"
                }
            },
            video: {
                videoPlayer: {
                    camInDock: "Camera in Dock",
                    camInModal: "Camera in Modal"
                },
                webRTCPlayer: {
                    unableToAccess: "Unable to access camera stream. The provided URL is invalid.",
                    camProblem: "The camera has encountered a problem."
                },
                wsImagePlayer: {
                    encounteredText: "The camera has encountered a problem."
                }
            }
        },
        contextPanel: {
            viewMap: "VIEW MAP",
            openProfile: "OPEN PROFILE",
            openListPanel: "OPEN LIST PANEL"
        },
        dock: {
            dockWrapper: {
                acknowledge: "Acknowledge",
                sessionExpired: "Session Expired",
                redirectLogin: "Your session has expired. You will be redirected to the login page.",
                ok: "OK",
                userAgreement: "User Agreement",
                accept: "Accept",
                decline: "Decline",
                alerts: "Alerts"
            },
            cameras: {
                camDockModule: {
                    addStatic: "Add %{primaryValue} Camera",
                    addDynamic: "Add %{primaryValue} %{secondaryValue}",
                    replaceWith: "Replace with %{count}"
                },
                dockedCam: {
                    showControls: "Show Controls",
                    hideControls: "Hide Controls"
                },
                dockedControls: {
                    selectNearestCam: "Click on map to select nearest camera",
                    mapLocation: "Choose Nearest Camera to Map Location",
                    searchForCam: "Search for camera"
                }
            },
            notifications: {
                main: {
                    errorOcc: "An error has occurred.",
                    viewActive: "View Active",
                    viewArchive: "View Archive",
                    dismissAll: "Dismiss All",
                    checkNetConn: "Please check your network connection.",
                    loading: "Loading...",
                    noNotifications: "You currently have no notifications.",
                    archiveEmpty: "Your archive is empty"
                }
            },
            shared: {
                newNotificationItem: {
                    cancelled: "Canceled",
                    undo: "Undo"
                }
            },
            systemHealth: {
                title: "System Health",
                errorCard: {
                    errorText: "An error occurred retrieving system health"
                },
                systemHealthCard: {
                    hide: "hide",
                    more: "more"
                },
                systemHealthItem: {
                    passed: "Passed",
                    error: "Error",
                    lastUpdate: "Last update "
                }
            },
            wavCam: {
                main: {
                    wavCamOptions: "WavCam Options",
                    wavCamLabels: "WavCam Labels",
                    selectWavCam: "Select WavCam"
                }
            }
        },
        errorBoundary: {
            errorOccured: "An error has occurred displaying this component."
        },
        events: {
            closed: "Closed ",
            started: "Started ",
            today: " Today",
            starts: "Starts "
        },
        map: {
            helper: {
                toast: "Shapes should not have intersecting lines. Please update the shape to remove any overlapping paths."
            },
            contextMenu: {
                main: {
                    noActions: "No actions available"
                }
            },
            controls: {
                gisControl: {
                    main: {
                        title: "GIS",
                        addNewService: "Add New Service",
                        gisServices: "You have yet to add any GIS Services"
                    },
                    gisCollection: {
                        layer: "%{count} Layer",
                        layers: "%{count} Layers",
                        manage: "Manage",
                    },
                    gisDialog: {
                        retry: "Retry",
                        add: "Add",
                        cancel: "Cancel",
                        fieldLabel: {
                            serviceName: "Service Name",
                            esriServiceEndpoint: "ESRI Service Endpoint",
                            authType: "Authentication Type",
                            username: "Username",
                            password: "Password",
                            token: "Token"
                        },
                        menuItem: {
                            login: "Login",
                            token: "Token",
                            none: "None"
                        },
                        helperText: {
                            exampleURL: "Example URL: %{count}"
                        }
                    },
                    gisManagement: {
                        confirm: "Confirm",
                        save: "Save",
                        cancel: "Cancel",
                        delete: "Delete",
                        fieldLabel: {
                            serviceName: "Service Name",
                            esriServiceEndpoint: "ESRI Service Endpoint",
                            authType: "Authentication Type",
                            username: "Username",
                            password: "Password",
                            token: "Token"
                        },
                        menuItem: {
                            login: "Login",
                            token: "Token",
                            none: "None"
                        },
                        helperText: {
                            exampleURL: "Example URL: %{count}"
                        },
                        deleteConfirmation: "Are you sure you want to delete this GIS Service?"
                    }
                }
            },
            tools: {
                shapeSelect: {
                    point: "Point",
                    polygon: "Polygon",
                    line: "Line"
                },
                unitSelect: {
                    nauticalMiles: "Nautical Miles",
                    kilometers: "Kilometers",
                    miles: "Miles"
                },
                spotlightTool: {
                    spotlightChip: {
                        spotlight: "Spotlight %{count}"
                    }
                }
            }
        },
        profiles: {
            alertProfile: {
                activeSpotlightsTxt: "Only 3 Spotlights may be active at one time",
                spotlight: "Spotlight",
                escalate: "Escalate",
                close: "Close"
            },
            cameraProfile: {
                linkedItems: "Linked Items",
                activities: "Activities",
                liveCam: "Live Camera",
                files: "Files",
                map: "Map",
                facility: "Facility",
                hideFOV: "Hide FOV",
                showFOV: "Show FOV",
                pinTo: "Pin To",
                edit: "Edit",
                hide: "Hide",
                editProfileLayout: "Edit Profile Layout",
                mapLocationFOV: "Map Location and FOV",
                cameraDialog: {
                    errorText: {
                        lessThanFifty: "Camera names must be 50 characters or less",
                        noName: "Cameras must have a name"
                    },
                    cancel: "Cancel",
                    confirm: "Confirm",
                    editCam: "Edit Camera",
                    camName: "Camera Name",
                    desc: "Description (optional)",
                    type: "Type",
                    camId: "Camera ID",
                    systemName: "System Name"
                }
            },
            entityProfile: {
                main: {
                    alerts: "Alerts",
                    activities: "Activities",
                    files: "Files",
                    details: "Details",
                    rules: "Rules",
                    cameras: "Cameras",
                    marineTraffic: "Marine Traffic Particulars",
                    problemOccured: "A problem occurred while checking data associated with this shape. It cannot be unshared at this time.",
                    trackHistory: "Track History",
                    pinTo: "Pin To",
                    edit: "Edit",
                    delete: "Delete",
                    hide: "Hide",
                    editLayout: "Edit Profile Layout",
                    ok: "Ok"
                },
                entityDelete: {
                    cancel: "Cancel",
                    delete: "Delete",
                    confirmationText: "Are you sure you want to delete this entity? "
                },
                entityEdit: {
                    edit: "Edit"
                },
                entityShare: {
                    unshare: "Unshare",
                    share: "Share",
                    cancel: "Cancel",
                    unshareEntity: "Unshare this entity with your organization?",
                    confirmationText: "Are you sure you want to share this item? Sharing this item will make it available to your organization and to any organization in the ecosystem with an active sharing policy enabled. Any organization user with appropriate permissions can view, contribute, and edit this item."
                },
                shapeAssoc: {
                    ok: "Ok",
                    cannotDelete: "This shape cannot be deleted. It is actively associated with the following rules:",
                    cannotBeHidden: "This shape cannot be hidden. It is actively associated with the following rules:"
                }
            },
            eventProfile: {
                main: {
                    activities: "Activities",
                    map: "Map",
                    notes: "Notes",
                    eventLists: "Event Lists",
                    pinnedItems: "Pinned Items",
                    files: "Files",
                    secureShare: "SecureShare",
                    cadDetails: "CAD Details",
                    respondingUnits: "Responding Units",
                    cameras: "Cameras",
                    proximity: "Proximity",
                    resources: "Resources",
                    equipments: "Equipments",
                    report: "Report",
                    share: "Share",
                    edit: "Edit",
                    delete: "Delete",
                    editProfileLayout: "Edit Profile Layout",
                    mapPlanner: "Map Planner",
                    confirm: "Confirm",
                    cancel: "Cancel",
                    confirmationText: "Are you sure you want to delete this event?"
                },
                eventDialog: {
                    update: "Update",
                    create: "Create",
                    cancel: "Cancel",
                    fieldLabel: {
                        templateName: "Template Name",
                        eventName: "Event Name",
                        description: "Description",
                        template: "Template",
                        none: "None",
                        startDate: "Start Date *",
                        startTime: "Start Time *",
                        endDate: "End Date",
                        endTime: "End Time",
                        endTimeText: "End time must come after start time."
                    }
                },
                eventShareDialog: {
                    sharePromptTemplate: "Are you sure you want to share this template? Sharing this template will make it permanently available to your organization.",
                    sharePromptEvent: "Are you sure you want to share this event? Sharing this event will make it permanently available to your organization.",
                    confirm: "Confirm",
                    cancel: "Cancel",
                    shareTitle: "Share %{count} with other organizations in the ecosystem?",
                    noOrganizations: "There are no additional organizations in the ecosystem."
                }
            },
            facilityProfile: {
                main: {
                    floorPlans: "FloorPlans",
                    activities: "Activities",
                    files: "Files",
                    cameras: "Cameras",
                    edit: "Edit",
                    hide: "Hide",
                    delete: "Delete",
                    pinTo: "Pin To",
                    editProfileLayout: "Edit Profile Layout",
                    confirm: "Confirm",
                    cancel: "Cancel",
                    confirmationText: "Are you sure you want to delete this factility?",
                    close: "Close",
                    cantDelete: "Facilities with cameras cannot be deleted."
                }
            },
            robotDogProfile: {
                alerts: "Alerts",
                activities: "Activities",
                files: "Files",
                cameras: "Cameras",
                robotCams: "Robot Cameras",
                missionControl: "Mission Control",
                errorText: "A problem occurred while checking data associated with this shape. It cannot be unshared at this time.",
                trackHistory: "Track History",
                pinTo: "Pin To",
                hide: "Hide",
                editProfileLayout: "Edit Profile Layout",
                ok: "Ok"
            },
            widgets: {
                activities: {
                    main: {
                        errorText: {
                            commentsTxt: "Comments must be 280 characters or less"
                        },
                        cancel: "Cancel",
                        confirm: "Confirm",
                        activityTimeline: "Activity Timeline",
                        postToTimeline: "Post message to timeline",
                        post: "Post",
                        activityTimelineFilters: "Choose Activity Timeline filters:",
                        postedMessages: "Posted Messages",
                        updates: "%{count} Updates",
                        loadMore: "Load More",
                        noActivities: "No activities available"
                    },
                    activity: {
                        posted: "%{count} posted "
                    }
                },
                CADDetails: {
                    title: "CAD Details",
                    address: "Address"
                },
                cameras: {
                    main: {
                        title: "Cameras",
                        linkCamera: "Link Camera",
                        slewAll: "Slew All",
                        noCamsAvailable: "No cameras available",
                        linkCams: "Link Cameras"
                    },
                    camCard: {
                        unlinkCam: "Unlink Camera",
                        slew: "Slew",
                        removeFromDock: "Remove from Dock",
                        addToDock: "Add to Dock",
                        presets: "Presets",
                        back: "Back",
                        noPresets: "No presets available"
                    }
                },
                details: {
                    title: "Details",
                    showLess: "Show Less",
                    showMore: "Show More"
                },
                files: {
                    title: "Files",
                    noAssocFiles: "No associated files",
                    phoenixDropzone: {
                        uploadFiles: "Upload Files"
                    }
                },
                floorPlanWidget: {
                    floorPlans: "Floor Plans"
                },
                hrms: {
                    equipmentsWidget: {
                        equipments: "Equipments",
                        manage: "Manage",
                        noEquipment: "No equipment available"
                    },
                    resourcesWidget: {
                        resources: "Resources",
                        manage: "Manage",
                        noResources: "No resources available"
                    },
                    lookupTable: {
                        shiftEnding: "Shift Ending",
                        location: "Location",
                        unit: "Unit",
                        rank: "Rank",
                        name: "Name",
                        category: "Category",
                        count: "Count",
                        cancel: "Cancel",
                        done: "Done"
                    },
                    manageModal: {
                        search: "Search",
                        showAvail: "Show available",
                        showAssigned: "Show assigned",
                        select: "Select %{count}"
                    },
                    widgetTable: {
                        name: "Name",
                        rank: "Rank",
                        location: "Location",
                        unit: "Unit",
                        category: "Category"
                    }
                },
                layoutControls: {
                    done: "Done"
                },
                linkedItems: {
                    title: "Linked Items",
                    linkItems: "Link Items",
                    linkItem: "Link Item"
                },
                list: {
                    main: {
                        myLists: "My Lists",
                        listsSharedWithMe: "Lists Shared With Me",
                        noListsAvail: "No lists available",
                        uncategorizedLists: "Uncategorized Lists",
                        list: "%{count} List",
                        lists: "%{count} Lists",
                        eventLists: "Event Lists",
                        addList: "Add List",
                        chooseToAdd: "Choose a list to add:",
                        addSelected: "Add Selected Lists (%{count})",
                        cancel: "Cancel",
                        searchLists: "Search lists..."
                    },
                    listCard: {
                        cancel: "Cancel",
                        delete: "Delete",
                        confirmationText: "Are you sure you want to delete this list?"
                    },
                    listToolbar: {
                        deleteList: "Delete List",
                        renameList: "Rename List",
                        cancel: "Cancel",
                        save: "Save",
                        add: "Add",
                        remove: "Remove"
                    }
                },
                liveCam: {
                    title: "Live Camera"
                },
                lradControls: {
                    title: "LRAD Controls",
                    playAudio: "Play Audio",
                    volume: "Volume",
                    beam: "Beam",
                    strobe: "Strobe"
                },
                marineTrafficParticulars: {
                    noParticulars: "No particulars available",
                    title: "Marine Traffic Particulars"
                },
                missionControl: {
                    charging: "CHARGING",
                    stationary: "STATIONARY",
                    standby: "STANDBY",
                    inMotion: "IN MOTION",
                    onMission: "ON MISSION",
                    stopped: "STOPPED",
                    ftPerSec: "ft/sec",
                    waypointStatic: "Waypoint 1 (Start)",
                    waypointDynamic: "Waypoint %{count}",
                    missionControl: "Mission Control"
                },
                notes: {
                    title: "Notes",
                    cancel: "Cancel",
                    save: "Save",
                    conflictingChanges: "Conflicting changes",
                    textContent1: "Saving your changes will overwrite %{count}'s recent changes.",
                    textContent2: "Saving your changes will overwrite multiple users' recent changes.",
                    confirm: "Confirm",
                    uploading: "Uploading",
                    uploadingNewImgs: "Uploading new images."
                },
                pinnedItems: {
                    main: {
                        title: "Pinned Items",
                        pinItem: "Pin Item",
                        noAssocEntities: "No associated entities",
                    },
                    pinnedItemsDialog: {
                        errorText: {
                            errorOcc: "An error occurred.",
                            noItems: "No items found.",
                        },
                        confirm: "Confirm",
                        cancel: "Cancel",
                        wantToFind: "I want to find..."
                    }
                },
                proximity: {
                    main: {
                        title: "Proximity",
                        createProxZone: "Create Proximity Zone",
                        noAssocProx: "No associated proximities"
                    },
                    proximityCard: {
                        edit: "Edit",
                        noEntities: "No entities within this proximity zone"
                    },
                    proximityDialog: {
                        update: "Update",
                        create: "Create",
                        cancel: "Cancel",
                        name: "Name",
                        radius: "Radius",
                        unit: "Unit",
                        kilometers: "kilometers",
                        miles: "miles",
                        fillColor: "Fill Color",
                        strokeColor: "Stroke Color",
                        stroke: "Stroke"
                    },
                    transparencySlider: {
                        fill: "Fill Transparency %{count}%"
                    }
                },
                respondingUnits: {
                    title: "Responding Units"
                },
                robotCams: {
                    main: {
                        cameras: "Cameras",
                        audio: "Audio",
                        lights: "Lights",
                        arm: "Arm"
                    },
                    robotCamDock: {
                        removeFromDock: "Remove from Dock",
                        addToDock: "Add to Dock",
                        presets: "Presets",
                        back: "Back",
                        noPresetsAvailable: "No presets available"
                    }
                },
                rules: {
                    title: "Rules",
                    newRule: "New Rule",
                    priority: "priority",
                    viewRule: "View Rule",
                    createdBy: "Created by %{count}"
                },
                shieldGroup: {
                    main: {
                        secureShare: "SecureShare Settings"
                    },
                    editView: {
                        cancel: "Cancel",
                        save: "Save",
                        threadId: "Thread ID: %{count}",
                        fieldLabel: {
                            pointOfContact: "Points Of Contact",
                            predefinedLocation: "Predefined Location",
                            none: "None",
                            bulletinZone: "Bulletin Zone"
                        },
                        shareToCMS: "Share to CMS",
                        visibleToAll: "Visible to All Users",
                        notifyOnEntry: "Notify on Entry",
                        disableNotifications: "Disable Notifications",
                        audiences: "Audiences",
                        groups: "Groups",
                        departments: "Departments",
                        districts: "Districts",
                        individuals: "Individuals",
                        searchForIndividuals: "Search for individuals..."
                    },
                    profileView: {
                        threadId: "Thread ID",
                        sharedToCMS: "Shared to CMS",
                        pointsOfContact: "Points of Contact (%{count})",
                        predefinedLocation: "Predefined Location",
                        bulletinZone: "Bulletin Zone",
                        visibleToAll: "Visible to All Users",
                        notifyOnEntry: "Notify on Entry",
                        disableNotifications: "Disable Notifications",
                        audiences: "Audiences",
                        groups: "Groups (%{count})",
                        districts: "Districts (%{count})",
                        departments: "Departments (%{count})",
                        individuals: "Individuals (%{count})",
                        yes: "Yes",
                        no: "No",
                        none: "None"
                    }
                },
                summary: {
                    createdBy: "%{primaryValue} created by %{secondaryValue}"
                }
            }
        },
        ruleBuilder: {
            alarm: {
                alarmRule: "Alarm Rule",
                alertMe: "Alert me when %{count} fires %{primaryValue} %{secondaryValue} alarm."
            },
            conditionBuilder: {
                betweenValues: " it is between %{primaryValue} and %{secondaryValue}",
                itIs: " it is",
                Sunday: "Sunday",
                Monday: "Monday",
                Tuesday: "Tuesday",
                Wednesday: "Wednesday",
                Thursday: "Thursday",
                Friday: "Friday",
                Saturday: "Saturday",
                or: " or ",
                and: " AND ",
                dateIs: " the date is %{count}",
                duringPeriod: " is during the period of %{primaryValue} and %{secondaryValue}",
                travellingSlower: " is traveling slower than %{primaryValue} %{secondaryValue}",
                travellingFaster: " is traveling faster than %{primaryValue} %{secondaryValue}",
                inCollection: " is in the collection %{count} ",
                notInCollection: " is not in the collection %{count} ",
                longerThanMin: " for longer than %{count} minute",
                longerThanMins: " for longer than %{count} minutes"
            },
            systemHealthBuilder: {
                alertMe: "Alert me when a system health change occurs in ",
                anySystem: "Any system",
                or: " or "
            },
            trackMovementBuilder: {
                alertMe: "Alert me when ",
                anyTrack: "any track",
                or: " or ",
                anyLine: "any line",
                anyPolygon: "any polygon"
            },
            vesselEvent: {
                alertMe: "Alert me when %{count}",
                newBerthCreated: "a new berth request is created",
                berthApproved: "a berth request is approved",
                assigmentUpdated: "an assignment is updated",
                arrival: "there is an arrival",
                departure: "there is a departure",
                securityViolation: "there is a security violation",
                for: " for ",
                at: " at ",
                or: " or "
            }
        },
        sharedComponents: {
            attachmentDialog: {
                close: "Close",
                title: "Attachments"
            },
            entityAddToColl: {
                cancel: "Cancel",
                submit: "Submit",
                title: "Copy to New Collection",
                createNewColl: "Create a new Collection:",
                enterCollTitle: "Enter New Collection title",
                newColl: "New Collection"
            },
            linkDialog: {
                errorText: {
                    errorOccured: "An error occurred.",
                    noItemsFound: "No items found.",
                },
                continue: "Continue",
                cancel: "Cancel",
                wantToFind: "I want to find..."
            },
            pinToDialog: {
                errorText: {
                    enterValidName: "Please enter a valid name for the collection"
                },
                addToColl: "Add to New Collection",
                cancel: "Cancel",
                submit: "Submit",
                pinItem: "Pin Item",
                collections: "Collections",
                events: "Events",
                enterName: "Enter a name for the new collection"
            },
            rowEdit: {
                none: "None",
                save: "Save",
                cancel: "Cancel",
                addAttachments: "Add attachments"
            },
            shapeEdit: {
                createPoint: "Create Point",
                createShape: "Create Shape",
                cancel: "Cancel",
                save: "Save",
                name: "Name",
                description: "Description",
                mapApp: "Map App Display Options",
                showWhenActive: "Only show when Event is Active",
                alwaysShow: "Always show",
                chooseSymbol: "Choose Symbol",
                chooseStyles: "Choose Styles",
                searchLib: "Search library...",
                fillColor: "Fill Color",
                strokeColor: "Stroke Color",
                stroke: "Stroke",
                lineColor: "Line Color",
                line: "Line",
                errorText: {
                    shapesErr: "Shapes should not have intersecting lines. Please update the shape to remove any overlapping paths."
                },
                strokeProps: {
                    point: "%{count} Point"
                },
                transparencySlider: {
                    fill: "Fill Transparency %{count}%"
                }
            }
        }
    },
    ar: {
        appMenu: {
            main: {
                settings: "إعدادات",
                support: "الدعم",
                home: "منزل",
                ecoAdmin: "مسؤول النظام البيئي",
                orgAdmin: "مدير منظمة",
                logOut: "تسجيل الخروج",
                emailSupport: "دعم البريد الإلكتروني"
            }
        },
        CBComponents: {
            CBAppMenu: {
                logOut: "تسجيل الخروج",
                settings: "إعدادات",
                support: "الدعم"
            },
            CBDialog: {
                confirmDelete: "تأكيد الحذف"
            },
            CBDock: {
                drawer: "الدرج!"
            },
            CBFileLink: {
                downloadImg: "تنزيل الصورة",
                dialog: {
                    title: "احذف المرفق",
                    textContent: "هل أنت متأكد أنك تريد حذف هذا المرفق؟",
                    delete: "حذف",
                    cancel: "إلغاء"
                }
            },
            CBList: {
                helpers: {
                    nameNotFound: "الاسم غير موجود"
                }
            },
            CBNewWindow: {
                newWindow: "نافذة جديدة"
            },
            CBSearchField: {
                searchField: {
                    clear: "(٪{count}) مسح"
                },
                searchSelectField: {
                    noResults: "لا نتائج"
                }
            },
            CBTable: {
                attachments: "المرفقات",
                viewNotes: "عرض الملاحظات",
                setNow: "تعيين الآن"
            },
            icons: {
                target: {
                    targettingIcon: "الهدف أيقونة"
                }
            },
            video: {
                videoPlayer: {
                    camInDock: "الكاميرا في قفص الاتهام",
                    camInModal: "الكاميرا في مشروط"
                },
                webRTCPlayer: {
                    unableToAccess: "تعذر الوصول إلى دفق الكاميرا. عنوان URL المقدم غير صالح.",
                    camProblem: "واجهت الكاميرا مشكلة."
                },
                wsImagePlayer: {
                    encounteredText: "واجهت الكاميرا مشكلة."
                }
            }
        },
        contextPanel: {
            viewMap: "إعرض الخريطة",
            openProfile: "فتح ملف التعريف",
            openListPanel: "فتح لوحة القائمة"
        },
        dock: {
            dockWrapper: {
                acknowledge: "يقر",
                sessionExpired: "انتهت الجلسة",
                redirectLogin: "انتهت صلاحية جلسة العمل الخاصة بك. ستتم إعادة توجيهك إلى صفحة تسجيل الدخول.",
                ok: "حسنا",
                userAgreement: "اتفاقية المستخدم",
                accept: "قبول",
                decline: "رفض",
                alerts: "التنبيهات"
            },
            cameras: {
                camDockModule: {
                    addStatic: "إضافة %{primaryValue} كاميرا",
                    addDynamic: "إضافة %{primaryValue} %{secondaryValue}",
                    replaceWith: "استبدل ب %{count}"
                },
                dockedCam: {
                    showControls: "إظهار الضوابط",
                    hideControls: "إخفاء الضوابط"
                },
                dockedControls: {
                    selectNearestCam: "انقر على الخريطة لتحديد أقرب كاميرا",
                    mapLocation: "اختر أقرب كاميرا إلى خريطة الموقع",
                    searchForCam: "البحث عن الكاميرا"
                }
            },
            notifications: {
                main: {
                    errorOcc: "حدث خطأ.",
                    viewActive: "عرض نشط",
                    viewArchive: "عرض الأرشيف",
                    dismissAll: "رفض جميع",
                    checkNetConn: "يرجى التحقق من اتصال الشبكة الخاص بك.",
                    loading: "جار التحميل...",
                    noNotifications: "ليس لديك حاليا أي إخطارات.",
                    archiveEmpty: "أرشيفك فارغ"
                }
            },
            shared: {
                newNotificationItem: {
                    cancelled: "ألغيت",
                    undo: "تراجع"
                }
            },
            systemHealth: {
                title: "النظام الصحي",
                errorCard: {
                    errorText: "حدث خطأ أثناء استرداد سلامة النظام"
                },
                systemHealthCard: {
                    hide: "يخفي",
                    more: "أكثر"
                },
                systemHealthItem: {
                    passed: "مرت",
                    error: "خطأ",
                    lastUpdate: "آخر تحديث "
                }
            },
            wavCam: {
                main: {
                    wavCamOptions: "خيارات WavCam",
                    wavCamLabels: "تسميات WavCam",
                    selectWavCam: "حدد WavCam"
                }
            }
        },
        errorBoundary: {
            errorOccured: "حدث خطأ أثناء عرض هذا المكون."
        },
        events: {
            closed: "مغلق ",
            started: "بدأت ",
            today: " اليوم",
            starts: "يبدأ "
        },
        map: {
            helper: {
                toast: "يجب ألا تحتوي الأشكال على خطوط متقاطعة. يرجى تحديث الشكل لإزالة أي مسارات متداخلة."
            },
            contextMenu: {
                main: {
                    noActions: "لا توجد إجراءات متاحة"
                }
            },
            controls: {
                gisControl: {
                    main: {
                        title: "نظم المعلومات الجغرافية",
                        addNewService: "أضف خدمة جديدة",
                        gisServices: "لا يزال يتعين عليك إضافة أي خدمات GIS"
                    },
                    gisCollection: {
                        layer: "%{count} طبقة",
                        layers: "٪{count} طبقات",
                        manage: "يدير",
                    },
                    gisDialog: {
                        retry: "أعد المحاولة",
                        add: "يضيف",
                        cancel: "إلغاء",
                        fieldLabel: {
                            serviceName: "اسم الخدمة",
                            esriServiceEndpoint: "نقطة نهاية خدمة ESRI",
                            authType: "نوع المصادقة",
                            username: "اسم المستخدم",
                            password: "كلمة المرور",
                            token: "توكن"
                        },
                        menuItem: {
                            login: "تسجيل الدخول",
                            token: "توكن",
                            none: "لا شيء"
                        },
                        helperText: {
                            exampleURL: "مثال URL: %{count}"
                        }
                    },
                    gisManagement: {
                        confirm: "تأكيد",
                        save: "حفظ",
                        cancel: "إلغاء",
                        delete: "حذف",
                        fieldLabel: {
                            serviceName: "اسم الخدمة",
                            esriServiceEndpoint: "نقطة نهاية خدمة ESRI",
                            authType: "نوع المصادقة",
                            username: "اسم المستخدم",
                            password: "كلمة المرور",
                            token: "توكن"
                        },
                        menuItem: {
                            login: "تسجيل الدخول",
                            token: "توكن",
                            none: "لا شيء"
                        },
                        helperText: {
                            exampleURL: "مثال URL: %{count}"
                        },
                        deleteConfirmation: "هل أنت متأكد أنك تريد حذف خدمة GIS هذه؟"
                    }
                }
            },
            tools: {
                shapeSelect: {
                    point: "نقطة",
                    polygon: "مضلع",
                    line: "خط"
                },
                unitSelect: {
                    nauticalMiles: "أميال بحرية",
                    kilometers: "كيلومترات",
                    miles: "اميال"
                },
                spotlightTool: {
                    spotlightChip: {
                        spotlight: "أضواء كاشفة %{count}"
                    }
                }
            }
        },
        profiles: {
            alertProfile: {
                activeSpotlightsTxt: "قد يتم تنشيط 3 إضاءات فقط في وقت واحد",
                spotlight: "أضواء كاشفة",
                escalate: "تصعيد",
                close: "إغلاق"
            },
            cameraProfile: {
                linkedItems: "العناصر المرتبطة",
                activities: "أنشطة",
                liveCam: "الكاميرا الحية",
                files: "الملفات",
                map: "خريطة",
                facility: "امكانية",
                hideFOV: "إخفاء مجال الرؤية",
                showFOV: "إظهار مجال الرؤية",
                pinTo: "دبوس ل",
                edit: "حرر",
                hide: "إخفاء",
                editProfileLayout: "تحرير تخطيط الملف الشخصي",
                mapLocationFOV: "الموقع على الخريطة ومجال الرؤية",
                cameraDialog: {
                    errorText: {
                        lessThanFifty: "يجب أن تتكون أسماء الكاميرا من 50 حرفًا أو أقل",
                        noName: "يجب أن يكون للكاميرات اسم"
                    },
                    cancel: "إلغاء",
                    confirm: "تأكيد",
                    editCam: "تحرير الكاميرا",
                    camName: "اسم الكاميرا",
                    desc: "وصف (اختياري)",
                    type: "نوع",
                    camId: "معرف الكاميرا",
                    systemName: "اسم النظام"
                }
            },
            entityProfile: {
                main: {
                    alerts: "تنبيهات",
                    activities: "أنشطة",
                    files: "الملفات",
                    details: "تفاصيل",
                    rules: "قواعد",
                    cameras: "الكاميرات",
                    marineTraffic: "تفاصيل حركة المرور البحرية",
                    problemOccured: "حدثت مشكلة أثناء التحقق من البيانات المرتبطة بهذا الشكل. لا يمكن إلغاء مشاركته في هذا الوقت.",
                    trackHistory: "تتبع التاريخ",
                    pinTo: "دبوس ل",
                    edit: "حرر",
                    delete: "حذف",
                    hide: "إخفاء",
                    editLayout: "تحرير تخطيط الملف الشخصي",
                    ok: "حسنا"
                },
                entityDelete: {
                    cancel: "إلغاء",
                    delete: "حذف",
                    confirmationText: "هل أنت متأكد أنك تريد حذف هذا الكيان؟"
                },
                entityEdit: {
                    edit: "حرر"
                },
                entityShare: {
                    unshare: "عدم المشاركة",
                    share: "مشاركة",
                    cancel: "إلغاء",
                    unshareEntity: "هل تريد عدم مشاركة هذا الكيان مع منظمتك؟",
                    confirmationText: "هل أنت متأكد أنك تريد مشاركة هذا العنصر؟ ستؤدي مشاركة هذا العنصر إلى إتاحته لمؤسستك وأي منظمة في النظام البيئي مع تمكين نهج مشاركة نشط. يمكن لأي مستخدم مؤسسة لديه أذونات مناسبة عرض هذا العنصر والمساهمة فيه وتحريره."
                },
                shapeAssoc: {
                    ok: "حسنا",
                    cannotDelete: "لا يمكن حذف هذا الشكل. يرتبط بشكل نشط بالقواعد التالية:",
                    cannotBeHidden: "لا يمكن إخفاء هذا الشكل. يرتبط بشكل نشط بالقواعد التالية:"
                }
            },
            eventProfile: {
                main: {
                    activities: "أنشطة",
                    map: "خريطة",
                    notes: "ملحوظات",
                    eventLists: "قوائم الأحداث",
                    pinnedItems: "العناصر المثبتة",
                    files: "الملفات",
                    secureShare: "المشاركة الآمنة",
                    cadDetails: "تفاصيل CAD",
                    respondingUnits: "وحدات الاستجابة",
                    cameras: "الكاميرات",
                    proximity: "القرب",
                    resources: "موارد",
                    equipments: "المعدات",
                    report: "نقل",
                    share: "مشاركة",
                    edit: "حرر",
                    delete: "حذف",
                    editProfileLayout: "تحرير تخطيط الملف الشخصي",
                    mapPlanner: "مخطط الخريطة",
                    confirm: "تأكيد",
                    cancel: "إلغاء",
                    confirmationText: "هل أنت متأكد من حذف هذا الحدث؟"
                },
                eventDialog: {
                    update: "تحديث",
                    create: "إنشاء",
                    cancel: "إلغاء",
                    fieldLabel: {
                        templateName: "اسم القالب",
                        eventName: "اسم الحدث",
                        description: "الوصف",
                        template: "قالب",
                        none: "لا شيء",
                        startDate: "تاريخ البدء *",
                        startTime: "وقت البدء *",
                        endDate: "تاريخ الانتهاء",
                        endTime: "وقت النهاية",
                        endTimeText: "يجب أن يأتي وقت الانتهاء بعد وقت البدء."
                    }
                },
                eventShareDialog: {
                    sharePromptTemplate: "هل أنت متأكد أنك تريد مشاركة هذا النموذج؟ ستؤدي مشاركة هذا القالب إلى جعله متاحًا بشكل دائم لمؤسستك.",
                    sharePromptEvent: "هل أنت متأكد أنك تريد مشاركة هذا الحدث؟ ستؤدي مشاركة هذا الحدث إلى جعله متاحًا بشكل دائم لمؤسستك.",
                    confirm: "تأكيد",
                    cancel: "إلغاء",
                    shareTitle: "مع المنظمات الأخرى في النظام البيئي؟ %{count} مشاركة",
                    noOrganizations: "لا توجد منظمات إضافية في النظام البيئي."
                }
            },
            facilityProfile: {
                main: {
                    floorPlans: "خطط المبنى",
                    activities: "أنشطة",
                    files: "الملفات",
                    cameras: "الكاميرات",
                    edit: "حرر",
                    hide: "إخفاء",
                    delete: "حذف",
                    pinTo: "دبوس ل",
                    editProfileLayout: "تحرير تخطيط الملف الشخصي",
                    confirm: "تأكيد",
                    cancel: "إلغاء",
                    confirmationText: "هل أنت متأكد أنك تريد حذف هذا الفصيل؟",
                    close: "إغلاق",
                    cantDelete: "لا يمكن حذف المرافق مع الكاميرات."
                }
            },
            robotDogProfile: {
                alerts: "تنبيهات",
                activities: "أنشطة",
                files: "الملفات",
                cameras: "الكاميرات",
                robotCams: "كاميرات الروبوت",
                missionControl: "مراقبة المهمة",
                errorText: "حدثت مشكلة أثناء التحقق من البيانات المرتبطة بهذا الشكل. لا يمكن إلغاء مشاركته في هذا الوقت.",
                trackHistory: "تتبع التاريخ",
                pinTo: "دبوس ل",
                hide: "إخفاء",
                editProfileLayout: "تحرير تخطيط الملف الشخصي",
                ok: "حسنا"
            },
            widgets: {
                activities: {
                    main: {
                        errorText: {
                            commentsTxt: "يجب أن تتكون التعليقات من 280 حرفًا أو أقل"
                        },
                        cancel: "إلغاء",
                        confirm: "تأكيد",
                        activityTimeline: "الجدول الزمني للنشاط",
                        postToTimeline: "نشر رسالة إلى الجدول الزمني",
                        post: "بوست",
                        activityTimelineFilters: "اختر فلاتر الجدول الزمني للنشاط:",
                        postedMessages: "الرسائل المرسلة",
                        updates: "%{count} التحديثات",
                        loadMore: "تحميل المزيد",
                        noActivities: "لا توجد أنشطة متاحة"
                    },
                    activity: {
                        posted: "%{count} نشر "
                    }
                },
                CADDetails: {
                    title: "تفاصيل CAD",
                    address: "العنوان"
                },
                cameras: {
                    main: {
                        title: "الكاميرات",
                        linkCamera: "ربط الكاميرا",
                        slewAll: "ذبح كل شيء",
                        noCamsAvailable: "لا توجد كاميرات متاحة",
                        linkCams: "ربط الكاميرات"
                    },
                    camCard: {
                        unlinkCam: "فك ارتباط الكاميرا",
                        slew: "ذبح",
                        removeFromDock: "إزالة من قفص الاتهام",
                        addToDock: "أضف إلى Dock",
                        presets: "الإعدادات المسبقة",
                        back: "عودة",
                        noPresets: "لا توجد إعدادات مسبقة متاحة"
                    }
                },
                details: {
                    title: "تفاصيل",
                    showLess: "عرض أقل",
                    showMore: "أظهر المزيد"
                },
                files: {
                    title: "الملفات",
                    noAssocFiles: "لا توجد ملفات مرتبطة",
                    phoenixDropzone: {
                        uploadFiles: "تحميل الملفات"
                    }
                },
                floorPlanWidget: {
                    floorPlans: "خطط المبنى"
                },
                hrms: {
                    equipmentsWidget: {
                        equipments: "المعدات",
                        manage: "يدير",
                        noEquipment: "لا توجد معدات متاحة"
                    },
                    resourcesWidget: {
                        resources: "موارد",
                        manage: "يدير",
                        noResources: "لا توجد موارد متاحة"
                    },
                    lookupTable: {
                        shiftEnding: "التحول إنهاء",
                        location: "موقع",
                        unit: "وحدة",
                        rank: "مرتبة",
                        name: "الاسم",
                        category: "فئة",
                        count: "عدد",
                        cancel: "إلغاء",
                        done: "تم"
                    },
                    manageModal: {
                        search: "بحث",
                        showAvail: "تظهر المتاحة",
                        showAssigned: "إظهار المعينة",
                        select: "يختار %{count}"
                    },
                    widgetTable: {
                        name: "الاسم",
                        rank: "مرتبة",
                        location: "موقع",
                        unit: "وحدة",
                        category: "فئة"
                    }
                },
                layoutControls: {
                    done: "تم"
                },
                linkedItems: {
                    title: "العناصر المرتبطة",
                    linkItems: "عناصر الارتباط",
                    linkItem: "عنصر الارتباط"
                },
                list: {
                    main: {
                        myLists: "قوائمي",
                        listsSharedWithMe: "القوائم المشتركة معي",
                        noListsAvail: "لا توجد قوائم متاحة",
                        uncategorizedLists: "قوائم غير مصنفة",
                        list: "%{count} قائمة",
                        lists: "%{count} القوائم",
                        eventLists: "قوائم الأحداث",
                        addList: "اضف قائمة",
                        chooseToAdd: "اختر قائمة لإضافتها:",
                        addSelected: "أضف القوائم المختارة (%{count})",
                        cancel: "إلغاء",
                        searchLists: "قوائم البحث ..."
                    },
                    listCard: {
                        cancel: "إلغاء",
                        delete: "حذف",
                        confirmationText: "هل أنت متأكد أنك تريد حذف هذه القائمة؟"
                    },
                    listToolbar: {
                        deleteList: "قائمة الحذف",
                        renameList: "إعادة تسمية القائمة",
                        cancel: "إلغاء",
                        save: "حفظ",
                        add: "يضيف",
                        remove: "إزالة"
                    }
                },
                liveCam: {
                    title: "الكاميرا الحية"
                },
                lradControls: {
                    title: "ضوابط LRAD",
                    playAudio: "تشغيل الصوت",
                    volume: "الحجم",
                    beam: "شعاع",
                    strobe: "ستروب"
                },
                marineTrafficParticulars: {
                    noParticulars: "لا توجد تفاصيل متاحة",
                    title: "تفاصيل حركة المرور البحرية"
                },
                missionControl: {
                    charging: "الشحن",
                    stationary: "قرطاسية",
                    standby: "الاستعداد",
                    inMotion: "في الحركة",
                    onMission: "في مهمة",
                    stopped: "توقف",
                    ftPerSec: "قدم / ثانية",
                    waypointStatic: "نقطة الطريق 1 (بداية)",
                    waypointDynamic: "إحداثية %{count}",
                    missionControl: "مراقبة المهمة"
                },
                notes: {
                    title: "ملحوظات",
                    cancel: "إلغاء",
                    save: "حفظ",
                    conflictingChanges: "تغييرات متضاربة",
                    textContent1: "سيؤدي حفظ التغييرات إلى الكتابة فوقها %{count} التغييرات الأخيرة.",
                    textContent2: "سيؤدي حفظ التغييرات إلى استبدال التغييرات الأخيرة التي أجراها العديد من المستخدمين.",
                    confirm: "تأكيد",
                    uploading: "تحميل",
                    uploadingNewImgs: "تحميل صور جديدة."
                },
                pinnedItems: {
                    main: {
                        title: "العناصر المثبتة",
                        pinItem: "دبوس البند",
                        noAssocEntities: "لا توجد كيانات مرتبطة",
                    },
                    pinnedItemsDialog: {
                        errorText: {
                            errorOcc: "حدث خطأ.",
                            noItems: "لم يتم العثور على العناصر.",
                        },
                        confirm: "تأكيد",
                        cancel: "إلغاء",
                        wantToFind: "انا اريد ان اجد..."
                    }
                },
                proximity: {
                    main: {
                        title: "القرب",
                        createProxZone: "إنشاء منطقة قريبة",
                        noAssocProx: "لا تقارب مرتبطة"
                    },
                    proximityCard: {
                        edit: "حرر",
                        noEntities: "لا توجد كيانات داخل منطقة القرب هذه"
                    },
                    proximityDialog: {
                        update: "تحديث",
                        create: "إنشاء",
                        cancel: "إلغاء",
                        name: "الاسم",
                        radius: "نصف القطر",
                        unit: "وحدة",
                        kilometers: "كيلومترات",
                        miles: "اميال",
                        fillColor: "لون التعبئة",
                        strokeColor: "لون السكتة الدماغية",
                        stroke: "السكتة الدماغية"
                    },
                    transparencySlider: {
                        fill: "ملء الشفافية %{count}%"
                    }
                },
                respondingUnits: {
                    title: "وحدات الاستجابة"
                },
                robotCams: {
                    main: {
                        cameras: "الكاميرات",
                        audio: "الصوت",
                        lights: "أضواء",
                        arm: "ذراع"
                    },
                    robotCamDock: {
                        removeFromDock: "إزالة من قفص الاتهام",
                        addToDock: "أضف إلى Dock",
                        presets: "الإعدادات المسبقة",
                        back: "عودة",
                        noPresetsAvailable: "لا توجد إعدادات مسبقة متاحة"
                    }
                },
                rules: {
                    title: "قواعد",
                    newRule: "قانون جديد",
                    priority: "أفضلية",
                    viewRule: "عرض القاعدة",
                    createdBy: "تم إنشاؤها بواسطة %{count}"
                },
                shieldGroup: {
                    main: {
                        secureShare: "إعدادات SecureShare"
                    },
                    editView: {
                        cancel: "إلغاء",
                        save: "حفظ",
                        threadId: "معرف الموضوع: %{count}",
                        fieldLabel: {
                            pointOfContact: "نقاط الاتصال",
                            predefinedLocation: "موقع محدد مسبقا",
                            none: "لا شيء",
                            bulletinZone: "منطقة النشرة"
                        },
                        shareToCMS: "شارك في CMS",
                        visibleToAll: "مرئي لجميع المستخدمين",
                        notifyOnEntry: "يخطر عند الدخول",
                        disableNotifications: "أوقف التنبيهات",
                        audiences: "الجمهور",
                        groups: "مجموعات",
                        departments: "الإدارات",
                        districts: "المقاطعات",
                        individuals: "الأفراد",
                        searchForIndividuals: "البحث عن أفراد ..."
                    },
                    profileView: {
                        threadId: "معرف الموضوع",
                        sharedToCMS: "مشترك في CMS",
                        pointsOfContact: "نقاط الاتصال (%{count})",
                        predefinedLocation: "موقع محدد مسبقا",
                        bulletinZone: "منطقة النشرة",
                        visibleToAll: "مرئي لجميع المستخدمين",
                        notifyOnEntry: "يخطر عند الدخول",
                        disableNotifications: "أوقف التنبيهات",
                        audiences: "الجمهور",
                        groups: "مجموعات (%{count})",
                        districts: "المقاطعات (%{count})",
                        departments: "الإدارات (%{count})",
                        individuals: "الأفراد (%{count})",
                        yes: "نعم",
                        no: "لا",
                        none: "لا شيء"
                    }
                },
                summary: {
                    createdBy: "%{primaryValue} تم إنشاؤها بواسطة %{secondaryValue}"
                }
            }
        },
        ruleBuilder: {
            alarm: {
                alarmRule: "قاعدة التنبيه",
                alertMe: "تنبيه لي عندما %{count} حرائق %{primaryValue} %{secondaryValue} إنذار."
            },
            conditionBuilder: {
                betweenValues: " فمن بين %{primaryValue} و %{secondaryValue}",
                itIs: " إنه",
                Sunday: "الأحد",
                Monday: "الاثنين",
                Tuesday: "يوم الثلاثاء",
                Wednesday: "الأربعاء",
                Thursday: "يوم الخميس",
                Friday: "جمعة",
                Saturday: "السبت",
                or: " أو ",
                and: " و ",
                dateIs: " التاريخ هو %{count}",
                duringPeriod: " خلال فترة  %{primaryValue} و %{secondaryValue}",
                travellingSlower: " أبطأ من %{primaryValue} %{secondaryValue}",
                travellingFaster: " أسرع من %{primaryValue} %{secondaryValue}",
                inCollection: " موجود في المجموعة %{count} ",
                notInCollection: " ليس في المجموعة %{count} ",
                longerThanMin: " لفترة أطول من %{count} دقيقة",
                longerThanMins: " لفترة أطول من %{count} الدقائق"
            },
            systemHealthBuilder: {
                alertMe: "تنبيهي عند حدوث تغيير في صحة النظام في ",
                anySystem: "أي نظام",
                or: " أو "
            },
            trackMovementBuilder: {
                alertMe: "تنبيهي عندما ",
                anyTrack: "أي مسار",
                or: " أو ",
                anyLine: "أي خط",
                anyPolygon: "أي مضلع"
            },
            vesselEvent: {
                alertMe: "تنبيهي عندما %{count}",
                newBerthCreated: "تم إنشاء طلب رصيف جديد",
                berthApproved: "تمت الموافقة على طلب الرصيف",
                assigmentUpdated: "يتم تحديث مهمة",
                arrival: "هناك وصول",
                departure: "هناك رحيل",
                securityViolation: "هناك انتهاك أمني",
                for: " ل ",
                at: " في ",
                or: " أو ",
            }
        },
        sharedComponents: {
            attachmentDialog: {
                close: "إغلاق",
                title: "المرفقات"
            },
            entityAddToColl: {
                cancel: "إلغاء",
                submit: "إرسال",
                title: "نسخ إلى مجموعة جديدة",
                createNewColl: "إنشاء مجموعة جديدة:",
                enterCollTitle: "أدخل عنوان مجموعة جديدة",
                newColl: "مجموعة جديدة"
            },
            linkDialog: {
                errorText: {
                    errorOccured: "حدث خطأ.",
                    noItemsFound: "لم يتم العثور على العناصر.",
                },
                continue: "تابع",
                cancel: "إلغاء",
                wantToFind: "انا اريد ان اجد..."
            },
            pinToDialog: {
                errorText: {
                    enterValidName: "الرجاء إدخال اسم صالح للمجموعة"
                },
                addToColl: "أضف إلى المجموعة الجديدة",
                cancel: "إلغاء",
                submit: "إرسال",
                pinItem: "دبوس البند",
                collections: "المجموعات",
                events: "الأحداث",
                enterName: "أدخل اسما للمجموعة الجديدة"
            },
            rowEdit: {
                none: "لا شيء",
                save: "حفظ",
                cancel: "إلغاء",
                addAttachments: "إضافة مرفقات"
            },
            shapeEdit: {
                createPoint: "إنشاء نقطة",
                createShape: "إنشاء الشكل",
                cancel: "إلغاء",
                save: "حفظ",
                name: "الاسم",
                description: "الوصف",
                mapApp: "خيارات عرض تطبيق الخريطة",
                showWhenActive: "تظهر فقط عندما يكون الحدث نشطا",
                alwaysShow: "تظهر دائما",
                chooseSymbol: "اختر الرمز",
                chooseStyles: "اختر الأنماط",
                searchLib: "مكتبة البحث...",
                fillColor: "لون التعبئة",
                strokeColor: "لون السكتة الدماغية",
                stroke: "السكتة الدماغية",
                lineColor: "لون الخط",
                line: "خط",
                errorText: {
                    shapesErr: "يجب ألا تحتوي الأشكال على خطوط متقاطعة. يرجى تحديث الشكل لإزالة أي مسارات متداخلة."
                },
                strokeProps: {
                    point: "%{count} نقطة"
                },
                transparencySlider: {
                    fill: "ملء الشفافية %{count}%"
                }
            }
        }
    }
};

export default global;