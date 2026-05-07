<script lang="ts">
	let { onYaml, config = null }: { onYaml: (yaml: string) => void; config?: Record<string, unknown> | null } = $props();

	let name = $state(config?.name ?? '');
	let buttons = $state<{ name: string; id: string; color: string }[]>(
		(config?.buttons as Record<string, unknown>[] | undefined)?.map((b) => ({ name: String(b.name ?? ''), id: String(b.id ?? ''), color: String(b.color ?? '') }))
		?? [{ name: 'Short Rest', id: 'short', color: '' }, { name: 'Long Rest', id: 'long', color: '' }]
	);

	function addButton() {
		buttons.push({ name: '', id: '', color: '' });
	}

	function removeButton(i: number) {
		buttons.splice(i, 1);
	}

	$effect(() => {
		let lines = '';
		if (name) lines += `name: ${name}\n`;
		lines += `buttons:\n`;
		for (const b of buttons) {
			lines += `  - name: ${b.name}\n    id: ${b.id}\n`;
			if (b.color) lines += `    color: ${b.color}\n`;
		}
		onYaml(lines);
	});
</script>

<div class="ttrpg-form">
	<div class="field">
		<label>Name</label>
		<input type="text" bind:value={name} placeholder="Optional label above buttons" />
	</div>

	<div class="section">
		<div class="section-header">
			<span>Buttons</span>
			<button onclick={addButton}>+ Add button</button>
		</div>
		{#each buttons as _, i}
			<div class="dyn-row">
				<input type="text" bind:value={buttons[i].name} placeholder="Label (e.g. Short Rest)" />
				<input type="text" bind:value={buttons[i].id} placeholder="Event ID (e.g. short)" />
				<input type="text" bind:value={buttons[i].color} placeholder="Color" style="max-width: 80px" />
				<button class="remove-btn" onclick={() => removeButton(i)}>✕</button>
			</div>
		{/each}
	</div>
</div>
