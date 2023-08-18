const camerasApp = {
  en: {
    appBar: {
      title: "Cameras",
      optionDrawer: {
        baseMap: "BASE MAP",
        mapLabels: "Map Labels",
        mapOverlays: "MAP OVERLAYS",
        nauticalCharts: "Nautical Charts",
        roadsLabels: "Roads and Labels",
        weatherRadar: "Weather Radar",
        spotlightProx: {
          title: "SPOTLIGHT PROXIMITY",
          defaultProx: "Default Proximity",
          errorText: {
            invalidProx: "Invalid proximity value",
            limitedValue: "Value must be limited to 3 decimal places"
          },
          km: "km",
          mi: "mi"
        }
      }
    },
    camerasListPanel: {
      placeholder: {
        searchColl: "Search Collections..."
      },
      allCams: "All Cameras",
      noCamerasAvailable: "No cameras available",
      cameraCollection: {
        item: " item",
        items: " items"
      }
    },
    camerasMapLayers: {
      listItemText: {
        editLocation: "Edit camera location",
        editFOV: "Edit camera's FOV",
        drawFOV: "Draw camera's FOV",
        deleteFOV: "Delete camera's FOV",
        editSpotlight: "Edit camera's Spotlight",
        resetSpotlight: "Reset camera's Spotlight"
      },
      stageDeleteDialog: {
        title: {
          deleteFOV: "Delete FOV",
          resetSpotlight: "Reset Spotlight"
        },
        textContent: "Are you sure you want to %{primaryValue} this camera's %{secondaryValue}?",
        delete: "delete",
        reset: "reset",
        fov: "FOV",
        spotlight: "Spotlight",
        confirm: "Confirm",
        cancel: "Cancel"
      },
      facilityCamDialog: {
        title: "Facility Camera",
        continue: "Continue",
        cancel: "Cancel",
        hiddenText: "%{count} is located on a facility that is currently hidden",
        locatedText: "%{count} is located on",
        continuingText: "Continuing will remove the camera from this floor plan."
      }
    },
    cameraView: {
      pinItem: "Pin Item",
      linkItems: "Link Items",
      mapLocation: "Map Location and FOV"
    }
  },
  ar: {
    appBar: {
      title: "كاميرات",
      optionDrawer: {
        baseMap: "الخريطة الأساسية",
        mapLabels: "تسميات الخريطة",
        mapOverlays: "تراكبات الخريطة",
        nauticalCharts: "مخططات بحرية",
        roadsLabels: "الطرق والتسميات",
        weatherRadar: "رادار الطقس",
        spotlightProx: {
          title: "قرب الضوء",
          defaultProx: "القرب الافتراضي",
          errorText: {
            invalidProx: "قيمة القرب غير صالحة",
            limitedValue: "يجب أن تقتصر القيمة على 3 منازل عشرية"
          },
          km: "كيلومتر",
          mi: "ميل"
        }
      }
    },
    camerasListPanel: {
      placeholder: {
        searchColl: "مجموعات البحث ..."
      },
      allCams: "جميع الكاميرات",
      noCamerasAvailable: "لا توجد كاميرات متاحة",
      cameraCollection: {
        item: "البند ",
        items: "البنود "
      }
    },
    camerasMapLayers: {
      listItemText: {
        editLocation: "تحرير موقع الكاميرا",
        editFOV: "تحرير مجال الرؤية الخاص بالكاميرا",
        drawFOV: "ارسم مجال الرؤية بالكاميرا",
        deleteFOV: "حذف مجال الرؤية بالكاميرا",
        editSpotlight: "تحرير أضواء الكاميرا",
        resetSpotlight: "إعادة تعيين أضواء الكاميرا"
      },
      stageDeleteDialog: {
        title: {
          deleteFOV: "حذف مجال الرؤية",
          resetSpotlight: "إعادة تعيين الأضواء"
        },
        textContent: "?%{secondaryValue} هذه الكاميرا %{primaryValue} هل أنت متأكد أنك تريد",
        confirm: "تأكيد",
        cancel: "إلغاء"
      },
      facilityCamDialog: {
        title: "كاميرا منشأة",
        continue: "تابع",
        cancel: "إلغاء",
        hiddenText: "يقع في منشأة مخفية حاليًا %{count}",
        locatedText: "يقع في %{count}",
        continuingText: "سيؤدي الاستمرار إلى إزالة الكاميرا من مخطط الأرضية هذا."
      }
    },
    cameraView: {
      pinItem: "دبوس البند",
      linkItems: "عناصر الارتباط",
      mapLocation: "الموقع على الخريطة ومجال الرؤية"
    }
  }
};

export default camerasApp;