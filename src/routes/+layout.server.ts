import { PRIVATE_NAVS } from '$lib/glue/config';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	// private path protection
	const privatePaths = PRIVATE_NAVS.map((nav) => nav.path);
	if (privatePaths?.includes(url.pathname) && !session) {
		throw redirect(307, '/signin');
	}
	return {
		session
	};
};
