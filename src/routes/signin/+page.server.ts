import { redirect, type Load } from '@sveltejs/kit';

export const load: Load = async (event) => {
	const { session } = await event.parent();

	if (session) {
		throw redirect(307, '/');
	}
	return {};
};
