<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import css from 'highlight.js/lib/languages/css';
	import js from 'highlight.js/lib/languages/javascript';
	import ts from 'highlight.js/lib/languages/typescript';
	import html from 'highlight.js/lib/languages/xml';
	import python from 'highlight.js/lib/languages/python';
	import 'highlight.js/styles/github-dark.css';
	import { lowlight } from 'lowlight';

	let element: HTMLDivElement;
	let editor: Editor;

	lowlight.registerLanguage('html', html);
	lowlight.registerLanguage('css', css);
	lowlight.registerLanguage('js', js);
	lowlight.registerLanguage('ts', ts);
	lowlight.registerLanguage('python', python);

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

	onMount(() => {
		editor = new Editor({
			element,
			extensions: [StarterKit, CodeBlockExtension],
			content: `
        <p>
          That’s a boring paragraph followed by a fenced code block:
        </p>
        <pre><code class="language-typescript">console.log('Hello world!');</code></pre>`,
			onTransaction: () => {
				editor = editor; // force re-render
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="rounded-lg bg-base-200 p-2 outline-none">
	{#if editor}
		<div class="mb-4">
			<button
				on:click={() => editor.chain().focus().toggleCodeBlock().run()}
				class="btn-secondary btn-xs btn {editor.isActive('codeBlock') ? 'is-active' : ''}">
				code block
			</button>
		</div>
	{/if}

	<div bind:this={element} />
</div>

<style>
	:global(.ProseMirror) {
		outline: none;
	}
	:global(.ProseMirror ul),
	:global(.ProseMirror ol) {
		padding: 0 1rem;
	}
	:global(.ProseMirror h1),
	:global(.ProseMirror h2),
	:global(.ProseMirror h3),
	:global(.ProseMirror h4),
	:global(.ProseMirror h5),
	:global(.ProseMirror h6) {
		line-height: 1.1;
		font-size: 0.8rem;
	}
	:global(.ProseMirror h1) {
		font-size: 1.1rem;
		font-weight: bold;
		margin-bottom: 0.75rem;
	}
	:global(.ProseMirror code) {
		background-color: rgba(97, 97, 97, 0.1);
		color: #616161;
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
