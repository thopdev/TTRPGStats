<script lang="ts">
	let { onYaml, config = null }: { onYaml: (yaml: string) => void; config?: Record<string, any> | null } = $props();

	const CALC_OPTIONS = ['zero', 'max', 'decrease', 'increase', 'devideMaxUp', 'devideMaxDown', 'double'];

	let id = $state(config?.id ?? '');
	let name = $state(config?.name ?? '');
	let max = $state(config?.max ?? 5);
	let color = $state(config?.color ?? '');
	let events = $state<{ name: string; calc: string }[]>(
		config?.events?.map((e: any) => ({ name: e.name ?? '', calc: e.calc ?? 'max' })) ?? []
	);

	function addEvent() {
		events.push({ name: '', calc: 'max' });
	}

	function removeEvent(i: number) {
		events.splice(i, 1);
	}

	$effect(() => {
		let lines = '';
		if (id) lines += `id: ${id}\n`;
		if (name) lines += `name: ${name}\n`;
		lines += `max: ${max}\n`;
		if (color) lines += `color: ${color}\n`;
		if (events.length > 0) {
			lines += `events:\n`;
			for (const e of events) {
				lines += `  - name: ${e.name}\n    calc: ${e.calc}\n`;
			}
		}
		onYaml(lines);
	});
</script>

<div class="ttrpg-form">
	<div class="field-row">
		<div class="field">
			<label>ID <span class="req">*</span></label>
			<input type="text" bind:value={id} placeholder="e.g. spellslots_1" />
		</div>
		<div class="field">
			<label>Name</label>
			<input type="text" bind:value={name} placeholder="e.g. Spell Slots (1st)" />
		</div>
	</div>
	<div class="field-row">
		<div class="field">
			<label>Max <span class="req">*</span></label>
			<input type="number" bind:value={max} min="1" />
		</div>
		<div class="field">
			<label>Color</label>
			<input type="text" bind:value={color} placeholder="Blue" />
		</div>
	</div>

	<div class="section">
		<div class="section-header">
			<span>Events</span>
			<button onclick={addEvent}>+ Add event</button>
		</div>
		{#each events as _, i}
			<div class="dyn-row">
				<input type="text" bind:value={events[i].name} placeholder="Event name (e.g. short)" />
				<select bind:value={events[i].calc}>
					{#each CALC_OPTIONS as opt}
						<option value={opt}>{opt}</option>
					{/each}
				</select>
				<button class="remove-btn" onclick={() => removeEvent(i)}>✕</button>
			</div>
		{/each}
	</div>
</div>
