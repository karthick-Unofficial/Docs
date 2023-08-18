const initial_create = require("./scripts/initial-create.js");
const create_user_devices = require("./scripts/create-user-devices.js");
const list_app_setup = require("./scripts/list-app-setup.js");
const create_entity_attachment = require("./scripts/create-entity-attachment.js");
const remove_rethinkdb_jobqueue = require("./scripts/remove-rethinkdb-jobqueue.js");
const create_event_types = require("./scripts/create-event-types.js");
const create_external_entity_mapping = require("./scripts/create-external-entity-mapping.js");
const create_auth_providers = require("./scripts/create_auth_providers.js");
const create_org_event_type = require("./scripts/create-org-event-type.js");
const seed_event_types = require("./scripts/seed-event-types.js");
const add_event_geo = require("./scripts/add-event-geo.js");
const create_external_systems = require("./scripts/create-external-systems.js");
const feed_display_properties = require("./scripts/feed-display-properties.js");
const sc_thread_subtype_required = require("./scripts/sc-thread-subtype-required.js");
const update_event_filters = require("./scripts/update-event-filters.js");
const add_list_entity_type = require("./scripts/add-list-entity-type.js");
const update_shape_feeds_with_owner_orgs = require("./scripts/update-shape-feeds-with-owner-orgs.js");
const update_feeds_with_owner_orgs = require("./scripts/update-feeds-with-owner-orgs");
const add_event_entity_timestamp = require("./scripts/add-event-entity-timestamp");
const add_user_appSettings = require("./scripts/add-user-appSettings.js");
const add_org_role_session = require("./scripts/add-org-role-session.js");
const create_activity_indexes = require("./scripts/create-activity-indexes.js");
const add_exclusion_table = require("./scripts/add-exclusion-table.js");
const add_camera_wall_app = require("./scripts/add-camera-wall-app.js");
const update_default_app_settings = require("./scripts/update-default-app-settings.js");
const create_camera_group = require("./scripts/create-camera-group.js");
const create_camera_context_mapping = require("./scripts/create-camera-context-mapping.js");
const add_collection_entity_type = require("./scripts/add-collection-entity-type.js");
const update_camera_feed_type = require("./scripts/update-camera-feed-type.js");
const add_law_enforcement_search_app = require("./scripts/add-law-enforcement-search-app.js");
const add_berth_schedule_app = require("./scripts/add-berth-schedule-app.js");
const add_feed_icon = require("./scripts/add-feed-icon.js");
const add_shape_style_properties = require("./scripts/add-shape-style-properties");
const add_shape_properties = require("./scripts/add-shape-properties");
const update_stream_properties = require("./scripts/update-stream-properties");
const update_stream_properties_heading = require("./scripts/update-stream-properties-heading");
const create_activity_indexes_2 = require("./scripts/create-activity-indexes-2.js");
const add_sharing_connections = require("./scripts/add-sharing-connections.js");
const add_spotlight_table = require("./scripts/add-spotlight-table.js");
const add_default_spotlight_proximity = require("./scripts/add-default-spotlight-proximity");
const update_camera_feed_type_spotlight = require("./scripts/update-camera-feed-type-spotlight");
const add_facilities_app = require("./scripts/add-facilities-app.js");
const add_facilities_tables = require("./scripts/add-facilities-tables.js");
const add_facility_entity_type = require("./scripts/add-facility-entity-type");
const add_camera_display_type = require("./scripts/add-camera-display-type");
const create_status_card_table = require("./scripts/create-status-card-table");
const add_status_board_app = require("./scripts/add-status-board-app");
const add_facility_feed = require("./scripts/add-facility-feed");
const add_facility_feed_id = require("./scripts/add-facility-feed-id");
const add_default_facility_feed_type = require("./scripts/add-default-facility-feed-type");
const update_camera_stream_properties = require("./scripts/update-camera-stream-properties");
const update_geo_global_feed_types = require("./scripts/update-geo-global-feed-types");
const add_linked_entities_table = require("./scripts/add-linked-entities-table");
const update_cameras_geo_global_feed_types = require("./scripts/update-cameras-geo-global-feed-types");
const update_shapes_geo_global_feed_types = require("./scripts/update-shapes-geo-global-feed-types");
const update_tracks_geo_global_feed_types = require("./scripts/update-track-geo-global-feed-types");
const update_facility_geo_global_feed_types = require("./scripts/update-facility-geo-global-feed-types");
const add_list_feed = require("./scripts/add-list-feed");
const add_list_feed_id = require("./scripts/add-list-feed-id");
const add_pagination_lists = require("./scripts/add-pagination-lists");
const update_list_streams = require("./scripts/update-list-streams");
const add_list_feed_template = require("./scripts/add-list-feed-template");
const update_list_feed_type = require("./scripts/update-list-feed-type");
const update_list_feed_types_with_generate_activity_key = require("./scripts/update-list-feed-types-with-generate-activity-key");
const update_track_feed_display_properties = require("./scripts/update-track-feed-display-properties");
const add_org_support_url = require("./scripts/add-org-support-url");
const add_application_entity_type_table = require("./scripts/add-application-entity-type-table");
const update_application_entity_type_table = require("./scripts/update-application-entity-type-table");
const remove_cb_load_tester = require("./scripts/remove-cb-load-tester");
const add_map_icon_template_defaults = require("./scripts/add-map-icon-template-defaults");
const entity_auth_changes = require("./scripts/entity-auth-changes");
const entity_auth_role_migration = require("./scripts/entity-auth-role-migration");
const make_all_events_public = require("./scripts/make-all-events-public");
const make_all_shapes_public = require("./scripts/make-all-shapes-public");
const add_list_entity_type_prop = require("./scripts/add-list-entity-type-prop");
const make_all_lists_public = require("./scripts/make-all-lists-public");
const update_list_column_required_props = require("./scripts/update-list-column-required-props");
const update_activity_stream_index = require("./scripts/update-activity-stream-index");
const add_replay_app = require("./scripts/add-replay-app");
const reindex_activity_notification_streams = require("./scripts/reindex-activity-notification-streams");
const create_replay_table = require("./scripts/create-replay-table");
const update_camera_geo_stream_properties = require("./scripts/update-camera-geo-stream-properties");
const add_control_to_camera_feeds_stream_props = require("./scripts/add-control-to-camera-feeds-stream-props");
const create_configuration_table = require("./scripts/create-configuration-table");
const seed_configuration_table = require("./scripts/seed-configuration-table");
const add_champ_app = require("./scripts/add-champ-app.js");
const add_ecolink_table = require("./scripts/add-ecolink-table");
const update_facility_and_shape_stream_properties = require("./scripts/update-facility-and-shape-stream-properties");
const update_camera_globalgeo_stream_properties = require("./scripts/update-camera-globalgeo-stream-properties");
const uniquify_defaults = require("./scripts/uniquify-defaults");
const add_entityType_shape_globalgeo_stream_properties = require("./scripts/add-entityType-shape-globalgeo-stream-properties");
const add_ext_eco_perms_to_entity_type = require("./scripts/add-ext-eco-perms-to-entity-type");
const update_application_entity_type_table_two = require("./scripts/update-application-entity-type-table-two");
const update_camera_configuration = require("./scripts/update-camera-configuration");
const create_system_notification_table = require("./scripts/create-system-notification-table");
const create_user_system_notification_table = require("./scripts/create-user-system-notification-table");
const add_settings_app = require("./scripts/add-settings-app");
const create_locale_table = require("./scripts/create-locale-table");
const move_app_icons = require("./scripts/move-app-icons");
const create_sys_mapStyles_table = require("./scripts/create-sys-mapStyles-table");
const move_map_style_thumbnails = require("./scripts/move-map-style-thumbnails");
const rename_event_last_modified = require("./scripts/rename-event-last-modified");
const add_mpo_app = require("./scripts/add-mpo-app");
const create_sys_accessPoint_table = require("./scripts/create_sys_accessPoint_table");
const add_accessPoint_entity_type = require("./scripts/add-accessPoint-entity-type");
const update_application_entity_type_table_three = require("./scripts/update-application-entity-type-table-three");
const rename_mapgl_to_map = require("./scripts/rename-mapgl-to-map");

module.exports = [
	{
		key: "initial-create",
		export: initial_create
	},
	{
		key: "create-user-devices",
		export: create_user_devices
	},
	{
		key: "list-app-setup",
		export: list_app_setup
	},
	{
		key: "remove-rethinkdb-jobqueue",
		export: remove_rethinkdb_jobqueue
	},
	{
		key: "create-event-types",
		export: create_event_types
	},
	{
		key: "create-external-entity-mapping",
		export: create_external_entity_mapping
	},
	{
		key: "create-auth-providers",
		export: create_auth_providers
	},
	{
		key: "create-org-event-type",
		export: create_org_event_type
	},
	{
		key: "seed-event-types",
		export: seed_event_types
	},
	{
		key: "add-event-geo",
		export: add_event_geo
	},
	{
		key: "create-exteral-systems",
		export: create_external_systems
	},
	{
		key: "create-entity-attachment",
		export: create_entity_attachment
	},
	{
		key: "feed-display-properties",
		export: feed_display_properties
	},
	{
		key: "sc-thread-subtype-required",
		export: sc_thread_subtype_required
	},
	{
		key: "update-event-filters",
		export: update_event_filters
	},
	{
		key: "add-list-entity-type",
		export: add_list_entity_type
	},
	{
		key: "update-shape-feeds-with-owner-orgs",
		export: update_shape_feeds_with_owner_orgs
	},
	{
		key: "update-feeds-with-owner-orgs",
		export: update_feeds_with_owner_orgs
	},
	{
		key: "add-event-entity-timestamp",
		export: add_event_entity_timestamp
	},
	{
		key: "add-user-appSettings",
		export: add_user_appSettings
	},
	{
		key: "add-org-role-session",
		export: add_org_role_session
	},
	{
		key: "create-activity-indexes",
		export: create_activity_indexes
	},
	{
		key: "add-exclusion-table",
		export: add_exclusion_table
	},
	{
		key: "add-camera-wall-app",
		export: add_camera_wall_app
	},
	{
		key: "create-activity-indexes",
		export: create_activity_indexes
	},
	{
		key: "create-camera-group",
		export: create_camera_group
	},
	{
		key: "create-camera-context-mapping",
		export: create_camera_context_mapping
	},
	{
		key: "add-collection-entity-type",
		export: add_collection_entity_type
	},
	{
		key: "update-camera-feed-type",
		export: update_camera_feed_type
	},
	{
		key: "update-default-app-settings",
		export: update_default_app_settings
	},
	{
		key: "add-berth-schedule-app",
		export: add_berth_schedule_app
	},
	{
		key: "add-feed-icon",
		export: add_feed_icon
	},
	{
		key: "add-shape-style-properties",
		export: add_shape_style_properties
	},
	{
		key: "add-shape-properties",
		export: add_shape_properties
	},
	{
		key: "update-stream-properties",
		export: update_stream_properties
	},
	{
		key: "add-law-enforcement-search-app",
		export: add_law_enforcement_search_app
	},
	{
		key: "update-stream-properties-heading",
		export: update_stream_properties_heading
	},
	{
		key: "create-activity-indexes-2",
		export: create_activity_indexes_2
	},
	{
		key: "add-sharing-connections",
		export: add_sharing_connections
	},
	{
		key: "add-spotlight-table",
		export: add_spotlight_table
	},
	{
		key: "add-default-spotlight-proximity",
		export: add_default_spotlight_proximity
	},
	{
		key: "update-camera-feed-type-spotlight",
		export: update_camera_feed_type_spotlight
	},
	{
		key: "add-facilities-app",
		export: add_facilities_app
	},
	{
		key: "add-facilities-tables",
		export: add_facilities_tables
	},
	{
		key: "add-facility-entity-type",
		export: add_facility_entity_type
	},
	{
		key: "add-camera-display-type",
		export: add_camera_display_type
	},
	{
		key: "create-status-card-table",
		export: create_status_card_table
	},
	{
		key: "add-status-board-app",
		export: add_status_board_app
	},
	{
		key: "add-facility-feed",
		export: add_facility_feed
	},
	{
		key: "add-facility-feed-id",
		export: add_facility_feed_id
	},
	{
		key: "add-default-facility-feed-type",
		export: add_default_facility_feed_type
	},
	{
		key: "update-camera-stream-properties",
		export: update_camera_stream_properties
	},
	{
		key: "update-geo-global-feed-types",
		export: update_geo_global_feed_types
	},
	{
		key: "add-linked-entities-table",
		export: add_linked_entities_table
	},
	{
		key: "update-cameras-geo-global-feed-types",
		export: update_cameras_geo_global_feed_types
	},
	{
		key: "update-shapes-geo-global-feed-types",
		export: update_shapes_geo_global_feed_types
	},
	{
		key: "update-track-geo-global-feed-types",
		export: update_tracks_geo_global_feed_types
	},
	{
		key: "add-list-feed-id",
		export: add_list_feed_id
	},
	{
		key: "add-list-feed",
		export: add_list_feed
	},
	{
		key: "add-pagination-lists",
		export: add_pagination_lists
	},
	{
		key: "update-list-streams",
		export: update_list_streams
	},
	{
		key: "add-list-feed-template",
		export: add_list_feed_template
	},
	{
		key: "update-list-feed-type",
		export: update_list_feed_type
	},
	{
		key: "update-list-feed-types-with-generate-activity-key",
		export: update_list_feed_types_with_generate_activity_key
	},
	{
		key: "update-track-feed-display-properties",
		export: update_track_feed_display_properties
	},
	{
		key: "add-org-support-url",
		export: add_org_support_url
	},
	{
		key: "add-application-entity-type-table",
		export: add_application_entity_type_table
	},
	{
		key: "update-application-entity-type-table",
		export: update_application_entity_type_table
	},
	{
		key: "remove-cb-load-tester",
		export: remove_cb_load_tester
	},
	{
		key: "add-map-icon-template-defaults",
		export: add_map_icon_template_defaults
	},
	{
		key: "entity-auth-changes",
		export: entity_auth_changes
	},
	{
		key: "entity_auth_role_migration",
		export: entity_auth_role_migration
	},
	{
		key: "make_all_events_public",
		export: make_all_events_public
	},
	{
		key: "make_all_shapes_public",
		export: make_all_shapes_public
	},
	{
		key: "add-list-entity-type-prop",
		export: add_list_entity_type_prop
	},
	{
		key: "update-facility-geo-global-feed-types",
		export: update_facility_geo_global_feed_types
	},
	{
		key: "make_all_lists_public",
		export: make_all_lists_public
	},
	{
		key: "update-list-column-required-props",
		export: update_list_column_required_props
	},
	{
		key: "update-activity-stream-index",
		export: update_activity_stream_index
	},
	{
		key: "add-replay-app",
		export: add_replay_app
	},
	{
		key: "reindex-activity-notification-streams",
		export: reindex_activity_notification_streams
	},
	{
		key: "create-replay-table",
		export: create_replay_table
	},
	{
		key: "update-camera-geo-stream-properties",
		export: update_camera_geo_stream_properties
	},
	{
		key: "add-control-to-camera-feeds-stream-props",
		export: add_control_to_camera_feeds_stream_props
	},
	{
		key: "create-configuration-table",
		export: create_configuration_table
	},
	{
		key: "seed-configuration-table",
		export: seed_configuration_table
	},
	{
		key: "add-champ-app",
		export: add_champ_app
	},
	{
		key: "add-ecolink-table",
		export: add_ecolink_table
	},
	{
		key: "update-facility-and-shape-stream-properties",
		export: update_facility_and_shape_stream_properties
	},
	{
		key: "uniquify-defaults",
		export: uniquify_defaults
	},
	{
		key: "update-camera-globalgeo-stream-properties",
		export: update_camera_globalgeo_stream_properties
	},
	{
		key: "add-entityType-shape-globalgeo-stream-properties",
		export: add_entityType_shape_globalgeo_stream_properties
	},
	{
		key: "add-ext-eco-perms-to-entity-type",
		export: add_ext_eco_perms_to_entity_type
	},
	{
		key: "update-application-entity-type-table-two",
		export: update_application_entity_type_table_two
	},
	{
		key: "update-camera-configuration",
		export: update_camera_configuration
	},
	{
		key: "create-system-notification-table",
		export: create_system_notification_table
	},
	{
		key: "create-user-system-notification-table",
		export: create_user_system_notification_table
	},
	{
		key: "add-settings-app",
		export: add_settings_app
	},
	{
		key: "move-app-icons",
		export: move_app_icons
	},
	{
		key: "create-sys-mapStyles-table",
		export: create_sys_mapStyles_table
	},
	{
		key: "move-map-style-thumbnails",
		export: move_map_style_thumbnails
	},
	{
		key: "rename-event-last-modified",
		export: rename_event_last_modified
	},
	{
		key: "add-mpo-app",
		export: add_mpo_app
	},
	{
		key: "create-locale-table",
		export: create_locale_table
	},
	{
		key: "create_sys_accessPoint_table",
		export: create_sys_accessPoint_table
	},
	{
		key: "add_accessPoint_entity_type",
		export: add_accessPoint_entity_type
	},
	{
		key: "update_application_entity_type_table_three",
		export: update_application_entity_type_table_three
	},
	{
		key: "rename_mapgl_to_map",
		export: rename_mapgl_to_map
	}
];
