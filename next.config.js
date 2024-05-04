// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { env } = require("./src/server/env");

/**
 * @template {import("next").NextConfig} T
 * @param {T} config
 * @constraint {{import("next").NextConfig}}
 */
function getConfig(config) {
	return config;
}

module.exports = getConfig({
	publicRuntimeConfig: {
		NODE_ENV: env.NODE_ENV,
	},
	eslint: { ignoreDuringBuilds: !!process.env.CI },
	typescript: {
		ignoreBuildErrors: true,
	},
});
