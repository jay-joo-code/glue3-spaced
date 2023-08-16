import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ parent }) => {
	const fetchTodayFlashcards = async () => {
		const { supabase } = await parent();
		const { data: flashcards } = await supabase
			.from('flashcard')
			.select('*')
			.lte('due', new Date().toISOString())
			.order('createdAt', { ascending: false });
		return flashcards;
	};

	const fetchUpcomingFlashcards = async () => {
		const { supabase } = await parent();
		const { data: flashcards } = await supabase
			.from('flashcard')
			.select('*')
			.gt('due', new Date().toISOString())
			.order('due', { ascending: true });
		return flashcards;
	};

	return {
		todayFlashcards: fetchTodayFlashcards(),
		upcomingFlashcards: fetchUpcomingFlashcards()
	};
};
