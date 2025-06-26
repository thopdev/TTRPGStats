<script lang="ts">
	import { type ConfigError } from "./ConfigError";

	let error: ConfigError = $props();

	function prettyPrintHtml(obj: any): string {
		// Simple HTML pretty printer for objects
		function serialize(value: any, indent = 0): string {
			const pad = "&nbsp;".repeat(indent * 2);
			if (Array.isArray(value)) {
				return value
					.map((item, idx) =>
						idx === 0
							? `<br>${pad}- ${serialize(item, indent + 1).replace(/^\s+/, "")}`
							: `${pad}- ${serialize(item, indent + 1).replace(/^\s+/, "")}`,
					)
					.join("<br>");
			} else if (value && typeof value === "object") {
				return Object.entries(value)
					.map(
						([key, val]) =>
							`${pad}<b>${key}:</b> ${serialize(val, indent + 1).replace(/^\s+/, "")}`,
					)
					.join("<br>");
			} else {
				return String(value);
			}
		}
		return serialize(obj);
	}
</script>

<p class="error">{error.errorTitle}</p>
<p class="bold">Example:</p>
<p>{@html prettyPrintHtml(error.exampleText)}</p>

<style>
	.error {
		color: red;
		font-weight: bold;
	}
	.bold {
		font-weight: bold;
	}
</style>
