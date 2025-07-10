import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const apiBaseUrl = mode === 'production' 
		? 'https://api.chatify.kushagra-chavel.me'
		: 'http://localhost:5000';
	
	return {
		plugins: [react()],
		server: {
			port: 3000,
			proxy: {
				"/api": {
					target: apiBaseUrl,
					changeOrigin: true,
					secure: false,
				},
			},
		},
	};
});
