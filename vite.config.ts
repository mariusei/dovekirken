import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

//import { imagetools } from 'vite-imagetools'

//import basicSsl from '@vitejs/plugin-basic-ssl';

const config: UserConfig = {
	plugins: [sveltekit(), 
	//	imagetools()
	]
};

export default config;
