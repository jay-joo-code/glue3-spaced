import { redirect, type Load } from '@sveltejs/kit';

export const load: Load = async (event) => {
	const { session } = await event.parent();
	console.log('session', session);
	if (session) {
		throw redirect(307, '/');
	}

	return {};
};
