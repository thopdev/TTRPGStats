<script lang="ts">
	import HpForm from './forms/HpForm.svelte';
	import TrackerForm from './forms/TrackerForm.svelte';
	import TrackerButtonForm from './forms/TrackerButtonForm.svelte';
	import ValutaForm from './forms/ValutaForm.svelte';
	import SkillsForm from './forms/SkillsForm.svelte';

	let { onInsert, initialType = null, initialConfig = null }: {
		onInsert: (codeBlock: string) => void;
		initialType?: string | null;
		initialConfig?: Record<string, unknown> | null;
	} = $props();

	const COMPONENTS = [
		{ id: 'hp', label: 'Hit Points', description: 'Track current/max HP with death saves', codeBlock: 'ttrpgstats-hp' },
		{ id: 'tracker', label: 'Tracker', description: 'Countable resources like spell slots or ki points', codeBlock: 'ttrpgstats-tracker' },
		{ id: 'button', label: 'Tracker Buttons', description: 'Buttons to trigger rest events across trackers', codeBlock: 'ttrpgstats-button' },
		{ id: 'valuta', label: 'Currency', description: 'Multi-denomination currency with conversion', codeBlock: 'ttrpgstats-valuta' },
		{ id: 'skills', label: 'Skills', description: 'Skill list with modifiers and proficiency', codeBlock: 'ttrpgstats-skills' },
	] as const;

	type ComponentId = typeof COMPONENTS[number]['id'];

	let selected = $state<ComponentId | null>(initialType as ComponentId | null);
	let yaml = $state('');

	let activeComponent = $derived(COMPONENTS.find(c => c.id === selected));

	let preview = $derived(
		activeComponent
			? yaml.trim()
				? `\`\`\`${activeComponent.codeBlock}\n${yaml.trim()}\n\`\`\``
				: `\`\`\`${activeComponent.codeBlock}\n\`\`\``
			: ''
	);

	function insert() {
		if (!activeComponent) return;
		onInsert(preview + '\n');
	}
</script>

{#if selected === null}
	<div class="picker-grid">
		{#each COMPONENTS as comp}
			<button class="comp-card" onclick={() => { selected = comp.id; yaml = ''; }}>
				<span class="comp-label">{comp.label}</span>
				<span class="comp-desc">{comp.description}</span>
			</button>
		{/each}
	</div>
{:else}
	<div class="form-view">
		<div class="form-header">
			<button class="back-btn" onclick={() => { selected = null; yaml = ''; }}>← Back</button>
			<span class="form-title">{activeComponent?.label}</span>
		</div>

		<div class="form-body">
			{#if selected === 'hp'}
				<HpForm onYaml={(v) => yaml = v} />
			{:else if selected === 'tracker'}
				<TrackerForm onYaml={(v) => yaml = v} config={initialConfig} />
			{:else if selected === 'button'}
				<TrackerButtonForm onYaml={(v) => yaml = v} config={initialConfig} />
			{:else if selected === 'valuta'}
				<ValutaForm onYaml={(v) => yaml = v} config={initialConfig} />
			{:else if selected === 'skills'}
				<SkillsForm onYaml={(v) => yaml = v} config={initialConfig} />
			{/if}
		</div>

		<details class="preview-block">
			<summary>Preview</summary>
			<pre class="preview-pre">{preview}</pre>
		</details>

		<button class="insert-btn" onclick={insert}>Insert</button>
	</div>
{/if}

<style>
	.picker-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		padding: 0.5rem 0;
	}

	.comp-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.3rem;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		border: 1px solid var(--background-modifier-border);
		background: var(--background-secondary);
		cursor: pointer;
		text-align: left;
		width: 100%;
		min-height: 70px;
	}

	.comp-card:hover {
		background: var(--background-modifier-hover);
	}

	.comp-label {
		font-weight: bold;
		font-size: 0.95rem;
	}

	.comp-desc {
		font-size: 0.78rem;
		color: var(--text-muted);
	}

	.form-view {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.form-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.form-title {
		font-size: 1rem;
		font-weight: bold;
	}

	.back-btn {
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0.2rem 0.6rem;
		min-height: 28px;
	}

	.form-body {
		overflow-y: auto;
		max-height: 50vh;
		padding-right: 0.25rem;
	}

	.preview-block {
		border: 1px solid var(--background-modifier-border);
		border-radius: 4px;
		padding: 0.4rem 0.6rem;
	}

	.preview-block summary {
		cursor: pointer;
		font-size: 0.82rem;
		color: var(--text-muted);
		user-select: none;
	}

	.preview-pre {
		margin: 0.4rem 0 0;
		font-size: 0.78rem;
		white-space: pre-wrap;
		word-break: break-all;
		padding: 0.4rem;
		background: var(--background-primary-alt);
		border-radius: 3px;
	}

	.insert-btn {
		cursor: pointer;
		width: 100%;
		padding: 0.5rem;
		font-size: 0.95rem;
		font-weight: bold;
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		border-radius: 4px;
		border: none;
		min-height: 36px;
	}

	.insert-btn:hover {
		background: var(--interactive-accent-hover);
	}

	/* Shared form styles used by child form components */
	:global(.ttrpg-form) {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	:global(.ttrpg-form .field) {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	:global(.ttrpg-form .field-row) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	:global(.ttrpg-form label) {
		font-size: 0.78rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	:global(.ttrpg-form .req) {
		color: var(--color-red);
	}

	:global(.ttrpg-form .section) {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	:global(.ttrpg-form .section-header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.78rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	:global(.ttrpg-form .dyn-row) {
		display: flex;
		gap: 0.4rem;
		align-items: center;
	}

	:global(.ttrpg-form .dyn-row input),
	:global(.ttrpg-form .dyn-row select) {
		flex: 1;
		min-width: 0;
	}

	:global(.ttrpg-form .remove-btn) {
		flex-shrink: 0;
		cursor: pointer;
		padding: 0.1rem 0.4rem;
		font-size: 0.8rem;
		min-height: 24px;
		color: var(--text-muted);
	}

	:global(.ttrpg-form .info) {
		color: var(--text-muted);
		font-size: 0.88rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
</style>
