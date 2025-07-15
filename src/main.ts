import './styles.css'

import { Plugin, parseYaml, TFile } from 'obsidian';
import { mount, unmount } from 'svelte';
import { PluginFileManager } from '@src/Managers/PluginFileManager';
import TrackerButtons from '@src/TrackerButtons/TrackerButtons.svelte';
import Tracker from '@src/Tracker/Tracker.svelte';
import HitPoint from '@src/HitPoints/HitPoints.svelte';
import Money from '@src/Money/Money.svelte';

import { TtrpgStatsSettingTab } from './Settings/SettingTab';
import type { TtrpgStatsPluginSettings } from './Settings/TtrpgStatsPluginSettings';

export default class TtrpgStatsPlugin extends Plugin {

	settings: TtrpgStatsPluginSettings | undefined;
	components: [] = [];
	pluginFileManagers: Map<string, PluginFileManager> = new Map();


	async onload() {

		await this.loadSettings();
		this.addSettingTab(new TtrpgStatsSettingTab(this.app, this));
		this.registerComponent('ttrpgstats-hp', HitPoint);
		this.registerComponent('ttrpgstats-tracker', Tracker);
		this.registerComponent('ttrpgstats-button', TrackerButtons);
		this.registerComponent('ttrpgstats-valuta', Money);

		this.app.metadataCache.on('changed', this.onMetadataCacheChange.bind(this));

	}

	onMetadataCacheChange(changedFile: TFile) {
		const pluginFileManager = this.pluginFileManagers.get(changedFile.path);
		if (pluginFileManager) {
			pluginFileManager.propertiesUpdated()
		}
	}

	registerComponent(name: string, component: any) {

		this.registerMarkdownCodeBlockProcessor(name, async (source, el, ctx) => {
			try {
				const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);

				if (file && file instanceof TFile) {
					let pluginFileManager = this.pluginFileManagers.get(file.path);
					if (!pluginFileManager) {
						pluginFileManager = new PluginFileManager(this.app, file);
						this.pluginFileManagers.set(file.path, pluginFileManager);
					}
					const content = parseYaml(source) as Record<string, any>;

					this.components.push(mount(component, {
						target: el,
						props: {
							settings: this.settings,
							content: content,
							pluginFileManager: pluginFileManager,
						}
					}));
				}
			} catch (e) {
				el.createEl('pre',
					{ text: 'Error rendering HTML: ' + e });
			}
		})
	}

	onunload() {
		for (const component of this.components) {

			unmount(component);
		}
		this.components = [];
		this.pluginFileManagers = new Map();

		this.app.metadataCache.off('changed', this.onMetadataCacheChange);
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
