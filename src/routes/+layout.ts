import { supabase } from '$lib/glue/supabaseClient';
import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutLoad = async (event) => {
	const { session } = await getSupabase(event);

	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', session?.user?.id)
		.single();

	return { session, profile };
};
