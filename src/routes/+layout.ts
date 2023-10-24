import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { LayoutLoad } from './$types';
// import type { Database } from '../DatabaseDefinitions';
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ fetch, data, depends, url }) => {
	depends('supabase:auth');

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const fetchProfile = async (session) => {
		if (!session) return null;

		const { data: profile } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', session?.user?.id)
			.single();

		if (profile) return profile;

		// profile creation
		switch (session?.user?.app_metadata?.provider) {
			case 'email': {
				// if (url?.pathname !== '/setup-profile') {
				// 	throw redirect(307, `/setup-profile?${url.searchParams.toString()}`);
				// }
				return null;
			}

			case 'google': {
				const { data: profile } = await supabase
					.from('profiles')
					.insert([
						{
							id: session?.user?.id,
							name: session?.user?.user_metadata?.full_name,
							avatarUrl: session?.user?.user_metadata?.avatar_url
						}
					])
					.select('*')
					.single();

				return profile;
			}

			// TODO: handle more providers

			default: {
				return null;
			}
		}
	};

	return { supabase, session, profile: fetchProfile(session) };
};
