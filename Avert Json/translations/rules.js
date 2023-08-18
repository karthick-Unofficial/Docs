const rulesApp = {
en: {
    alertGenerator: {
      alertFields: {
        summary: "Summary*"
      },
      alertTable: {
        emails: "Emails",
        priority: "Priority",
        system: "System",
        whoGetsAlert: "Who gets alerts?"
      },
      escalationEvent: {
        title: "Escalation Event"
      },
      locationSelection: {
        lat: "Lat",
        location: "Location",
        lon: "Lon"
      },
      main: {
        demoAlert: "Demo Alert",
        loiterRule: "Loiter Rule",
        zoneEntry: "Zone Entry",
        zoneExit: "Zone Exit"
      },
      objectSelection: {
        object: "Object"
      },
      searchField: {
        search: "Search..."
      },
      submitControls: {
        generate: "Generate",
        reset: "Reset"
      },
      targetSelection: {
        target: "Target"
      }
    },
    appBar: {
      title: "Rules"
    },
    createEditRule: {
      alarm: {
        chooseAlarmSubType: "Choose an alarm sub-type to filter by. (optional)",
        chooseAlarmType: "Choose an alarm type to filter by.",
        chooseFeed: "Choose a feed to monitor.",
        ruleStates: "The rule states..."
      },
      components: {
        alertTable: {
          emails: "Emails",
          priority: "Priority",
          system: "System",
          whoGetsAlert: "Who gets alerts?"
        },
        audioSettings: {
          example: "Example: Alert, Alert: A violation has occurred in Main Security Zone.",
          note: "Note: If both above options are selected the entire alert notification text will be appended to the user entered alert text.",
          selectingThisRule: "Selecting this option will speak entire alert notification text from alarm rule above.",
          speakAlertNotification: "Speak alert notification text",
          speakAlertText: "Speak alert text"
        },
        dismissSettings: {
          dismissAlertsForAll: "Dismiss alerts for all users in the Organization",
          dismissAlertsUser: "Dismiss alerts by user",
          useForEntireOrg: "Use this option to allow any subscribed user to dismiss Priority or System alerts for the entire organization.",
          useToSubscIndividually: "Use this option to allow any subscribed user to dismiss Priority or System alerts individually."
        },
        ruleFields: {
          descNotes: "Description/Notes (optional)",
          ruleName: "Rule name*"
        },
        submitControls: {
          cancel: "Cancel",
          save: "Save"
        }
      },
      conditions: {
        conditionDialog: {
          add: "Add",
          addCondition: "ADD CONDITION",
          allDay: "All Day",
          cancel: "Cancel",
          dateRange: "DATE RANGE :",
          days: "DAYS :",
          dialogError: {
            atleastOneDay: "You must select at least one day of the week for the condition to be active.",
            atleastOneLimitingFactor: "Your condition must have at least one limiting factor.",
            fallAfterStart: "Your end date must fall after your selected start date.",
            fasterThanGreater: "Traveling faster than speed must be greater than traveling slower than speed",
            onlyOneAllowed: "Only one time condition is allowed per rule.",
            onlyOneDuration: "Only one duration condition is allowed per rule.",
            selectAColl: "Please select a collection.",
            slowerFasterThanVal: "Please enter either a traveling slower than speed or traveling faster than speed value",
            startBeforeEndTime: "The start time must be before the end time.",
            startEndTimeDiff: "The start time and end time must be different.",
            validTimeValue: "Please enter a valid time value."
          },
          duration: "Duration",
          inCollection: "In Collection...",
          indefinite: "Indefinite",
          minute: "minute",
          minutes: "minutes",
          notInCollection: "Not In Collection...",
          selectCollection: "Select a Collection",
          selectCondition: "Select a Condition",
          setPeriod: "Set Period",
          setRange: "Set Range",
          speed: "Speed",
          time: "Time",
          timeAllowed: "Time Allowed",
          timePeriod: "TIME PERIOD :",
          to: "to",
          travellingFasterThan: "Traveling faster than:",
          travellingSlowerThan: "Traveling slower than:",
          unit: "Unit",
          update: "Update"
        },
        main: {
          addACondition: "Add a condition...",
          addAnother: "Add another...",
          addCondition: "Add condition",
          cancel: "Cancel",
          condition: "%{count} Condition",
          inCollection: "In Collection (%{count})",
          notInCollection: "Not In Collection (%{count})",
          title: "Conditions"
        }
      },
      createEvent: {
        eventSubType: "Choose an event subtype to monitor.",
        eventTemplate: "Choose an event template to monitor.",
        eventType: "Choose an event type to monitor.",
        ruleStates: "The rule states..."
      },
      escalations: {
        chooseTemp: "Choose a Template...",
        escalationDialog: {
          add: "Add",
          cancel: "Cancel",
          noEventTemp: "You do not have any event templates. Please create an event template to select.",
          wantToFind: "I want to find..."
        },
        title: "Escalation Event"
      },
      genericAttribute: {
        multiSelection: {
          addAnother: "Add another...",
          addDynamic: "Add %{count}...",
          multiSelectionDialog: {
            addItem: "Add item",
            cancel: "Cancel",
            wantToFind: "I want to find..."
          }
        },
        singleSelection: {
          addDynamic: "Add %{count}...",
          singleSelectionDialog: {
            addItem: "Add item",
            cancel: "Cancel",
            wantToFind: "I want to find..."
          }
        }
      },
      main: {
        errorText: {
          alertTextReq: "Alert text is required if the speak alert text option is selected.",
          atLeastTwo: "At least one of the 2 options must be selected."
        }
      },
      subject: {
        subjectAttributes: {
          addAnother: "Add another...",
          addEntity: "Add an entity...",
          addFeed: "Add feed filter",
          anyTrack: "Any track",
          editFeed: "Edit feed filter",
          selectTracks: "Select track(s)",
          title: "Subject",
          tracks: "Track(s) that can commit the trigger."
        },
        subjectDialog: {
          addItem: "Add item(s)",
          cancel: "Cancel",
          errorOccured: "An error has occured.",
          searchField: {
            searchTracks: "Search tracks..."
          },
          wantToFind: "I want to find..."
        },
        subjectFeedDialog: {
          addItem: "Add item(s)",
          cancel: "Cancel",
          noAdditional: "No additional feeds available.",
          noFeeds: "No feeds available."
        }
      },
      systemHealth: {
        ruleStates: "The rule states..."
      },
      trackMovement: {
        ruleStates: "The rule states..."
      },
      trigger: {
        actionThatFires: "The action that fires the alert.",
        addAnother: "Add another...",
        anyDynamic: "Any %{count}",
        anyDynamicdots: "Any %{count}...",
        anyLine: "Any line",
        selectDynamic: "Select %{count}(s)",
        selectLine: "Select line",
        triggerDialog: {
          addItem: "Add item(s)",
          cancel: "Cancel",
          errorOccured: "An error has occured.",
          wantToFind: "I want to find..."
        }
      },
      vesselEvents: {
        ruleStates: "The rule states...",
        selectBerth: "Select berths.",
        selectRuleType: "Select a rule type."
      }
    },
    main: {
      components: {
        ruleItem: {
          actions: {
            label: {
              cancel: "Cancel",
              unsubscribe: "Unsubscribe"
            }
          },
          ruleItem: {
            priority: "priority"
          },
          unsubscribeTarget: {
            dialog: {
              children: "Are you sure you want to unsubscribe from %{count}?",
              title: "UNSUBSCRIBE?"
            },
            unsbuscribe: "UNSUBSCRIBE"
          }
        }
      },
      mainJsx: {
        actions: {
          label: {
            cancel: "Cancel",
            delete: "Yes, Delete"
          }
        },
        createButton: {
          createNewRule: "Create New Rule ⏷"
        },
        rulesFilters: {
          dialog: {
            content: "Are you sure you want to delete this rule?",
            title: "DELETE RULE"
          },
          filterBy: "Filter By...",
          listItem: {
            createdby: {
              primaryText: "Created By"
            },
            triggerList: {
              nestedItems: {
                checkbox: {
                  label: {
                    arrivals: "Arrivals",
                    berthUpdates: "Berth Updates",
                    cross: "Cross",
                    departures: "Departures",
                    enter: "Enter",
                    exit: "Exit",
                    loiter: "Loiter",
                    newRequest: "New Request",
                    requestApproval: "Request Approval",
                    securityViolations: "Security Violations"
                  }
                }
              },
              primaryText: "Trigger"
            }
          },
          rulesAreas: {
            TypeAheadFilterContainer: {
              placeholder: "I want to find..."
            },
            rulesSectionWrapper: {
              noRules: "There are no rules subscriptions shared with you at the moment.",
              ruleSectionTitle: "Rule I created (%{count})",
              ruleShared: "Rule shared with me (%{count})",
              rulesContainer: "There are no rules subscriptions shared with you at the moment.",
              rulesSectionTitle: "Rules I created (%{count})",
              rulesShared: "Rules shared with me (%{count})"
            }
          }
        },
        rulesOptions: {
          label: {
            alarmRule: "Alarm Rule",
            eventCreated: "Event Created",
            trackMovement: "Track Movement",
            vesselEventRule: "Vessel Event Rule"
          }
        }
      }
    },
    viewRule: {
      actions: {
        flatButtonLabel: {
          cancel: "Cancel",
          yesDelete: "Yes, Delete"
        }
      },
      alertAudio: {
        alert: "Alert Alert",
        followedBy: "followed by alert notification text.",
        speak: "Speak ",
        speakAlert: "Speak alert notification text."
      },
      alertTable: {
        alertAudio: "Alert Audio",
        alertDismissRule: "Alert Dismiss Rule",
        raisedButton: {
          save: "Save"
        },
        tbody: {
          unsharedRuleMessage: {
            rule: "This rule is not currently being shared with other users.",
            whoGetsAlerts: "Who gets alerts?"
          }
        },
        thead: {
          emails: "Emails",
          priority: "Priority",
          system: "System",
          whoGetsAlerts: "Who gets alerts?"
        }
      },
      dialog: {
        content: "Are you sure you want to delete this rule?",
        title: "DELETE RULE"
      },
      dismissText: {
        dismissAlertsOrg: "Dismiss alerts for all users in the Organization.",
        dismissAlertsUser: "Dismiss alerts by user."
      },
      ruleOperations: {
        delete: "Delete",
        edit: "Edit"
      },
      ruleStates: {
        theRuleStates: "The rule states..."
      },
      viewRuleAttribute: {
        alertDismissRule: "Alert Dismiss Rule"
      },
      viewTitling: {
        createdBy: "Created by %{count}"
      }
    }
  },
  ar: {
    alertGenerator: {
      alertFields: {
        summary: "موجز*"
      },
      alertTable: {
        emails: "رسائل البريد الإلكتروني",
        priority: "أفضلية",
        system: "نظام",
        whoGetsAlert: "من الذي يتلقى التنبيهات؟"
      },
      escalationEvent: {
        title: "حدث التصعيد"
      },
      locationSelection: {
        lat: "خط العرض",
        location: "موقع",
        lon: "خط الطول"
      },
      main: {
        demoAlert: "تنبيه تجريبي",
        loiterRule: "قاعدة التسكع",
        zoneEntry: "دخول المنطقة",
        zoneExit: "خروج المنطقة"
      },
      objectSelection: {
        object: "كائن"
      },
      searchField: {
        search: "بحث..."
      },
      submitControls: {
        generate: "توليد",
        reset: "إعادة ضبط"
      },
      targetSelection: {
        target: "استهداف"
      }
    },
    appBar: {
      title: "قواعد"
    },
    createEditRule: {
      alarm: {
        chooseAlarmSubType: "اختر نوعًا فرعيًا للإنذار للتصفية وفقًا له. (اختياري)",
        chooseAlarmType: "اختر نوع التنبيه للتصفية من خلاله.",
        chooseFeed: "اختر تغذية لمراقبتها.",
        ruleStates: "تنص القاعدة ..."
      },
      components: {
        alertTable: {
          emails: "رسائل البريد الإلكتروني",
          priority: "أفضلية",
          system: "نظام",
          whoGetsAlert: "من الذي يتلقى التنبيهات؟"
        },
        audioSettings: {
          example: "مثال: تنبيه ، تنبيه: حدث انتهاك في منطقة الأمان الرئيسية.",
          note: "ملاحظة: إذا تم تحديد كلا الخيارين أعلاه ، فسيتم إلحاق نص تنبيه التنبيه بأكمله بنص التنبيه الذي أدخله المستخدم.",
          selectingThisRule: "سيؤدي تحديد هذا الخيار إلى نطق نص إشعار التنبيه بالكامل من قاعدة التنبيه أعلاه.",
          speakAlertNotification: "نطق نص إشعار التنبيه",
          speakAlertText: "نطق نص التنبيه"
        },
        dismissSettings: {
          dismissAlertsForAll: "رفض التنبيهات لجميع المستخدمين في المؤسسة",
          dismissAlertsUser: "رفض التنبيهات من قبل المستخدم",
          useForEntireOrg: "استخدم هذا الخيار للسماح لأي مستخدم مشترك برفض تنبيهات الأولوية أو النظام للمؤسسة بأكملها.",
          useToSubscIndividually: "استخدم هذا الخيار للسماح لأي مستخدم مشترك برفض تنبيهات الأولوية أو النظام بشكل فردي."
        },
        ruleFields: {
          descNotes: "الوصف / الملاحظات (اختياري)",
          ruleName: "اسم القاعدة*"
        },
        submitControls: {
          cancel: "إلغاء",
          save: "حفظ"
        }
      },
      conditions: {
        conditionDialog: {
          add: "أضف",
          addCondition: "أضف الشرط",
          allDay: "طوال اليوم",
          cancel: "إلغاء",
          dateRange: "نطاق التاريخ :",
          days: "أيام:",
          dialogError: {
            atleastOneDay: "يجب تحديد يوم واحد على الأقل من أيام الأسبوع حتى تكون الحالة نشطة.",
            atleastOneLimitingFactor: "يجب أن يكون لحالتك عامل مقيد واحد على الأقل.",
            fallAfterStart: "يجب أن يقع تاريخ الانتهاء بعد تاريخ البدء المحدد.",
            fasterThanGreater: "يجب أن تكون سرعة السفر أسرع من أكبر من سرعة السفر أبطأ من",
            onlyOneAllowed: "يسمح فقط بشرط مرة واحدة لكل قاعدة.",
            onlyOneDuration: "يُسمح بشرط مدة واحدة فقط لكل قاعدة.",
            selectAColl: "الرجاء تحديد مجموعة.",
            slowerFasterThanVal: "الرجاء إدخال قيمة السرعة السفر أبطأ من السرعة أو السفر أسرع من",
            startBeforeEndTime: "يجب أن يكون وقت البدء قبل وقت الانتهاء.",
            startEndTimeDiff: "يجب أن يكون وقت البدء ووقت الانتهاء مختلفين.",
            validTimeValue: "الرجاء إدخال قيمة وقت صالحة."
          },
          duration: "Duration",
          inCollection: "في المجموعة ...",
          indefinite: "لأجل غير مسمى",
          minute: "دقيقة",
          minutes: "الدقائق",
          notInCollection: "ليس في المجموعة ...",
          selectCollection: "حدد مجموعة",
          selectCondition: "حدد الشرط",
          setPeriod: "تعيين الفترة",
          setRange: "مجموعة مجموعة",
          speed: "سرعة",
          time: "زمن",
          timeAllowed: "الوقت المسموح به",
          timePeriod: "فترة زمنية:",
          to: "إلى",
          travellingFasterThan: "السفر أسرع من:",
          travellingSlowerThan: "السفر أبطأ من:",
          unit: "وحدة",
          update: "تحديث"
        },
        main: {
          addACondition: "إضافة شرط ...",
          addAnother: "أضف آخر...",
          addCondition: "أضف الشرط",
          cancel: "إلغاء",
          condition: "%{count} حالة",
          inCollection: "في المجموعة (%{count})",
          notInCollection: "ليس في المجموعة (%{count})",
          title: "الشروط"
        }
      },
      createEvent: {
        eventSubType: "اختر نوع الحدث الفرعي لمراقبته.",
        eventTemplate: "اختر قالب حدث لمراقبته.",
        eventType: "اختر نوع الحدث المراد مراقبته.",
        ruleStates: "تنص القاعدة ..."
      },
      escalations: {
        chooseTemp: "اختر قالبًا ...",
        escalationDialog: {
          add: "أضف",
          cancel: "إلغاء",
          noEventTemp: "ليس لديك أي قوالب للأحداث. يرجى إنشاء قالب الحدث للتحديد.",
          wantToFind: "انا اريد ان اجد..."
        },
        title: "حدث التصعيد"
      },
      genericAttribute: {
        multiSelection: {
          addAnother: "أضف آخر...",
          addDynamic: "يضيف %{count}...",
          multiSelectionDialog: {
            addItem: "اضافة عنصر",
            cancel: "إلغاء",
            wantToFind: "انا اريد ان اجد..."
          }
        },
        singleSelection: {
          addDynamic: "يضيف %{count}...",
          singleSelectionDialog: {
            addItem: "اضافة عنصر",
            cancel: "إلغاء",
            wantToFind: "انا اريد ان اجد..."
          }
        }
      },
      main: {
        errorText: {
          alertTextReq: "نص التنبيه مطلوب إذا تم تحديد خيار نص التنبيه.",
          atLeastTwo: "يجب تحديد خيار واحد على الأقل من الخيارين."
        }
      },
      subject: {
        subjectAttributes: {
          addAnother: "أضف آخر...",
          addEntity: "إضافة كيان ...",
          addFeed: "أضف مرشح التغذية",
          anyTrack: "أي مسار",
          editFeed: "تحرير مرشح التغذية",
          selectTracks: "حدد المسار (المسارات)",
          title: "الموضوع",
          tracks: "المسار (ق) التي يمكن أن ترتكب الزناد."
        },
        subjectDialog: {
          addItem: "إضافة عناصر",
          cancel: "إلغاء",
          errorOccured: "حدث خطأ.",
          searchField: {
            searchTracks: "البحث عن المسارات ..."
          },
          wantToFind: "انا اريد ان اجد..."
        },
        subjectFeedDialog: {
          addItem: "إضافة عناصر",
          cancel: "إلغاء",
          noAdditional: "لا يغذي إضافية المتاحة.",
          noFeeds: "لا يغذي المتاحة."
        }
      },
      systemHealth: {
        ruleStates: "تنص القاعدة ..."
      },
      trackMovement: {
        ruleStates: "تنص القاعدة ..."
      },
      trigger: {
        actionThatFires: "الإجراء الذي يطلق التنبيه.",
        addAnother: "أضف آخر...",
        anyDynamic: "أي %{count}",
        anyDynamicdots: "أي %{count}...",
        anyLine: "أي خط",
        selectDynamic: "اختر %{count}(s)",
        selectLine: "حدد الخط",
        triggerDialog: {
          addItem: "إضافة عناصر",
          cancel: "إلغاء",
          errorOccured: "حدث خطأ.",
          wantToFind: "انا اريد ان اجد..."
        }
      },
      vesselEvents: {
        ruleStates: "تنص القاعدة ...",
        selectBerth: "اختر الولادات.",
        selectRuleType: "حدد نوع القاعدة."
      }
    },
    main: {
      components: {
        ruleItem: {
          actions: {
            label: {
              cancel: "يلغي",
              unsubscribe: "إلغاء الاشتراك"
            }
          },
          ruleItem: {
            priority: "أفضلية"
          },
          unsubscribeTarget: {
            dialog: {
              children: "هل أنت متأكد أنك تريد إلغاء الاشتراك من %{count}?",
              title: "إلغاء الاشتراك؟"
            },
            unsbuscribe: "إلغاء الاشتراك"
          }
        }
      },
      mainJsx: {
        actions: {
          label: {
            cancel: "يلغي",
            delete: "نعم ، احذف"
          }
        },
        createButton: {
          createNewRule: "إنشاء قاعدة جديدة ⏷"
        },
        rulesFilters: {
          dialog: {
            content: "هل أنت متأكد أنك تريد حذف هذه القاعدة؟",
            title: "حذف القاعدة"
          },
          filterBy: "مصنف بواسطة...",
          listItem: {
            createdby: {
              primaryText: "انشأ من قبل"
            },
            triggerList: {
              nestedItems: {
                checkbox: {
                  label: {
                    arrivals: "الوصول",
                    berthUpdates: "تحديثات الرصيف",
                    cross: "تعبر",
                    departures: "المغادرين",
                    enter: "يدخل",
                    exit: "مخرج",
                    loiter: "لوتر",
                    newRequest: "طلب جديد",
                    requestApproval: "طلب الموافقة",
                    securityViolations: "الانتهاكات الأمنية"
                  }
                }
              },
              primaryText: "اثار"
            }
          },
          rulesAreas: {
            TypeAheadFilterContainer: {
              placeholder: "انا اريد ان اجد..."
            },
            rulesSectionWrapper: {
              noRules: "لا توجد اشتراكات قواعد مشتركة معك في الوقت الحالي.",
              ruleSectionTitle: "القاعدة أنا خلقت (%{count})",
              ruleShared: "حكم مشتركة معي (%{count})",
              rulesContainer: "لا توجد اشتراكات قواعد مشتركة معك في الوقت الحالي.",
              rulesSectionTitle: "صنعت (%{count})",
              rulesShared: "القواعد المشتركة معي (%{count})"
            }
          }
        },
        rulesOptions: {
          label: {
            alarmRule: "حكم الإنذار",
            eventCreated: "تم إنشاء الحدث",
            trackMovement: "تتبع الحركة",
            vesselEventRule: "قاعدة حدث السفينة"
          }
        }
      }
    },
    viewRule: {
      actions: {
        flatButtonLabel: {
          cancel: "يلغي",
          yesDelete: "نعم ، احذف"
        }
      },
      alertAudio: {
        alert: "انذار",
        followedBy: "متبوعًا بنص إشعار التنبيه.",
        speak: "يتكلم",
        speakAlert: "نطق نص إشعار التنبيه."
      },
      alertTable: {
        alertAudio: "صوت التنبيه",
        alertDismissRule: "تنبيه رفض القاعدة",
        raisedButton: {
          save: "يحفظ"
        },
        tbody: {
          unsharedRuleMessage: {
            rule: "لا يتم حاليًا مشاركة هذه القاعدة مع مستخدمين آخرين.",
            whoGetsAlerts: "من الذي يتلقى التنبيهات؟"
          }
        },
        thead: {
          emails: "رسائل البريد الإلكتروني",
          priority: "أفضلية",
          system: "نظام",
          whoGetsAlerts: "من الذي يتلقى التنبيهات؟"
        }
      },
      dialog: {
        content: "هل أنت متأكد أنك تريد حذف هذه القاعدة؟",
        title: "حذف القاعدة"
      },
      dismissText: {
        dismissAlertsOrg: "رفض التنبيهات لجميع المستخدمين في المؤسسة.",
        dismissAlertsUser: "رفض التنبيهات من قبل المستخدم."
      },
      ruleOperations: {
        delete: "حذف",
        edit: "تعديل"
      },
      ruleStates: {
        theRuleStates: "تنص القاعدة ..."
      },
      viewRuleAttribute: {
        alertDismissRule: "تنبيه رفض القاعدة"
      },
      viewTitling: {
        createdBy: "انشأ من قبل %{count}"
      }
    }
  }
};