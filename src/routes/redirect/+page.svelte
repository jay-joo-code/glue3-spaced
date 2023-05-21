<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Loading from '$lib/components/glue/Loading.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import { APP_NAME } from '$lib/glue/config';

	$: if ($page?.data?.session) {
		const redirectTo = $page.url.searchParams.get('redirectTo');
		$page.url.searchParams.delete('redirectTo');
		const url = `${$page.url.origin}${redirectTo || '/'}`;
		goto(url);
	}
</script>

<PageContainer title="Signing in to {APP_NAME}">
	<div class="flex min-h-[85vh] w-full items-center justify-center">
		<div class="flex flex-col items-center">
			<Loading />
			<p class="mt-8 text-xs text-base-content/70">Signing in to {APP_NAME}</p>
		</div>
	</div>
</PageContainer>
