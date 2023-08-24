<script lang="ts">
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import Flashcard from '$lib/components/Flashcard.svelte';
	import { page } from '$app/stores';
	import IconAdd from '$lib/icons/glue/IconAdd.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { invalidateAll } from '$app/navigation';
	import { shortcut } from '$lib/actions/shortcut';

	let searchQuery = '';
	let searchResultCards = [];
	let isAddCardLoading = false;
	let inputElement;
	let timer;

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

	const fetchSearchResults = async (query: string) => {
		const { data, error } = await supabase
			.from('flashcards')
			.select()
			.textSearch('body', `'${query}'`);

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

	const handleDebouncedInputChange = (query: string) => {
		clearTimeout(timer);

		timer = setTimeout(() => {
			searchQuery = query;
			fetchSearchResults(query);
		}, 500);
	};
</script>

<PageContainer title="Home" layout="mobile-only">
	<div class="flex w-full justify-center">
		<div class="w-full max-w-3xl">
			<input
				type="text"
				placeholder="Search for a card"
				class="input-bordered input input-md w-full rounded-full"
				bind:this={inputElement}
				on:keyup={(event) => {
					const query = event?.target?.value?.trim();
					if (query) handleDebouncedInputChange(query);
					else {
						resetSearchResults();
						searchQuery = '';
					}
				}}
				use:shortcut={{
					control: true,
					code: 'KeyK',
					callback: () => {
						inputElement.focus();
					}
				}} />

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
