// -- Even though this is doing nothing at moment going to keep around because will want to get back to it
// -- This file used to configure proxying along with the "proxy" property in package.json
// -- I have not been able to get the primus proxy to work even modifying engine.io config 
// -- in client-app-core to use polling conditoned on NODE_ENV
// -- Note: Working fine in build because proxying not required
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
	// app.use(
	// 	"/cameras-app/api", 
	// 	createProxyMiddleware({
	// 		target: "http://localhost",
	// 		changeOrigin: true,
	// 		secure: false
	// 	})
	// );

	// app.use(
	// 	"/ecosystem/api", 
	// 	createProxyMiddleware({
	// 		target: "http://localhost",
	// 		changeOrigin: true,
	// 		secure: false
	// 	})
	// );

	// const wsProxy = createProxyMiddleware(		
	// 	"/primus", 
	// 	({
	// 		target: "https://localhost",
	// 		ignorePath: false,
	// 		changeOrigin: true,
	// 		secure: false
	// 	})
	// );

	// app.use(wsProxy);
 
	// app.server.on("upgrade", () => {
	// 	console.log("***** DO UPGRADE ***", wsProxy);
	// 	wsProxy.upgrade();
	// });

	// app.use(
	// 	"/primus", 
	// 	createProxyMiddleware({
	// 		target: "https://localhost",
	// 		ignorePath: false,
	// 		changeOrigin: true,
	// 		secure: false,
	// 		ws: false
	// 	})
	// );

};