import { redirect, type Load } from '@sveltejs/kit';

export const load: Load = async ({ params, parent }) => {
	const { session } = await parent();

	if (session) {
		throw redirect(307, params?.returnTo || '/');
	}
	return {};
};
