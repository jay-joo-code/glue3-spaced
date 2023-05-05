import { PRIVATE_NAVS } from '$lib/glue/config';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutServerLoad = async (event) => {
	const session = await getServerSession(event);
	const privatePaths = PRIVATE_NAVS.map((nav) => nav.path);

	if (privatePaths?.includes(event.url.pathname) && !session) {
		throw redirect(307, '/signin');
	}

	return {
		session
	};
};
