<script lang="ts">
	import { page } from '$app/stores';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import TextInput from '$lib/components/glue/TextInput.svelte';
	import { APP_NAME } from '$lib/glue/config';
	import { supabase } from '$lib/glue/supabaseClient';
	import IconGoogle from '$lib/icons/glue/IconGoogle.svelte';
	import { onMount } from 'svelte';

	let email: string = '';
	let magicLinkState: 'sent' | 'not-sent' = 'not-sent';
	let isMagicLinkLoading = false;

	const signInWithGoogle = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: window.location.origin + '/signin'
			}
		});
	};

	async function signInEmailMagicLink() {
		isMagicLinkLoading = true;
		const { data, error } = await supabase.auth.signInWithOtp({
			email
		});
		magicLinkState = 'sent';
		isMagicLinkLoading = false;
	}

	onMount(() => {
		console.log('$page', $page?.data);
	});
</script>

<PageContainer title="Sign in" noPadding={true} limitWidth={false}>
	<div class="relative flex h-[80vh] items-center justify-center px-4">
		<div class="z-10 w-full rounded-xl bg-base-100 p-4 text-center sm:max-w-sm">
			<h1 class="text-3xl font-bold">Welcome back</h1>
			<p class="mt-2 text-sm text-base-content/70">Sign in to get started with {APP_NAME}</p>

			<!-- oauth -->
			<div class="mt-6 space-y-4">
				<button
					type="button"
					class="btn-outline btn-block btn mt-2 gap-2"
					on:click={signInWithGoogle}>
					<IconGoogle /> Sign in with Google
				</button>
			</div>

			<div class="divider mt-10 mb-4">OR</div>

			<!-- magic link -->
			<form on:submit={signInEmailMagicLink}>
				<TextInput bind:value={email} label="Email" type="email" />
				<button
					class="btn-primary btn-block btn mt-4 {isMagicLinkLoading && 'loading'}"
					disabled={!Boolean(email)}>
					Email me a sign in link
				</button>
			</form>

			<!-- terms -->
			<p class="mt-12 text-xs !leading-normal text-base-content/70">
				By signing in to {APP_NAME}, you agree to our
				<a class="link" href="/terms-conditions" target="_blank" rel="noreferrer">
					terms and conditions
				</a>
				and
				<a class="link" href="/privacy-policy" target="_blank" rel="noreferrer">privacy policy</a>
			</p>
		</div>
	</div>
</PageContainer>
