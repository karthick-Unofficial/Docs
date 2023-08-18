const champApp = {
    en: {
        appBar: {
            title: "CHAMP"
        },
        customers: {
            manageCustomers: {
                systemHealth: "System Health",
                clickCustomer: "Click a customer to see details"
            },
            instanceCard: {
                disconnected: "Disconnected"
            },
            instanceProfile: {
                good: "Good",
                systems: "Systems",
                invalidInstance: "Invalid Instance",
                disconnected: " (Disconnected)",
                activeUsers: "Active Users",
                quickFix: "Quick Fix",
                buttons: {
                    restartEco: "Restart Ecosystem",
                    restartInt: "Restart Integration",
                    restartOther: "Restart Other Service"
                },
                healthChecks: "Health Checks",
                lastUpdate: "Last Update:",
                dialog: {
                    title: "Restart Service"
                }
            },
            userManagement: {
                instance: "Instance",
                userMangtitle: "User Management",
                users: "Users",
                adminTooltip: "Admin User",
                active: "Active (%{count} sessions)",
                inactive: "Inactive",
                logOut: "Log Out",
                dialog: {
                    title: "Log Out User",
                    cancel: "CANCEL",
                    confirm: "CONFIRM",
                    confirmation: "Are you sure you want to log out user:"
                }
            }
        },
        sideNav: {
            systemHealth: "System Health",
            configManagement: "Configuration Management",
            deploymentManagement: "Deployment Management"
        }
    },
    ar: {
        appBar: {
            title: "بطل"
        },
        customers: {
            manageCustomers: {
                systemHealth: "صحة النظام",
                clickCustomer: "انقر فوق أحد العملاء لمعرفة التفاصيل"
            },
            instanceCard: {
                disconnected: "انقطع الاتصال"
            },
            instanceProfile: {
                good: "جيد",
                systems: "الأنظمة",
                invalidInstance: "مثيل غير صالح",
                disconnected: "(انقطع الاتصال) ",
                activeUsers: "المستخدمين النشطين",
                quickFix: "إصلاح سريع",
                buttons: {
                    restartEco: "أعد تشغيل النظام البيئي",
                    restartInt: "إعادة تشغيل التكامل",
                    restartOther: "أعد تشغيل خدمة أخرى"
                },
                healthChecks: "الفحوصات الصحية",
                lastUpdate: "آخر تحديث:",
                dialog: {
                    title: "إعادة تشغيل الخدمة"
                }
            },
            userManagement: {
                instance: "مثيل",
                userMangtitle: "إدارةالمستخدم",
                users: "المستخدمون",
                adminTooltip: "مستخدم إداري",
                active: "(الجلسات %{count}) نشيط",
                inactive: "غير نشط",
                logOut: "تسجيل خروج",
                dialog: {
                    title: "تسجيل خروج المستخدم",
                    cancel: "إلغاء",
                    confirm: "تأكيد",
                    confirmation: "هل أنت متأكد أنك تريد تسجيل خروج المستخدم:"
                }
            }
        },
        sideNav: {
            systemHealth: "صحة النظام",
            configManagement: "إدارة التكوين",
            deploymentManagement: "إدارة النشر"
        }
    }
};

export default champApp;