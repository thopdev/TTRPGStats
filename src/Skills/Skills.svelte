<script lang="ts">
	import { ToSkillConfig } from "./SkillConfig";
	import type { SkillItemConfig } from "./SkillConfig";
	import Error from "../Error/Error.svelte";
	import { onDestroy } from "svelte";
	import type { DefaultComponentProperties } from "src/General/Models/DefaultComponentProperties";

	const id = crypto.randomUUID().toString();

	let { content, pluginFileManager }: DefaultComponentProperties = $props();

	let { value: config, error: configError } = ToSkillConfig(content);

	let proficiencyBonus = $state(2);
	let abilityScores = $state<Record<string, number>>({});
	let sortMode = $state<"ability" | "name" | undefined>(config?.sort);

	const SORT_CYCLE: ("ability" | "name" | undefined)[] = [
		undefined,
		"name",
		"ability",
	];

	function cycleSort() {
		const idx = SORT_CYCLE.indexOf(sortMode);
		sortMode = SORT_CYCLE[(idx + 1) % SORT_CYCLE.length];
	}

	function sortLabel(): string {
		if (sortMode === "name") return "A–Z";
		if (sortMode === "ability") return "Ability";
		return "Default";
	}

	if (config) {
		loadProperties();
		pluginFileManager.propertyChangedEvent.on(id, loadProperties);
	}

	function loadProperties() {
		if (!config) return;

		const rawProf = parseInt(
			pluginFileManager.properties[config.proficiencyId],
		);
		proficiencyBonus = isNaN(rawProf) ? 2 : rawProf;

		const scores: Record<string, number> = {};
		for (const [abbr, propName] of Object.entries(config.abilities)) {
			const val = parseInt(pluginFileManager.properties[propName]);
			scores[abbr] = isNaN(val) ? 10 : val;
		}
		abilityScores = scores;
	}

	function getAbilityMod(ability: string): number {
		const value = abilityScores[ability] ?? 0;
		return config?.modifiers ? value : Math.floor((value - 10) / 2);
	}

	function getProfBonus(skill: SkillItemConfig): number {
		if (skill.expertise) return proficiencyBonus * 2;
		if (skill.proficient) return proficiencyBonus;
		return 0;
	}

	function fmt(n: number): string {
		return n >= 0 ? `+${n}` : `${n}`;
	}

	function profIcon(skill: SkillItemConfig): string {
		if (skill.expertise) return "★";
		if (skill.proficient) return "●";
		return "○";
	}

	function profLabel(skill: SkillItemConfig): string {
		if (skill.expertise) return "Expertise";
		if (skill.proficient) return "Proficient";
		return "Not proficient";
	}

	// Returns skills sorted/grouped based on config.sort.
	// "ability": groups by ability key in definition order, returns { group, skills }[]
	// "name": flat list sorted alphabetically
	// undefined: original order as flat list
	type SkillGroup = { group: string; skills: SkillItemConfig[] };

	function getGroups(): SkillGroup[] {
		if (!config) return [];
		const skills = config.skills;

		if (sortMode === "name") {
			return [
				{
					group: "",
					skills: [...skills].sort((a, b) =>
						a.name.localeCompare(b.name),
					),
				},
			];
		}

		if (sortMode === "ability") {
			const order = Object.keys(config.abilities);
			const map = new Map<string, SkillItemConfig[]>();
			for (const key of order) map.set(key, []);
			for (const skill of skills) {
				const key = skill.ability;
				if (!map.has(key)) map.set(key, []);
				map.get(key)!.push(skill);
			}
			return order
				.filter((key) => (map.get(key)?.length ?? 0) > 0)
				.map((key) => ({ group: key.toUpperCase(), skills: map.get(key)! }));
		}

		return [{ group: "", skills }];
	}

	onDestroy(() => {
		pluginFileManager.propertyChangedEvent.off(id);
	});
</script>

{#if configError != undefined}
	<Error
		errorTitle={configError.errorTitle}
		exampleText={configError.exampleText}
	/>
{:else if config}
	<div class="skills-container">
		<div class="skills-header">
			<span class="title bold">Skills</span>
			<div class="header-right">
				<button
					class="sort-btn pointer"
					onclick={cycleSort}
					title="Sort: {sortLabel()}"
				>
					{sortLabel()}
				</button>
				<span class="prof-badge" title="Proficiency Bonus"
					>Prof {fmt(proficiencyBonus)}</span
				>
			</div>
		</div>

		<div class="skill-list">
			<div class="skill-row header-row">
				<span></span>
				<span></span>
				<span class="col-label">Mod</span>
				<span class="col-label">Prof</span>
				<span class="col-label">Total</span>
			</div>

			{#each getGroups() as { group, skills }}
				{#if group}
					<div class="group-header">{group}</div>
				{/if}
				{#each skills as skill}
					{@const abilityMod = getAbilityMod(skill.ability)}
					{@const profBonus = getProfBonus(skill)}
					{@const total = abilityMod + profBonus}
					<div class="skill-row">
						<span
							class="prof-icon"
							class:prof-icon--proficient={skill.proficient &&
								!skill.expertise}
							class:prof-icon--expertise={skill.expertise}
							title={profLabel(skill)}
						>
							{profIcon(skill)}
						</span>

						<span class="skill-name">
							<span class="skill-name-row">
								{skill.name}
								{#if sortMode !== "ability"}
									<span class="skill-ability"
										>{skill.ability.toUpperCase()}</span
									>
								{/if}
							</span>
							{#if skill.comment}
								<span class="skill-comment">{skill.comment}</span>
							{/if}
						</span>

						<span class="col-value">{fmt(abilityMod)}</span>

						<span class="col-value col-prof">
							{profBonus > 0 ? fmt(profBonus) : "—"}
						</span>

						<span class="col-value bold">{fmt(total)}</span>
					</div>
				{/each}
			{/each}
		</div>
	</div>
{/if}

<style>
	.skills-container {
		display: flex;
		flex-direction: column;
		gap: 0.4em;
		width: 100%;
	}

	.skills-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.3em;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.title {
		font-size: 1.05em;
		font-weight: bold;
	}

	.bold {
		font-weight: bold;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.4em;
	}

	.sort-btn {
		font-size: 0.75em;
		padding: 0.1em 0.5em;
		min-height: 24px;
		touch-action: manipulation;
		cursor: pointer;
	}

	.prof-badge {
		font-size: 0.85em;
		padding: 0.1em 0.5em;
		border-radius: 4px;
		background: var(--background-modifier-hover);
		color: var(--text-muted);
	}

	.skill-list {
		display: flex;
		flex-direction: column;
		gap: 0.1em;
	}

	/* icon | name+ability | mod | prof | total */
	.skill-row {
		display: grid;
		grid-template-columns: 1.4em 1fr 3em 3em 3.5em;
		align-items: center;
		gap: 0.3em;
		padding: 0.2em 0.3em;
		border-radius: 4px;
	}

	.skill-row:hover:not(.header-row) {
		background: var(--background-modifier-hover);
	}

	.header-row {
		border-bottom: 1px solid var(--background-modifier-border);
		padding-bottom: 0.25em;
	}

	.col-label {
		font-size: 0.7em;
		color: var(--text-muted);
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.prof-icon {
		text-align: center;
		font-size: 0.8em;
		color: var(--text-faint);
		cursor: default;
	}

	.prof-icon--proficient {
		color: var(--interactive-accent) !important;
	}

	.prof-icon--expertise {
		color: var(--color-yellow, #d4a017) !important;
	}

	.skill-name {
		font-size: 0.9em;
		display: flex;
		flex-direction: column;
		gap: 0.05em;
		overflow: hidden;
	}

	.skill-name-row {
		display: flex;
		align-items: baseline;
		gap: 0.3em;
	}

	.skill-ability {
		font-size: 0.75em;
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.skill-comment {
		font-size: 0.72em;
		color: var(--text-muted);
		font-style: italic;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.col-value {
		font-size: 0.85em;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.col-prof {
		color: var(--text-muted);
	}

	.group-header {
		font-size: 0.72em;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		padding: 0.4em 0.3em 0.1em;
		border-bottom: 1px solid var(--background-modifier-border);
		margin-top: 0.2em;
	}
</style>
