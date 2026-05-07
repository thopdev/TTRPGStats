<script lang="ts">
	let { onYaml, config = null }: { onYaml: (yaml: string) => void; config?: Record<string, unknown> | null } = $props();

	const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

	let proficiency = $state(config?.proficiency ?? 'proficiency_bonus');
	let modifiers = $state(config?.modifiers ?? false);
	let sort = $state<'' | 'name' | 'ability'>(config?.sort ?? '');
	let skills = $state(
		(config?.skills as Record<string, unknown>[] | undefined)?.map((s) => ({
			name: String(s.name ?? ''),
			ability: String(s.ability ?? 'str'),
			proficient: s.proficient === true,
			expertise: s.expertise === true,
		})) ?? [
		{ name: 'Athletics', ability: 'str', proficient: false, expertise: false },
		{ name: 'Acrobatics', ability: 'dex', proficient: false, expertise: false },
		{ name: 'Sleight of Hand', ability: 'dex', proficient: false, expertise: false },
		{ name: 'Stealth', ability: 'dex', proficient: false, expertise: false },
		{ name: 'Arcana', ability: 'int', proficient: false, expertise: false },
		{ name: 'History', ability: 'int', proficient: false, expertise: false },
		{ name: 'Investigation', ability: 'int', proficient: false, expertise: false },
		{ name: 'Nature', ability: 'int', proficient: false, expertise: false },
		{ name: 'Religion', ability: 'int', proficient: false, expertise: false },
		{ name: 'Animal Handling', ability: 'wis', proficient: false, expertise: false },
		{ name: 'Insight', ability: 'wis', proficient: false, expertise: false },
		{ name: 'Medicine', ability: 'wis', proficient: false, expertise: false },
		{ name: 'Perception', ability: 'wis', proficient: false, expertise: false },
		{ name: 'Survival', ability: 'wis', proficient: false, expertise: false },
		{ name: 'Deception', ability: 'cha', proficient: false, expertise: false },
		{ name: 'Intimidation', ability: 'cha', proficient: false, expertise: false },
		{ name: 'Performance', ability: 'cha', proficient: false, expertise: false },
		{ name: 'Persuasion', ability: 'cha', proficient: false, expertise: false },
	]);

	function addSkill() {
		skills.push({ name: '', ability: 'str', proficient: false, expertise: false });
	}

	function removeSkill(i: number) {
		skills.splice(i, 1);
	}

	$effect(() => {
		let lines = '';
		if (proficiency !== 'proficiency_bonus') lines += `proficiency: ${proficiency}\n`;
		if (modifiers) lines += `modifiers: true\n`;
		if (sort) lines += `sort: ${sort}\n`;
		lines += `skills:\n`;
		for (const s of skills) {
			lines += `  - name: ${s.name}\n    ability: ${s.ability}\n`;
			if (s.proficient) lines += `    proficient: true\n`;
			if (s.expertise) lines += `    expertise: true\n`;
		}
		onYaml(lines);
	});
</script>

<div class="ttrpg-form">
	<div class="field-row">
		<div class="field">
			<label>Proficiency bonus property</label>
			<input type="text" bind:value={proficiency} placeholder="proficiency_bonus" />
		</div>
		<div class="field">
			<label>Default sort</label>
			<select bind:value={sort}>
				<option value="">Default</option>
				<option value="name">A–Z</option>
				<option value="ability">By ability</option>
			</select>
		</div>
	</div>

	<label class="checkbox-field">
		<input type="checkbox" bind:checked={modifiers} />
		Ability scores are already modifiers (not raw scores)
	</label>

	<div class="section">
		<div class="section-header">
			<span>Skills</span>
			<button onclick={addSkill}>+ Add skill</button>
		</div>
		<div class="skill-table">
			<div class="skill-header">
				<span>Name</span>
				<span>Ability</span>
				<span title="Proficient">Prof</span>
				<span title="Expertise">Exp</span>
				<span></span>
			</div>
			{#each skills as _, i}
				<div class="skill-row">
					<input type="text" bind:value={skills[i].name} placeholder="Skill name" />
					<select bind:value={skills[i].ability}>
						{#each ABILITIES as ab}
							<option value={ab}>{ab.toUpperCase()}</option>
						{/each}
					</select>
					<input type="checkbox" bind:checked={skills[i].proficient} />
					<input type="checkbox" bind:checked={skills[i].expertise} />
					<button class="remove-btn" onclick={() => removeSkill(i)}>✕</button>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.checkbox-field {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.skill-table {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.skill-header,
	.skill-row {
		display: grid;
		grid-template-columns: 1fr 70px 36px 36px 28px;
		gap: 0.3rem;
		align-items: center;
	}

	.skill-header {
		font-size: 0.72rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding-bottom: 0.2rem;
		border-bottom: 1px solid var(--background-modifier-border);
		text-align: center;
	}

	.skill-header span:first-child {
		text-align: left;
	}

	.skill-row input[type="checkbox"] {
		justify-self: center;
	}
</style>
