<script lang="ts">
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { page } from '$app/stores';
	import IconAdd from '$lib/icons/glue/IconAdd.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { invalidateAll } from '$app/navigation';

	$: ({ todayFlashcards, upcomingFlashcards, supabase } = $page.data);

	const addCard = async () => {
		const { error } = await supabase
			.from('flashcard')
			.insert([
				{
					body: '',
					due: new Date(),
					prevSpace: 0
				}
			])
			.select();
		if (error) toast.push('There was an error with creating a flashcard');
		else invalidateAll();
	};
</script>

<PageContainer title="Home" layout="mobile-only">
	<div class="flex w-full justify-center">
		<div class="w-full max-w-3xl">
			<div class="flex items-center justify-between">
				<h2 class="text-3xl font-extrabold">Today</h2>
				<button class="btn-secondary btn-sm btn" on:click={addCard}><IconAdd /> Add card</button>
			</div>

			<div class="mt-6 space-y-4">
				{#each todayFlashcards as flashcard (flashcard?.id)}
					<Flashcard {flashcard} />
				{/each}
			</div>

			<h2 class="mt-8 text-3xl font-extrabold">Upcoming</h2>
			<div class="mt-6 space-y-4">
				{#each upcomingFlashcards as flashcard (flashcard?.id)}
					<Flashcard {flashcard} />
				{/each}
			</div>
		</div>
	</div>
</PageContainer>
