<script lang="ts">
	let { onYaml }: { onYaml: (yaml: string) => void } = $props();

	$effect(() => {
		onYaml('');
	});
</script>

<div class="ttrpg-form">
	<div class="info">
		<p>The Hit Points component has no code block configuration.</p>
		<p>Property names (max health, current health, death saves) are configured in the plugin settings.</p>
	</div>
</div>
