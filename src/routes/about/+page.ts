import type { PageLoad } from './$types';
import { dev } from '$app/environment';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement...
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in prod
export const prerender = true;

export const load: PageLoad = (props) => {
	// locals.userid comes from src/hooks.js
	console.log(1234);
	return {
		id: 1,
		name: 'aaaa'
	};
};
