<script lang="ts">
	import type { DefaultComponentProperties } from "@src/General/Models/DefaultComponentProperties";
	import { ToMoneyConfig, ValutaConfig } from "./MoneyConfig";
	import { ValutaData } from "./MoneyData.svelte";

	let { settings, content, pluginFileManager }: DefaultComponentProperties =
		$props();

	const id = crypto.randomUUID().toString();

	let { value: config, error } = ToMoneyConfig(content);
	let values: ValutaData[] = $state([]);
	let totalMoney = $state(
		pluginFileManager.properties[config?.id ?? ""] ?? 0,
	);

	let paymentErrors: ValutaData[] = $state([]);

	const defaultValue = config?.valutas.find((x) => x.defaultValue);
	config.valutas.forEach((valuta) => {
		let value = 0;

		if (config?.convert != true) {
			value = pluginFileManager.properties[valuta.name] ?? 0;
		}
		values.push(new ValutaData(valuta, value));
	});

	if (config?.convert) {
		convertValutas();
	}

	function calculate(getValue: (valuta: ValutaData) => number) {
		return values.reduce(
			(total, valuta) =>
				total + getValue(valuta) * (valuta.config.multiplier ?? 1),
			0,
		);
	}

	function calculateTotal() {
		return Math.floor(
			calculate((v) => v.value) / (defaultValue?.multiplier ?? 1),
		);
	}

	function add() {
		if (config?.convert) {
			totalMoney += calculate((v) => v.inputValue);
			saveTotalMoney();

			convertValutas();
		} else {
			values.forEach((data) => {
				data.value += data.inputValue;
			});
			saveValutas();
		}
		clear();
	}

	function remove() {
		if (config?.convert) {
			const moneyToRemove = calculate((v) => v.inputValue);
			if (moneyToRemove > totalMoney && config?.allowNegative != true) {
				paymentErrors = values.filter((x) => x.inputValue != 0);
				return;
			}
			totalMoney -= moneyToRemove;
			saveTotalMoney();
			convertValutas();
			return;
		} else {
			if (config?.allowNegative != true) {
				paymentErrors = values.filter(
					(data) => data.inputValue > data.value,
				);
				if (paymentErrors.length > 0) {
					return;
				}
			}
			values.forEach((data) => {
				data.value -= data.inputValue;
			});
			saveValutas();
		}
		clear();
		return;
	}

	function convertValutas() {
		let moneyLeft = totalMoney;

		values
			.toSorted((a, b) => a.config.multiplier - b.config.multiplier)
			.toReversed()
			.forEach((v) => {
				const moneyToRemove = Math.trunc(
					moneyLeft / v.config.multiplier,
				);

				v.value = moneyToRemove;
				moneyLeft -= moneyToRemove * v.config.multiplier;
			});
	}

	function clear() {
		values.forEach((data) => {
			data.inputValue = 0;
		});
	}

	function saveTotalMoney() {
		pluginFileManager.properties[config?.id ?? ""] = totalMoney;
		pluginFileManager.saveProperties(id);
	}

	function saveValutas() {
		values.forEach(
			(x) => (pluginFileManager.properties[x.config.name] = x.value),
		);
		pluginFileManager.saveProperties(id);
	}
</script>

<div class="flex flex-col gap-2">
	<div class="grid grid-cols-6">
		{#if defaultValue}
			<div class="col-span-5">
				<b>
					Total {defaultValue.name}
				</b>
			</div>
			<div><b> {calculateTotal()}</b></div>
		{/if}
		{#each values.filter((v) => config?.displayNull || v.value != 0) as data}
			{#key data.value}
				<div class="col-span-5 capitalize">{data.config.name}</div>
				<div>{data.value}</div>
			{/key}
		{/each}
	</div>

	<div class="flex gap-2">
		{#each values as data}
			<div class="flex flex-col w-full gap">
				<div class="capitalize text-center">{data.config.name}</div>
				<div class="flex flex-col">
					<input
						class="w-full {paymentErrors.some((x) => x == data)
							? 'form-error'
							: ''}"
						type="number"
						size="4"
						inputmode="decimal"
						bind:value={data.inputValue}
					/>
				</div>
			</div>
		{/each}
	</div>
	{#if paymentErrors.length > 0}
		<div class="text-red">Values could not be removed</div>
	{/if}
	<div class="flex gap-2">
		<button class="grow text-lg cursor-pointer" onclick={add}> Add </button>
		<button class="grow text-lg cursor-pointer" onclick={remove}>
			Remove
		</button>
		<button class="grow text-lg cursor-pointer" onclick={clear}>
			Clear
		</button>
	</div>
</div>

<style>
	.text-lg {
		font-size: 1.05rem;
	}

	.cursor-pointer {
		cursor: pointer;
	}

	.form-error {
		border-color: var(--color-red);
		border-width: 2px;
	}
</style>
