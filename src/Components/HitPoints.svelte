<script lang="ts">
	let {
		properties: properties,
		updateProperties: updateProperties,
		settings: settings,
	}: DefaultComponentProperties = $props();

	let maxHealth = $state(
		parseInt(properties[settings.maxHealthPropertyName]),
	);
	let currentHealth = $state(
		parseInt(properties[settings.currentHealthPropertyName]),
	);
	let deathsaveSuccess = $state(
		parseInt(properties[settings.deathSaveSuccessPropertyName] ?? "0"),
	);
	let deathsavefail = $state(
		parseInt(properties[settings.deathSaveFailurePropertyName] ?? "0"),
	);

	function checkAndFixHealth() {
		if (isNaN(maxHealth) || isNaN(currentHealth)) {
			if (isNaN(maxHealth)) {
				maxHealth = 0;
			}
			if (isNaN(currentHealth)) {
				currentHealth = maxHealth;
			}

			debugger;
			updateProperties([
				{
					key: settings.maxHealthPropertyName,
					value: maxHealth,
				},
				{
					key: settings.currentHealthPropertyName,
					value: currentHealth,
				},
			]);
		}
	}

	checkAndFixHealth();

	let healAmount = $state(1);

	function heal() {
		currentHealth = Math.min(currentHealth + healAmount, maxHealth);
		healAmount = 1;
		updateProperties([
			{
				key: settings.currentHealthPropertyName,
				value: currentHealth.toString(),
			},
			{ key: settings.deathSaveSuccessPropertyName, value: null },
			{ key: settings.deathSaveFailurePropertyName, value: null },
		]);

		healAmount = 1;
	}

	function damage() {
		if (currentHealth <= 0) {
			return; // Cannot damage if already at 0 health
		}

		currentHealth = currentHealth - healAmount;
		healAmount = 1;

		if (currentHealth <= 0) {
			currentHealth = 0;
			updateProperties([
				{
					key: settings.currentHealthPropertyName,
					value: currentHealth.toString(),
				},
				{ key: settings.deathSaveSuccessPropertyName, value: 0 },
				{ key: settings.deathSaveFailurePropertyName, value: 0 },
			]);
			deathsaveSuccess = 0;
			deathsavefail = 0;

			return;
		}

		updateProperties([
			{
				key: settings.currentHealthPropertyName,
				value: currentHealth.toString(),
			},
		]);
	}

	function handleDeathSaveSuccessClick(event: any) {
		const checked = event?.target?.checked;

		deathsaveSuccess += checked ? 1 : -1;

		updateProperties([
			{
				key: settings.deathSaveSuccessPropertyName,
				value: deathsaveSuccess.toString(),
			},
		]);
	}

	function handleDeathSaveFailClick(event: any) {
		event.preventDefault();
		const checked = event?.target?.checked;

		deathsavefail += checked ? 1 : -1;

		updateProperties([
			{
				key: settings.deathSaveFailurePropertyName,
				value: deathsavefail.toString(),
			},
		]);
	}
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
								class="big-checkbox green-checkbox"
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
								class="big-checkbox red-checkbox"
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
			class="capitalize bold font-bigger color-green min-width-250"
			>Heal</button
		>
		{#key healAmount}
			<input
				type="number"
				class="min-width-250 text-center font-bigger"
				bind:value={healAmount}
			/>
		{/key}
		<button
			onclick={damage}
			class="capitalize bold font-bigger color-red font-white min-width-250"
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
		width: 250px;
		text-align: center;
	}

	.text-center {
		text-align: center;
	}

	.big-checkbox {
		width: 25px;
		height: 25px;
		background: transparent;
		border-radius: 5px;
		border: 2px solid #555;
		color: transparent;
	}

	.big-checkbox:checked:after {
		display: none;
	}

	.big-checkbox:hover,
	.big-checkbox:checked,
	.big-checkbox:hover:checked,
	.big-checkbox:after {
		border-radius: 5px;
		border: 2px solid #555;
		animation: none;
	}

	.red-checkbox:hover,
	.red-checkbox:checked,
	.red-checkbox:hover:checked,
	.red-checkbox:after {
		background-color: red;
	}
	.green-checkbox:hover,
	.green-checkbox:checked,
	.green-checkbox:hover:checked,
	.green-checkbox:after {
		background-color: green;
	}
</style>
