<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import IconCheckOutlined from '$lib/icons/glue/IconCheckOutlined.svelte';
	import { Editor } from '@tiptap/core';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import Document from '@tiptap/extension-document';
	import FloatingMenu from '@tiptap/extension-floating-menu';
	import Placeholder from '@tiptap/extension-placeholder';
	import Typography from '@tiptap/extension-typography';
	import StarterKit from '@tiptap/starter-kit';
	import { toast } from '@zerodevx/svelte-toast';
	import { add, format, formatDistanceToNowStrict } from 'date-fns';
	import debounce from 'debounce';
	import 'highlight.js/styles/github-dark.css';
	import { lowlight } from 'lowlight';
	import { onDestroy, onMount } from 'svelte';

	export let flashcard;

	let element: HTMLDivElement;
	let editor: Editor;

	$: ({ supabase } = $page.data);

	const debouncedUpdateFlashcard = debounce.debounce(async () => {
		const { error } = await supabase
			.from('flashcards')
			.update({ body: editor.getHTML() })
			.eq('id', flashcard?.id);

		if (error) toast.push('An error has occured while auto-saving the flashcard');
	}, 500);

	const CodeBlockExtension = CodeBlockLowlight.extend({
		addKeyboardShortcuts() {
			return {
				Tab: ({ editor }) => {
					if (editor.isActive('codeBlock')) {
						return editor.commands.insertContent('\t');
					}
					return false;
				}
			};
		}
	}).configure({
		lowlight
	});

	const CustomDocument = Document.extend({
		content: 'heading block*'
	});

	const incrementDue = async (days: number) => {
		const due = add(new Date(), { days });
		const { error } = await supabase.from('flashcards').update({ due }).eq('id', flashcard?.id);
		if (error) toast.push('An error has occured with updating due date');
		else {
			await invalidateAll();
			toast.push(`Updated due date to ${format(due, 'MM/dd iii')}`);
		}
	};

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [
				CustomDocument,
				StarterKit.configure({
					document: false,
					codeBlock: false
				}),
				CodeBlockExtension,
				Placeholder.configure({
					placeholder: ({ node }) => {
						if (node.type.name === 'heading') {
							return 'What’s the title?';
						}
					}
				}),
				Typography,
				FloatingMenu.configure({
					element: document.querySelector('.floating-menu')
				})
			],
			content: flashcard?.body,
			onTransaction: () => {
				editor = editor; // force re-render
				debouncedUpdateFlashcard();
			},
			onBlur: async ({ editor }) => {
				if (editor?.getText()?.trim()?.length === 0) {
					const { error } = await supabase.from('flashcards').delete().eq('id', flashcard?.id);
					if (error) toast.push('An error occurred with auto deleting an empty card');
					else invalidateAll();
				}
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="relative rounded-lg border border-base-content/20 px-3 py-4">
	<div class="floating-menu ml-2 opacity-70">
		<button
			on:click={() => editor?.chain().focus().toggleCodeBlock().run()}
			class="btn-secondary btn-outline btn-xs btn {editor?.isActive('codeBlock')
				? 'is-active'
				: ''}">
			code block
		</button>
	</div>

	<div class="absolute right-2 top-2 z-[1]">
		<div class="dropdown-left dropdown">
			<label tabindex="0" class="btn-secondary btn-xs btn m-1 text-lg"><IconCheckOutlined /></label>

			<ul
				tabindex="0"
				class="dropdown-content menu rounded-box z-[2] bg-base-100 p-2 text-end shadow">
				<li
					on:click={() => {
						incrementDue(3);
					}}>
					<a>+3</a>
				</li>
				<li
					on:click={() => {
						incrementDue(10);
					}}>
					<a>+10</a>
				</li>
				<li
					on:click={() => {
						incrementDue(30);
					}}>
					<a>+30</a>
				</li>
			</ul>
		</div>
	</div>

	<!-- direct parent div required for keyboard navigation, focus handling -->
	<div>
		<div bind:this={element} />
	</div>

	<div class="mt-4">
		<p class="text-xs text-base-content/70">
			Due in {formatDistanceToNowStrict(new Date(flashcard?.due))} • Created {formatDistanceToNowStrict(
				new Date(flashcard?.createdAt)
			)} ago
		</p>
	</div>
</div>

<style>
	:global(.ProseMirror) {
		outline: none;
		word-break: break-word;
	}
	:global(.ProseMirror ul),
	:global(.ProseMirror ol) {
		padding: 0 1rem;
		list-style: disc;
	}
	:global(.ProseMirror h1) {
		line-height: 1.3;
		font-size: 1.3rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}
	:global(.ProseMirror p) {
		opacity: 0.9;
		font-size: 1rem;
	}
	:global(.ProseMirror code) {
		background-color: hsl(var(--b3));
		color: hsl(var(--er));
	}
	:global(.ProseMirror pre) {
		background: #0d0d0d;
		color: #fff;
		font-family: 'JetBrainsMono', monospace;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.ProseMirror pre code) {
		color: inherit;
		padding: 0;
		background: none;
		font-size: 0.8rem;
	}
	:global(.ProseMirror img) {
		max-width: 100%;
		height: auto;
	}
	:global(.ProseMirror blockquote) {
		padding-left: 1rem;
		border-left: 2px solid rgba(13, 13, 13, 0.1);
	}
	:global(.ProseMirror hr) {
		border: none;
		border-top: 2px solid rgba(13, 13, 13, 0.1);
		margin: 2rem 0;
	}
</style>
