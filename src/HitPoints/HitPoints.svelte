<script lang="ts">
	import type { DefaultComponentProperties } from "src/General/Models/DefaultComponentProperties";
	import { onDestroy } from "svelte";

	const id = crypto.randomUUID().toString();

	let { settings, content, pluginFileManager }: DefaultComponentProperties =
		$props();

	let maxHealth = $state(0);
	let currentHealth = $state(0);
	let deathsaveSuccess = $state(0);
	let deathsavefail = $state(0);
	let healAmount = $state(1);

	loadProperties();

	pluginFileManager.propertyChangedEvent.on(id, loadProperties);
	validateHealth();

	function validateHealth() {
		if (isNaN(maxHealth)) {
			maxHealth = 1;
			pluginFileManager.properties[settings.maxHealthPropertyName] = 1;
			pluginFileManager.saveProperties(id);
		}
	}

	function heal() {
		currentHealth = Math.min(currentHealth + healAmount, maxHealth);
		healAmount = 1;

		pluginFileManager.properties[settings.currentHealthPropertyName] =
			currentHealth;
		pluginFileManager.properties[settings.deathSaveSuccessPropertyName] =
			null;
		pluginFileManager.properties[settings.deathSaveFailurePropertyName] =
			null;

		pluginFileManager.saveProperties(id);

		healAmount = 1;
	}

	function damage() {
		if (currentHealth <= 0) {
			return; // Cannot damage if already at 0 health
		}

		currentHealth = currentHealth - healAmount;
		healAmount = 1;

		pluginFileManager.properties[settings.currentHealthPropertyName] =
			currentHealth;

		if (currentHealth <= 0) {
			pluginFileManager.properties[
				settings.deathSaveSuccessPropertyName
			] = 0;
			pluginFileManager.properties[
				settings.deathSaveFailurePropertyName
			] = 0;
		}
		pluginFileManager.saveProperties(id);
	}

	function handleDeathSaveSuccessClick(event: any) {
		const checked = event?.target?.checked;

		deathsaveSuccess += checked ? 1 : -1;

		pluginFileManager.saveProperties(id);
	}

	function handleDeathSaveFailClick(event: any) {
		event.preventDefault();
		const checked = event?.target?.checked;

		deathsavefail += checked ? 1 : -1;
		pluginFileManager.saveProperties(id);
	}

	function loadProperties() {
		maxHealth = parseInt(
			pluginFileManager.properties[settings.maxHealthPropertyName],
		);

		currentHealth = parseInt(
			pluginFileManager.properties[settings.currentHealthPropertyName],
		);

		if (isNaN(currentHealth)) {
			currentHealth = maxHealth;
		}

		deathsaveSuccess = parseInt(
			pluginFileManager.properties[
				settings.deathSaveSuccessPropertyName
			] ?? "0",
		);
		deathsavefail = parseInt(
			pluginFileManager.properties[
				settings.deathSaveFailurePropertyName
			] ?? "0",
		);
	}

	onDestroy(() => {
		pluginFileManager.propertyChangedEvent.off(id);
	});
</script>

<div class="container">
	<div class="container">
		<span class="font-bigger capitalize bold">Hit points</span>
		<span>
			<span class="font-bigger bold">{currentHealth}</span>/{maxHealth}
		</span>
	</div>
	{#if currentHealth === 0}
		<div class="container row">
			<div class="container">
				<span class="font-bigger capitalize">Success</span>
				<span>
					{#key deathsaveSuccess}
						{#each { length: 3 } as _, i}
							<input
								type="checkbox"
								class="big-checkbox green-checkbox pointer"
								checked={deathsaveSuccess > i}
								data-number={i}
								onchange={handleDeathSaveSuccessClick}
							/>
						{/each}
					{/key}
				</span>
			</div>
			<div class="container">
				<span class="font-bigger capitalize">Failures</span>
				<span>
					{#key deathsavefail}
						{#each { length: 3 } as _, i}
							<input
								type="checkbox"
								class="big-checkbox red-checkbox pointer"
								checked={deathsavefail > i}
								onclick={handleDeathSaveFailClick}
							/>
						{/each}
					{/key}
				</span>
			</div>
		</div>
	{/if}

	<div class="container">
		<button
			onclick={heal}
			class="capitalize bold font-bigger color-green min-width-250 pointer"
			>Heal</button
		>
		<input
			type="number"
			inputmode="numeric"
			class="min-width-250 text-center font-bigger"
			bind:value={healAmount}
		/>
		<button
			onclick={damage}
			class="capitalize bold font-bigger color-red font-white min-width-250 pointer"
		>
			Damage
		</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5em;
	}

	.row {
		flex-direction: row;
	}

	.capitalize {
		text-transform: uppercase;
	}

	.bold {
		font-weight: bold;
	}

	.font-bigger {
		font-size: 1.05em;
	}

	.color-red {
		background-color: red;
	}

	.color-green {
		background-color: green;
	}

	.font-white {
		color: white;
	}

	.min-width-250 {
		width: min(100%, 250px);
		text-align: center;
	}

	.text-center {
		text-align: center;
	}

	.big-checkbox {
		width: 32px;
		height: 32px;
		min-width: 32px;
		min-height: 32px;
		background: transparent;
		border-radius: 5px;
		border: 2px solid #555;
		color: transparent;
		touch-action: manipulation;
	}

	.big-checkbox:checked:after {
		display: none;
	}

	.big-checkbox:hover,
	.big-checkbox:active,
	.big-checkbox:checked,
	.big-checkbox:hover:checked,
	.big-checkbox:active:checked,
	.big-checkbox:after {
		border-radius: 5px;
		border: 2px solid #555;
		animation: none;
	}

	.red-checkbox:hover,
	.red-checkbox:active,
	.red-checkbox:checked,
	.red-checkbox:hover:checked,
	.red-checkbox:active:checked,
	.red-checkbox:after {
		background-color: red;
	}
	.green-checkbox:hover,
	.green-checkbox:active,
	.green-checkbox:checked,
	.green-checkbox:hover:checked,
	.green-checkbox:active:checked,
	.green-checkbox:after {
		background-color: green;
	}

	button {
		min-height: 44px;
		touch-action: manipulation;
	}

	.pointer {
		cursor: pointer;
	}
</style>
