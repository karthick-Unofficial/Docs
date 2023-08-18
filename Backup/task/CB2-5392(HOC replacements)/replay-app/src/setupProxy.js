const { createProxyMiddleware } = require("http-proxy-middleware");
const targetServer = "https://localhost";

module.exports = function(app) {
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
			target: `${targetServer}/replay-app`,
			ignorePath: false,
			changeOrigin: true,
			secure: false
		})
	);

	app.use(
		"/replay-app", 
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