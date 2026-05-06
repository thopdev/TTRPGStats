<script lang="ts">
	let { onYaml, config = null }: { onYaml: (yaml: string) => void; config?: Record<string, any> | null } = $props();

	let id = $state(config?.id ?? 'coins');
	let convert = $state(config?.convert ?? false);
	let allowNegative = $state(config?.allowNegative ?? false);
	let displayNull = $state(config?.displayNull ?? true);
	let valutas = $state<{ name: string; multiplier: number }[]>(
		config?.valutas?.map((v: any) => {
			const key = Object.keys(v).find(k => k !== 'default');
			return { name: key ?? '', multiplier: v[key!] ?? 1 };
		}) ?? [
			{ name: 'gold', multiplier: 100 },
			{ name: 'silver', multiplier: 10 },
			{ name: 'copper', multiplier: 1 },
		]
	);

	function addValuta() {
		valutas.push({ name: '', multiplier: 1 });
	}

	function removeValuta(i: number) {
		valutas.splice(i, 1);
	}

	$effect(() => {
		let lines = `id: ${id}\n`;
		if (convert) lines += `convert: true\n`;
		if (allowNegative) lines += `allowNegative: true\n`;
		if (!displayNull) lines += `displayNull: false\n`;
		lines += `valutas:\n`;
		for (const v of valutas) {
			lines += `  - ${v.name}: ${v.multiplier}\n`;
		}
		onYaml(lines);
	});
</script>

<div class="ttrpg-form">
	<div class="field">
		<label>ID</label>
		<input type="text" bind:value={id} placeholder="coins" />
	</div>

	<div class="field-row">
		<label class="checkbox-field">
			<input type="checkbox" bind:checked={convert} />
			Convert mode
		</label>
		<label class="checkbox-field">
			<input type="checkbox" bind:checked={allowNegative} />
			Allow negative
		</label>
		<label class="checkbox-field">
			<input type="checkbox" bind:checked={displayNull} />
			Display zero values
		</label>
	</div>

	<div class="section">
		<div class="section-header">
			<span>Currencies</span>
			<button onclick={addValuta}>+ Add currency</button>
		</div>
		{#each valutas as _, i}
			<div class="dyn-row">
				<input type="text" bind:value={valutas[i].name} placeholder="Name (e.g. gold)" />
				<input type="number" bind:value={valutas[i].multiplier} min="1" placeholder="Value" style="max-width: 90px" />
				<button class="remove-btn" onclick={() => removeValuta(i)}>✕</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.checkbox-field {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.85rem;
		cursor: pointer;
		text-transform: none;
		letter-spacing: normal;
		color: var(--text-normal);
	}
</style>
