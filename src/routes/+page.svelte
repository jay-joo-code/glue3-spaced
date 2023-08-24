<script lang="ts">
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { page } from '$app/stores';
	import IconAdd from '$lib/icons/glue/IconAdd.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { invalidateAll } from '$app/navigation';

	let searchQuery = '';
	let searchResultCards = [];
	let isAddCardLoading = false;

	$: ({ todayFlashcards, upcomingFlashcards, supabase, session } = $page.data);

	const addCard = async () => {
		isAddCardLoading = true;
		const { error } = await supabase
			.from('flashcards')
			.insert([
				{
					body: '',
					due: new Date(),
					prevSpace: 0,
					userId: session?.user?.id
				}
			])
			.select();
		if (error) toast.push('There was an error with creating a flashcard');
		else await invalidateAll();
		isAddCardLoading = false;
	};

	const fetchSearchResults = async () => {
		const { data, error } = await supabase
			.from('flashcards')
			.select()
			.textSearch('body', `'${searchQuery}'`);

		if (error) toast.push('There was an error with search for flashcards');
		else {
			searchResultCards = data;
		}
	};

	const resetSearchResults = () => {
		if (searchResultCards?.length > 0) {
			searchResultCards = [];
		}
	};
</script>

<PageContainer title="Home" layout="mobile-only">
	<div class="flex w-full justify-center">
		<div class="w-full max-w-3xl">
			<form
				class="flex items-center rounded-full border border-base-content/20 p-2"
				on:submit={fetchSearchResults}>
				<input
					type="text"
					placeholder="Search for a card"
					class="input input-sm w-full"
					bind:value={searchQuery}
					on:input={resetSearchResults} />
				<button class="btn-secondary btn-sm btn rounded-full">Search</button>
			</form>

			{#if searchQuery?.length > 0}
				<div class="mt-6 space-y-4">
					{#each searchResultCards as flashcard (flashcard?.id)}
						<Flashcard {flashcard} />
					{/each}
				</div>
			{:else}
				<div class="mt-8 flex items-center justify-between">
					<h2 class="text-3xl font-extrabold">Today</h2>
					<button class="btn-secondary btn-sm btn" on:click={addCard} disabled={isAddCardLoading}>
						{#if isAddCardLoading}
							<span class="loading loading-spinner loading-xs" />
						{:else}
							<IconAdd />
						{/if}
						Add card
					</button>
				</div>

				<div class="mt-6 space-y-4">
					{#each todayFlashcards as flashcard (flashcard?.id)}
						<Flashcard {flashcard} />
					{/each}
				</div>

				<h2 class="mt-10 text-3xl font-extrabold">Upcoming</h2>
				<div class="relative mt-6 space-y-4">
					{#each upcomingFlashcards as flashcard (flashcard?.id)}
						<Flashcard {flashcard} />
					{/each}
					<div class="absolute bottom-0 w-full bg-gradient-to-t from-base-100 pt-64" />
				</div>
			{/if}
		</div>
	</div>
</PageContainer>
