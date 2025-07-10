import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const isDev = mode === 'development';
	
	return {
		plugins: [react()],
		server: {
			port: 3000,
			proxy: isDev ? {
				"/api": {
					target: "http://localhost:5000",
					changeOrigin: true,
					secure: false,
				},
			} : undefined
		},
		define: {
			__API_BASE_URL__: JSON.stringify(
				isDev ? '' : 'https://api.chatify.kushagra-chavel.me'
			)
		}
	};
});
