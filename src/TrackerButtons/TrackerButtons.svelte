<script lang="ts">
	import type { TrackerEventModel } from "@src/Events/TrackerEventModel";
	import type { DefaultComponentProperties } from "@src/General/Models/DefaultComponentProperties";

	let { settings, content, pluginFileManager }: DefaultComponentProperties =
		$props();

	var buttons = $state(content?.buttons);
	function clickEvent(id: string) {
		pluginFileManager.trackerEvent.emit(new TrackerEventModel(id));
	}
</script>

<div class="container row">
	{#each buttons as button}
		<button
			onclick={() => clickEvent(button.id)}
			class="text-center font-bigger button-color bold font-bigger pointer"
			style="--color-button: {button.color};"
		>
			{button.name}
		</button>
	{/each}
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

	.bold {
		font-weight: bold;
	}
	.font-bigger {
		font-size: 1.05em;
	}

	.button-color {
		background-color: var(--color-button) !important;
	}

	.pointer {
		cursor: pointer;
	}
</style>
