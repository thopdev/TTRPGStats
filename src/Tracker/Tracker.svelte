<script lang="ts">
	import { ToTrackerConfig } from "./TrackerConfig";
	import Error from "../Error/Error.svelte";
	import { onDestroy } from "svelte";
	import type { DefaultComponentProperties } from "src/General/Models/DefaultComponentProperties";
	import type { TrackerEventModel } from "src/Events/TrackerEventModel";
	const id = crypto.randomUUID().toString();

	let { settings, content, pluginFileManager }: DefaultComponentProperties =
		$props();

	let { value: config, error: configError } = ToTrackerConfig(content);

	let currentValue: number = $state(0);

	if (config !== undefined && config !== null) {
		loadProperties();
		pluginFileManager.propertyChangedEvent.on(id, loadProperties);
		pluginFileManager.trackerEvent.on(trackerEvent);
	}

	function loadProperties() {
		let value = pluginFileManager.properties[config.id];
		if (!isNaN(value)) {
			currentValue = value;
		}
	}

	function click(event: any) {
		event.preventDefault();
		const checked = event?.target?.checked;

		currentValue += checked ? 1 : -1;
		pluginFileManager.properties[config.id] = currentValue;
		pluginFileManager.saveProperties(id);
	}

	function trackerEvent(event: TrackerEventModel) {
		const configEvent = config.events.find(
			(x) => x.name == event.trackerEventName,
		);
		if (!configEvent) {
			return;
		}

		switch (configEvent.action) {
			case "increase":
				currentValue = Math.min(currentValue + 1, config.max);
				break;
			case "decrease":
				currentValue = Math.max(currentValue - 1, 0);
				break;
			case "zero":
				currentValue = 0;
				break;
			case "max":
				currentValue = config.max;
				break;
			case "devideMaxUp":
				currentValue = Math.max(
					0,
					currentValue - Math.floor(config.max / 2.0),
				);
				break;
			case "devideMaxDown":
				currentValue = Math.max(
					0,
					currentValue - Math.ceil(config.max / 2.0),
				);
				break;

			default:
				// handle unknown actions if needed
				break;
		}
		pluginFileManager.properties[config.id] = currentValue;
		pluginFileManager.saveProperties(id);
	}

	onDestroy(() => {
		pluginFileManager.propertyChangedEvent.off(id);
		pluginFileManager.trackerEvent.off(trackerEvent);
	});
</script>

{#if configError != undefined}
	<Error
		errorTitle={configError.errorTitle}
		exampleText={configError.exampleText}
	/>
{:else}
	<div class="container">
		<span class="font-bigger bold">{config.name}</span>
		<div class="container row">
			{#key currentValue}
				{#each { length: config.max } as _, i}
					<input
						type="checkbox"
						style="--color-checkbox: {config.color};"
						class="big-checkbox checkbox pointer"
						checked={currentValue > i}
						onclick={click}
					/>
				{/each}
			{/key}
		</div>
	</div>
{/if}

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
	.bold {
		font-weight: bold;
	}

	.font-bigger {
		font-size: 1.05em;
	}

	.big-checkbox {
		width: 25px;
		height: 25px;
		background: transparent;
		border-radius: 5px;
		border: 2px sol #555;
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
		border: 2px sol #555;
		animation: none;
	}

	.checkbox:hover,
	.checkbox:checked,
	.checkbox:hover:checked,
	.checkbox:after {
		background-color: var(--color-checkbox);
	}
	.pointer {
		cursor: pointer;
	}
</style>
