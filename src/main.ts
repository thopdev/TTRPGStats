import { Editor, MarkdownView, Modal, Notice, Plugin, TFile } from 'obsidian';
import { mount, unmount } from 'svelte';
import HitPoint from './Components/HitPoints.svelte';
import { SettingTab } from './Plugin/SettingTab';
import { updateProperties } from './Functions/updateProperties';


export default class TtrpgStatsPlugin extends Plugin {

	settings: TtrpgStatsPluginSettings;
	hitPointComponent: ReturnType<typeof HitPoint> | undefined;


	async onload() {
		await this.loadSettings();
		debugger;
		this.addSettingTab(new SettingTab(this.app, this));
		this.registerComponent('ttrpgstats-hp', HitPoint);
	}


	registerComponent(name: string, component: any) {

		this.registerMarkdownCodeBlockProcessor(name, async (source, el, ctx) => {
			try {
				const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
				if (file && file instanceof TFile) {
					const metadata = this.app.metadataCache.getFileCache(file);
					const properties = metadata?.frontmatter;

					this.hitPointComponent = mount(component, {
						target: el,
						props: {
							properties: properties,
							settings: this.settings,
							updateProperties: (updates: KeyValue[]) => updateProperties(this.app, file, updates)
						}
					});
				}
			} catch (e) {
				el.createEl('pre',
					{ text: 'Error rendering HTML: ' + e });
			}
		})
	}

	onunload() {
		if (this.hitPointComponent) {
			unmount(this.hitPointComponent);
			this.hitPointComponent = undefined;
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

}

const DEFAULT_SETTINGS: TtrpgStatsPluginSettings = {
	maxHealthPropertyName: 'health_max',
	currentHealthPropertyName: 'health_current',
	deathSaveFailurePropertyName: 'deathsave_failure',
	deathSaveSuccessPropertyName: 'deathsave_success'
}
