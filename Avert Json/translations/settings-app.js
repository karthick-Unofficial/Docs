const translations = {
	en: {
		login:{
			emailHintText: "Username or Email Address",
			passwordHintText: "Password",
			forgotPassword: "Forgot Password?",
			loginButton: "Login",
			recoveryText: "Forgot your password? Please enter your email address below for a recovery email.",
			emailAddress: "Email Address",
			backToLogin: "Back To Login",
			sendButton: "Send",
            sentText: "We've sent an email containing instructions for resetting your password.",
            click: "Click",
            here: "here",
            toReturn: "to return to the login page.",
			version: "Version %{count}",
			copyright: "All Rights Reserved. Copyright 2020",
            errorMessage: {
			emptyUser: "Please enter a valid username",
            emptyPassword: "Please enter a password",
            invalidLogin: "Invalid login info",
            forgotErrText: "Please enter an email address",
            expiredText: "This Reset Link is not Valid or Has Expired",
            bothPassText: "Both password fields must match."
            },
            hintText: {
                newPass: "New Password",
                confirmPass: "Confirm New Password"
            },
            setInitial: {
                title: "To complete account creation, please choose a password below.",
                setPassBtn: "Set Password",
                successMsg: "Your password has been successfully set. You will be redirected to the login page momentarily."
            },
            Reset: {
                title: "To complete password reset, please enter a new password below.",
                changePassBtn: "Change Password",
                successMsg: "Your password has been successfully reset. You will be redirected to the login page momentarily."
            }
		},
        changePassword: {
            errorMessage: {
                notMatch: "The provided passwords do not match",
                chooseNew: "Please choose a new password",
                required: "This field is required."
            },
            formField: {
                oldPass: "Old Password",
                newPass: "New Password",
                confirmPass: "Confirm New Password",
                saveBtn: "SAVE",
                cancelBtn: "CANCEL"
            }
        },
		appBar: {
			title: "Settings"
		},
		sideBar: {
			option1: {
				variant1 : "My Account Settings",
				variant2 : "User Account Settings"
			}, 
			option2: "Manage Organization",
			option3: "Manage Ecosystem"
		},
		mainContent: {
			accountSettings: {
				titleText: "Basic personal information, password management, access and system preferences.",
				profile: {
					title: "Profile",
					profileText: "Basic account and profile information.",
					photo: "PHOTO",
					photoText: "A photo helps personalize your account",
					name: "NAME",
					email: "EMAIL",
					officePhone: "OFFICE PHONE",
					cellPhone: "CELL PHONE",
					organization: "ORGANIZATION",
					userRole: "USER ROLE",
					password: "PASSWORD",
					editProfile: "EDIT PROFILE"
				},
				settings: {
					title: "Settings",
					settingsText: "Personal Settings and preferences.",
					alertAudio: "Alert Audio",
					alertAudioText: "Audio preferences for alert notifications.",
					on: "On",
					off: "Off",
					trackHistory: "Track History",
					duration: "Duration",
					units: "Units of Measure",
					unitsText: "Set measurement units for map displays.",
					coordinateSystem: "Coordinate System",
					groundSpeed: "Ground Distance/Speed",
					timeFormat: "Time Format",
					timeFormatText: "Set system-wide time format.",
					hourFormat1: "12 Hour",
					hourFormat2: "24 Hour",
					localeLabel: "Language",
                    userLocale: "User Locale",
					localeText: "Set language preferences."
				},
                userApps: {
                    title: "Apps",
                    titleText: "Permissions for Apps you have been granted access to."
                },
                userIntegrations: {
                    title: "Feeds",
                    titleText: "Data feeds that you have been granted access to."
                },
                editUser: {
                    title1: "My Account Settings",
                    title2: "User Account Settings",
                    titleText1: "Edit your profile",
                    titleText2: "Edit user profile",
                    editProfile: "Edit Profile",
                    oldPass: "Old Password",
                    newPass: "New Password",
                    confirmPass: "Confirm New Password",
                    firstName: "First Name",
                    lastName: "Last Name",
                    cellPhone: "Cell Phone",
                    officePhone: "Office Phone",
                    email: "Email",
                    cancelBtn: "CANCEL",
                    doneBtn: "DONE",
                    deleteUser: "Delete User",
                    confirmBtn: "CONFIRM",
                    errorMessage: {
                        passNotMatch: "Passwords must match",
                        setNewPass: "Please set a new password.",
                        currentPass: "Enter your current password.",
                        emptyFieldErr: "One of the name fields must have data.",
                        formatText: "Must be in the format (XXX)-XXX-XXXX",
                        validEmail: "Please enter a valid email"
                    },
                    dialog: {
                        title: "Delete user?",
                        confirmText: "Are you sure that you want to delete this user?"
                    }
                }
			},
            manageOrganization:{
                title: "Manage Organization",
                titleText: "Configure global organization settings and manage users and access permissions.",
                orgProfile: {
                    title: "Organization Profile",
                    titleText: "Basic organizational profile information.",
                    photo: "PHOTO",
                    photoText: "A logo or image",
                    organization: "ORGANIZATION",
                    description: "DESCRIPTION",
                    editOrganization: {
                        titleDesc: "Edit your organization profile.",
                        formTitle: "Edit Organization Profile",
                        changeProfile: "Change Profile Image",
                        orgName: "Organization Name",
                        orgDescription: "Organization Description %{count}/50",
                        errorMessage: {
                            emptyName: "Organization must have a name",
                            descTooLong: "Description is too long"
                        }
                    }
                },
                orgSettings: {
                    title: "Organization Settings",
                    titleText: "Basic organizational profile information.",
                    activeDir: {
                        title: "Active Directory",
                        titleText: "Manage Active Directory settings.",
                        subText: "Configure and test Active Directory Settings.",
                        formTitle: "Active Directory Settings",
                        authLabel: "Authentication",
                        hostLabel: "Host",
                        portLabel: "Port",
                        userLabel: "Username",
                        passLabel: "Password",
                        groupLabel: "Group Name",
                        testconLabel: "Test Connection",
                        autosyncLabel: "Automatically sync",
                        usersLabel: "Users",
                        emptyUsersText: "Group contains no users. Users will be created as they are added to the group.",
                        cancelBtn: "CANCEL",
                        saveBtn: "SAVE",
                        toolTip: {
                            addTip: "User will be added.",
                            removeTip: "User will be removed.",
                            disableTip: "User will be disabled.",
                            enableTip: "User will be enabled."
                        }
                    },
                    manageUserRoles: {
                        title: "Manage User Roles",
                        titleText: "Create and apply custom roles with access permissions.",
                        formTitle: "Create or Select Role Template",
                        roleLabel: "Select Role",
                        applyToUsers: "Apply to Users",
                        deleteRole: "Delete Role",
                        addnewBtn: "ADD NEW ROLE",
                        appsTitle: "Apps",       
                        manage: "Manage",
                        share: "Share",    
                        feedsTitle: "Feeds",
                        cancelBtn: "CANCEL",
                        deleteBtn: "DELETE",
                        confirmText: "Are you sure you want to delete role",
                        note: "Note: Deletion is disabled while there are users still assigned to the role",       
                        dialog: {
                            title: "Add New Role",
                            addBtn: "ADD",
                            roleDesc: "Role Description",
                            applyRole: "Apply Role",
                            selectRole: "Select Role",
                            search: "Search"
                        }      
                    },
                    manageUsers: {
                        title: "Manage Users",
                        titleText: "Create and manage users.",
                        formTitle: "Users",
                        formTitleText: "Manage users and apply roles for each user.",
                        formTitleLink: "Manage Roles here.",
                        addUserBtn: "ADD NEW USER",
                        hideUsers: "Hide Inactive Users",
                        admin: "Admin",
                        active: "Active",
                        userRoleLabel: "User Role",
                        dialog: {
                            title: "Create New User",
                            userRole: "User Role",
                            firstName: "First Name",
                            lastName: "Last Name",
                            cellPhone: "Cell Phone",
                            officePhone: "Office Phone",
                            email: "Email",
                            cancelBtn: "CANCEL",
                            doneBtn: "DONE",
                            errorMessage: {
                                selectRoleErr: "Must select a role for the new user",
                                emptyFieldErr: "One of the name fields must have data.",
                                formatText: "Must be in the format (XXX)-XXX-XXXX",
                                validEmail: "Please enter a valid email"
                            }
                        }
                    },
                    sharingConn: {
                        title: "Sharing Connections",
                        titleText: "Manage sharing tokens with other organizations.",
                        formTitle1: "Shared Connections to Other Organizations",
                        formTitle1Text: "Connection tokens you have provided to other Organizations. Copy and provide active token to sharing partner.",
                        addConnButton: "ADD CONNECTION",
                        activeConn: "Active Connections",
                        formTitle2: "Connections shared to your Organization",
                        formTitle2Text: "Connection tokens you have imported from other Organizations.",
                        importBtn: "IMPORT TOKEN",
                        tokenPlaceholder: "Paste token here",
                        import: "IMPORT",
                        cancelBtn: "CANCEL",
                        clipboardText: "Copied to clipboard!"
                    },
                    manageFeedSharing: {
                        title: "Manage Feed Sharing Policies",
                        titleText: "Manage Org to Org feed sharing policies.",
                        subText: "Set sharing policies for each data feed to partner organizations.",
                        policies: {
                            titleDesc: "Set sharing policies for each data feed to partner organizations.",
                            deactivate: "Deactivate All",
                            startDatePickerError: "Starting date cannot be after the ending date.",
                            endDatePickerError: "Ending date cannot be before the starting date.",
                            alwaysHaveAccess: "Always has access to this feed.",
                            onlyWhenAdded: "Has access only when added to a shared event."
                        },
                        radioLabel: {
                            policyTerm: "Policy Term",
                            allowedPerm: "Allowed Permissions",
                            never: "Never",
                            always: "Always",
                            event: "Event",
                            unlimited: "Unlimited"
                        }
                    }
                },
                errorMessage: {
                    requestProblem: "There was a problem with your request.",
                    connError:  "Could not connect. Please verify username, password, and connection.",
                }
            },
            manageEcosystem: {
                title: "Manage Ecosystem",
                titleText: "Provision new Organizations with app and sharing permissions.",
                formTitle: "Ecosystem Organizations",
                addnewBtn: "ADD NEW ORGANIZATION",
                hideDisabled: "Hide Disabled",
                active: "Active",
                 AddOrgForm: {
                    title: "Add New Organization",
                    changeProfile: "Change Profile Image",
                    orgNameLabel: "Organization Name",
                    orgDescription: "Organization Description %{count}/50",
                    initialAdmin: "Initial Organization Admin",
                    firstName: "First Name",
                    lastName: "Last Name",
                    cellPhone: "Cell Phone",
                    officePhone: "Office Phone",
                    email: "Email",
                    cancelBtn: "CANCEL",
                    doneBtn: "DONE"
                },
                editEcosystem: {
                    titleText: "Edit organization sharing connections and app access.",
                    appsTitle: "Apps", 
                    orgAdminTitle: "Org Administrators",
                    email: "EMAIL",
                    sharingConn: "Sharing Connections",
                    used: "Used",
                    total: "Total"
                },
                errorMessage: {
                    emptyOrg: "Organization must have a name",
                    descTooLong: "Description is too long",
                    emptyField: "One of the name fields must have data.",
                    formatText: "Must be in the format (XXX)-XXX-XXXX",
                    validEmail: "Please enter a valid email"
                }
            },
            shared:{
                articleContainer: {
                    defaultHeader: "This is a header title"
                },
                errorIcon: {
                    errorText: "There's been an error saving your preferences. Please check your network connection and try again."
                },
                notAuthorized: {
                    title: "Not Authorized.",
                    titleText: "You do not have the proper permissions level to access this page.",
                    backBtn: "Go Back"
                },
                notFound: {
                    title: "Resource not found.",
                    titleText: "The requested user or organization page is not available or does not exist.",
                    backBtn: "Go Back"
                },
                profileDropzone: {
                    uploadBtn: "Upload Image"
                }
            }
		}
	},
	ar: {
		login:{
			emailHintText: "اسم المستخدم أو البريد الالكتروني",
			passwordHintText: "كلمه السر",
			forgotPassword: "نسيت كلمة المرور الخاصة بك ؟",
			loginButton: "تسجيل الدخول",
			recoveryText: "نسيت رقمك السري؟ الرجاء إدخال عنوان بريدك الإلكتروني أدناه لتلقي بريد إلكتروني مخصص للطوارئ.",
			emailAddress: "عنوان البريد الإلكتروني",
			backToLogin: "العودة إلى تسجيل الدخول",
			sendButton: "إرسال",
            sentText: "لقد أرسلنا بريدًا إلكترونيًا يحتوي على تعليمات لإعادة تعيين كلمة المرور الخاصة بك.",
            click: "انقر",
            here: "هنا",
            toReturn: "للعودة إلى صفحة تسجيل الدخول.",
			version: "%{count} الإصدار",
			copyright: "كل الحقوق محفوظة. حقوق النشر 2020",
            errorMessage: {
			emptyUser: "الرجاءادخال اسم مستخدم صحيح",
            emptyPassword: "الرجاء إدخال كلمة المرور",
			invalidLogin: "معلومات تسجيل الدخول غير صالحة",
			forgotErrText: "الرجاء إدخال عنوان البريد الإلكتروني",
            expiredText: "رابط إعادة التعيين هذا غير صالح أو انتهت صلاحيته",
            bothPassText: "يجب أن يتطابق كلا حقلي كلمة المرور."
            },
            hintText: {
                newPass: "كلمة مرور جديدة",
                confirmPass: "تأكيد كلمة المرور الجديدة"
            },
            setInitial: {
                title: "لإكمال إنشاء الحساب ، يرجى اختيار كلمة المرور أدناه.",
                setPassBtn: "ضبط كلمة السر",
                successMsg: "تم تعيين كلمة المرور الخاصة بك بنجاح. ستتم إعادة توجيهك إلى صفحة تسجيل الدخول في الحال."
            },
            Reset: {
                title: "لاستكمال إعادة تعيين كلمة المرور ، يرجى إدخال كلمة مرور جديدة أدناه.",
                changePassBtn: "تغيير كلمة المرور",
                successMsg: "تم إعادة تعيين كلمة المرور الخاصة بك بنجاح. ستتم إعادة توجيهك إلى صفحة تسجيل الدخول في الحال."
            }
		},
        changePassword: {
            errorMessage: {
                notMatch: "كلمات المرور المقدمة غير متطابقة",
                chooseNew: "الرجاء اختيار كلمة مرور جديدة",
                required: "هذه الخانة مطلوبه."

            },
            formField: {
                oldPass: "كلمة سر قديمة",
                newPass: "كلمة مرور جديدة",
                confirmPass: "تأكيد كلمة المرور الجديدة",
                saveBtn: "حفظ",
                cancelBtn: "إلغاء"
            }
        },
		appBar: {
			title: "إعدادات"
		},
		sideBar: {
			option1: {
				variant1: "إعدادات حسابي",
				variant2: "إعدادات حساب المستخدم"
			},
			option2: "إدارة المنظمة",
			option3: "إدارة النظام البيئي"
		},
		mainContent: {
			accountSettings: {
				titleText: "المعلومات الشخصية الأساسية وإدارة كلمات المرور والوصول وتفضيلات النظام.",
				profile: {
					title: "مظهر جانبي",
					profileText: "معلومات الحساب والملف الشخصي الأساسية.",
					photo: "صورة فوتوغرافية",
					photoText: "أ ساعد الصورة في تخصيص حسابك",
					name: "اسم",
					email: "بريد الالكتروني",
					officePhone: "هاتف المكتب",
					cellPhone: "الهاتف الخلوي",
					organization: "منظمة",
					userRole: "دور المستخدم",
					password: "كلمه السر",
					editProfile: "تعديل الملف الشخصي"
				},
				settings: {
					title: "إعدادات",
					settingsText: "الإعدادات والتفضيلات الشخصية.",
					alertAudio: "صوت التنبيه",
					alertAudioText: "تفضيلات الصوت لإخطارات التنبيه.",
					on: "على",
					off: "إيقاف",
					trackHistory: "تتبع التاريخ",
					duration: "المدة الزمنية",
					units: "وحدات القياس",
					unitsText: "تعيين وحدات القياس لعروض الخريطة.",
					coordinateSystem: "نظام الإحداثيات",
					groundSpeed: "المسافة / السرعة على الأرض",
					timeFormat: "تنسيق الوقت",
					timeFormatText: "تعيين تنسيق الوقت على مستوى النظام.",
					hourFormat1: "12 ساعة",
					hourFormat2: "24 ساعة",
					localeLabel: "لغة",
                    userLocale: "لغة المستخدم",
					localeText: "قم بتعيين تفضيلات اللغة"
				},
                userApps: {
                    title: "تطبيقات",
                    titleText: "أذونات التطبيقات التي تم منحك حق الوصول إليها."
                },
                 userIntegrations: {
                    title: "يغذي",
                    titleText: "موجزات البيانات التي تم منحك حق الوصول إليها."
                },
                editUser: {
                    title1: "إعدادات حسابي",
                    title2: "إعدادات حساب المستخدم",
                    titleText1: "عدل ملفك الشخصي",
                    titleText2: "تحرير ملف تعريف المستخدم",
                    editProfile: "تعديل الملف الشخصي",
                    oldPass: "كلمة سر قديمة",
                    newPass: "كلمة مرور جديدة",
                    confirmPass: "تأكيد كلمة المرور الجديدة",
                    firstName: "الاسم الأول",
                    lastName: "اسم العائلة",
                    cellPhone: "الهاتف الخلوي",
                    officePhone: "هاتف المكتب",
                    email: "بريد الالكتروني",
                    cancelBtn: "إلغاء",
                    doneBtn: "تم",
                    deleteUser: "حذف المستخدم",
                    confirmBtn: "تأكيد",
                    errorMessage: {
                        passNotMatch: "يجب أن تتطابق كلمات المرور",
                        setNewPass: "الرجاء تعيين كلمة مرور جديدة.",
                        currentPass: "أدخل كلمة المرور الحالية.",
                        emptyFieldErr: "يجب أن يحتوي أحد حقول الاسم على بيانات.",
                        formatText: "يجب أن يكون بتنسيق (XXX) -XXX-XXXX",
                        validEmail: "يرجى إدخال البريد الإلكتروني الصحيح"
                    },
                    dialog: {
                        title: "حذف المستخدم?",
                        confirmText: "هل أنت متأكد أنك تريد حذف هذا المستخدم؟"
                    }
                }
			},
            manageOrganization:{
                title: "إدارة المنظمة",
                titleText: "تكوين إعدادات المنظمة العالمية وإدارة المستخدمين وأذونات الوصول.",
                orgProfile: {
                    title: "الملف التعريفي للمنظمة",
                    titleText: "معلومات الملف التعريفي التنظيمي الأساسية.",
                    photo: "صورة فوتوغرافية",
                    photoText: "شعار أو صورة",
                    organization: "منظمة",
                    description: "الوصف",
                    editOrganization: {
                        titleDesc: "قم بتحرير ملف تعريف مؤسستك.",
                        formTitle: "تحرير ملف تعريف المؤسسة",
                        changeProfile: "تغيير صورة الملف الشخصي",
                        orgName: "اسم المنظمة",
                        orgDescription: "50/ %{count} وصف المنظمة",
                        errorMessage: {
                            emptyName: "يجب أن يكون للمنظمة اسم",
                            descTooLong: "الوصف طويل جدًا"
                        }
                    }
                },
                 orgSettings: {
                    title: "إعدادات المنظمة",
                    titleText: "معلومات الملف التعريفي التنظيمي الأساسية.",
                    activeDir: {
                        title: "الدليل النشط",
                        titleText: "إدارة إعدادات الدليل النشط.",
                        subText: "تكوين واختبار إعدادات Active Directory",
                        formTitle: "إعدادات الدليل النشط",
                        authLabel: "المصادقة",
                        hostLabel: "مضيف",
                        portLabel: "ميناء",
                        userLabel: "اسم االمستخدم",
                        passLabel: "كلمه السر",
                        groupLabel: "أسم المجموعة",
                        testconLabel: "اتصال الاختبار",
                        autosyncLabel: "المزامنة تلقائيًا",
                        usersLabel: "المستخدمون",
                        emptyUsersText: "لا تحتوي المجموعة على مستخدمين. سيتم إنشاء المستخدمين عند إضافتهم إلى المجموعة.",
                        cancelBtn: "إلغاء",
                        saveBtn: "حفظ",
                        toolTip: {
                            addTip: "سيتم إضافة المستخدم.",
                            removeTip: "ستتم إزالة المستخدم.",
                            disableTip: "سيتم تعطيل المستخدم.",
                            enableTip: "سيتم تمكين المستخدم."
                        }
                    },
                    manageUserRoles: {
                        title: "إدارة أدوار المستخدم",
                        titleText: "قم بإنشاء وتطبيق أدوار مخصصة مع أذونات الوصول.",
                        formTitle: "إنشاء أو تحديد قالب دور",
                        roleLabel: "حدد دور",
                        applyToUsers: "تنطبق على المستخدمين",
                        deleteRole: "حذف الدور",
                        addnewBtn: "أضف دورًا جديدًا",
                        appsTitle: "تطبيقات",
                        manage: "تدبير",
                        share: "نصيب",
                        feedsTitle: "يغذي",
                        cancelBtn: "إلغاء",
                        deleteBtn: "حذف",
                        confirmText: "هل أنت متأكد أنك تريد حذف الدور",
                        note: "ملاحظة: تم تعطيل الحذف بينما لا يزال هناك مستخدمون معينون للدور",       
                        dialog: {
                            title: "إضافة دور جديد",
                            addBtn: "يضيف",
                            roleDesc: "وصف الدور",
                            applyRole: "تطبيق الدور",
                            selectRole: "حدد الدور",
                            search: "بحث"
                        }    
                    },
                    manageUsers: {
                        title: "ادارة المستخدمين",
                        titleText: "إنشاء وإدارة المستخدمين.",
                        formTitle: "المستخدمون",
                        formTitleText: "إدارة المستخدمين وتطبيق الأدوار لكل مستخدم.",
                        formTitleLink: "إدارة الأدوار هنا.",
                        addUserBtn: "إضافة مستخدم جديد",
                        hideUsers: "إخفاء المستخدمين غير النشطين",
                        admin: "مشرف",
                        active: "نشط",
                        userRoleLabel: "دور المستخدم",
                        dialog: {
                            title: "إنشاء مستخدم جديد",
                            userRole: "دور المستخدم",
                            firstName: "الاسم الأول",
                            lastName: "اسم العائلة",
                            cellPhone: "الهاتف الخلوي",
                            officePhone: "هاتف المكتب",
                            email: "بريد الالكتروني",
                            cancelBtn: "إلغاء",
                            doneBtn: "تم",
                            errorMessage: {
                                selectRoleErr: "يجب تحديد دور للمستخدم الجديد",
                                emptyFieldErr: "يجب أن يحتوي أحد حقول الاسم على بيانات.",
                                formatText: "يجب أن يكون بتنسيق (XXX) -XXX-XXXX",
                                validEmail: "يرجى إدخال البريد الإلكتروني الصحيح"
                            }
                        }
                    },
                    sharingConn: {
                        title: "اتصالات تقاسم",
                        titleText: "إدارة تبادل الرموز مع المنظمات الأخرى.",
                        formTitle1: "اتصالات مشتركة مع المنظمات الأخرى",
                        formTitle1Text: "رموز الاتصال التي قدمتها للمنظمات الأخرى. انسخ وقدم رمزًا مميزًا نشطًا لشريك المشاركة.",
                        addConnButton: "إضافة اتصال",
                        activeConn: "اتصالات نشطة",
                        formTitle2: "اتصالات مشتركة لمؤسستك",
                        formTitle2Text: "رموز الاتصال التي قمت باستيرادها من مؤسسات أخرى.",
                        importBtn: "رمز الاستيراد",
                        tokenPlaceholder: "لصق الرمز هنا",
                        import: "يستورد",
                        cancelBtn: "إلغاء",
                        clipboardText: "نسخ إلى الحافظة!"
                    },
                     manageFeedSharing: {
                        title: "إدارة سياسات مشاركة الأعلاف",
                        titleText: "إدارة سياسات مشاركة خلاصة المؤسسة إلى المؤسسة.",
                        subText: "قم بتعيين سياسات المشاركة لكل موجز بيانات للمنظمات الشريكة.",
                        policies: {
                            titleDesc: "قم بتعيين سياسات المشاركة لكل موجز بيانات للمنظمات الشريكة.",
                            deactivate: "قم بإلغاء تنشيط الكل",
                            startDatePickerError: "لا يمكن أن يكون تاريخ البدء بعد تاريخ الانتهاء.",
                            endDatePickerError: "لا يمكن أن يكون تاريخ الانتهاء قبل تاريخ البدء.",
                            alwaysHaveAccess: "دائما لديه حق الوصول إلى هذه الخلاصة.",
                            onlyWhenAdded: "لديه حق الوصول فقط عند إضافته إلى حدث مشترك."
                        },
                        radioLabel: {
                            policyTerm: "مصطلح السياسة",
                            allowedPerm: "الأذونات المسموح بها",
                            never: "أبدا",
                            always: "دائما",
                            event: "حدث",
                            unlimited: "غير محدود"
                        }
                    }
                },
                errorMessage: {
                    requestProblem: "كانت هناك مشكلة مع طلبك.",
                    connError:  "تعذر الاتصال. يرجى التحقق من اسم المستخدم وكلمة المرور والاتصال.",
                }
            },
             manageEcosystem: {
                title: "إدارة النظام البيئي",
                titleText: "تزويد المؤسسات الجديدة بأذونات التطبيق والمشاركة.",
                formTitle: "منظمات النظام البيئي",
                addnewBtn: "إضافة منظمة جديدة",
                hideDisabled: "إخفاء المعوقين",
                active: "نشط",
                AddOrgForm: {
                    title: "أضف مؤسسة جديدة",
                    changeProfile: "تغيير صورة الملف الشخصي",
                    orgNameLabel: "اسم المنظمة",
                    orgDescription: "50/ %{count} وصف المنظمة",
                    initialAdmin: "إدارة المنظمة الأولية",
                    firstName: "الاسم الأول",
                    lastName: "اسم العائلة",
                    cellPhone: "الهاتف الخلوي",
                    officePhone: "هاتف المكتب",
                    email: "بريد الالكتروني",
                    cancelBtn: "إلغاء",
                    doneBtn: "تم"
                },
                 editEcosystem: {
                    titleText: "تحرير اتصالات مشاركة المؤسسة والوصول إلى التطبيق.",
                    appsTitle: "تطبيقات",
                    orgAdminTitle: "مسؤولو المؤسسة",
                    email: "بريد الالكتروني",
                    sharingConn: "اتصالات تقاسم",
                    used: "مستخدم",
                    total: "المجموع"
                },
                 errorMessage: {
                    emptyOrg: "يجب أن يكون للمنظمة اسم",
                    descTooLong: "الوصف طويل جدًا",
                    emptyField: "يجب أن يحتوي أحد حقول الاسم على بيانات.",
                    formatText: "يجب أن يكون بتنسيق (XXX) -XXX-XXXX",
                    validEmail: "يرجى إدخال البريد الإلكتروني الصحيح"
                }
            },
            shared: {
                articleContainer: {
                    defaultHeader: "هذا هو العنوان الرئيسي"
                },
                errorIcon: {
                    errorText: "حدث خطأ أثناء حفظ تفضيلاتك. يرجى التحقق من اتصال الشبكة الخاص بك وحاول مرة أخرى."
                },
                 notAuthorized: {
                    title: "غير مخول.",
                    titleText: "ليس لديك مستوى الأذونات المناسب للوصول إلى هذه الصفحة.",
                    backBtn: "العودة"
                },
                notFound: {
                    title: "الموارد غير موجود.",
                    titleText: "المستخدم أو صفحة المؤسسة المطلوبة غير متوفرة أو غير موجودة.",
                    backBtn: "العودة"
                },
                 profileDropzone: {
                    uploadBtn: "تحميل الصور"
                }
            }
		}
	}
};

export default translations;