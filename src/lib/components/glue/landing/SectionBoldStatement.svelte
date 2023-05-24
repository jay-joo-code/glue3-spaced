<script lang="ts">
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';
	import RadialGradient from './RadialGradient.svelte';

	export let overline: string = 'Our mission';
	export let heading: string = 'Give your schedulers a calendar not a list';
	export let desc: string =
		'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque, eos iusto perferendis eaque sunt dolores aliquam beatae consequuntur saepe commodi.';
	export let linkLabel: string = '';
	export let linkHref: string = '';
</script>

<section class="relative min-h-[60vh] overflow-hidden px-8 py-16 text-center md:pt-48">
	<RadialGradient />
	<p class="text-lg font-bold text-primary">{overline}</p>
	<h2 class="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
		{heading}
	</h2>
	{#if desc}
		<p class="mx-auto mt-10 max-w-3xl text-lg text-base-content/70">
			{desc}
		</p>
	{/if}
	{#if linkLabel}
		<a class="btn-primary btn mt-10 gap-1" href={linkHref}>
			{linkLabel}
			<span class="text-xl"><IconRightArrowLong /></span>
		</a>
	{/if}
</section>
