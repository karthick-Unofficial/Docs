const { createProxyMiddleware } = require("http-proxy-middleware");
const targetServer = "https://cb2-dev.commandbridge.com";

module.exports = function (app) {
	app.use(
		"/ecosystem/api/applications/",
		createProxyMiddleware({
			target: targetServer,
			secure: false,
			changeOrigin: true,
			pathRewrite: (path) => {
				return `${path}events-app`;
			}
		})
	);

	app.use(
		"/translation-app/api",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/rules-app/api",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/settings-app",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/health-app/api",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/ecosystem/api",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/api/_clientConfig",
		createProxyMiddleware({
			target: `${targetServer}/events-app`,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/events-app",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/api",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/static",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/reports-app/api",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/login",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: true
		})
	);

	app.use(
		"/_upload",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: true
		})
	);

	app.use(
		"/_download",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: true
		})
	);

	app.use(
		"/_delete",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: true
		})
	);

	app.use(
		"/primus",
		createProxyMiddleware({
			target: targetServer,
			ignorePath: false,
			changeOrigin: true,
			secure: false,
			ws: true
		})
	);
};
