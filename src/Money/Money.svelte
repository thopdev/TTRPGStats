<script lang="ts">
	import { TrackerEventModel } from "src/Events/TrackerEventModel";
	import type { DefaultComponentProperties } from "src/General/Models/DefaultComponentProperties";
	import { ToMoneyConfig, ValutaConfig } from "./MoneyConfig";

	let { settings, content, pluginFileManager }: DefaultComponentProperties =
		$props();

	let values = new Map<ValutaConfig, number>();

	let { value: money, error } = ToMoneyConfig(content);

	money.valutas.forEach((valuta) => {
		let value = pluginFileManager.properties[valuta.name];
		if (!value) {
			value = 0;
		}
		values.set(valuta, value);
	});

	function calculate() {
		let total = 0;
		values.forEach((amount, valuta) => {
			total += amount * (valuta.multiplier ?? 1);
		});
		return Math.floor(
			total /
				(money.valutas.find((x) => x.defaultValue)?.multiplier ?? 1),
		);
	}
</script>

<div class="grid">
	<div>Total {money.valutas.find((x) => x.defaultValue).name}</div>
	<div>{calculate()}</div>
	{#each Array.from(values.entries()) as [valuta, amount]}
		<div class="capitalize">{valuta.name}</div>
		<div>{amount}</div>
	{/each}
</div>

<div class="container row width">
	{#each Array.from(values.entries()) as [valuta, amount]}
		<div class="container">
			<div class="capitalize text-center w-full">{valuta.name}</div>
			<input
				class="input-width"
				type="number"
				size="4"
				inputmode="decimal"
			/>
		</div>
	{/each}
</div>
<div class="container row">
	<button style="flex-grow: 1;"> Add </button>
	<button style="flex-grow: 1;"> Remove </button>
	<button style="flex-grow: 1;"> Clear </button>
</div>

<style>
	.input-width {
		width: 60px;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5em;
	}

	.grid {
		display: grid;
		grid-template-columns: 80% 20%;
	}

	.row {
		flex-direction: row;
	}
	.capitalize {
		text-transform: capitalize;
	}

	.a {
		text-align: center;
	}
</style>
