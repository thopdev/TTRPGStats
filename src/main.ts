import './styles.css'

import { Plugin, parseYaml, TFile, Editor, type MarkdownPostProcessorContext } from 'obsidian';
import { mount, unmount, type Component } from 'svelte';
import { PluginFileManager } from '@src/Managers/PluginFileManager';
import TrackerButtons from '@src/TrackerButtons/TrackerButtons.svelte';
import Tracker from '@src/Tracker/Tracker.svelte';
import HitPoint from '@src/HitPoints/HitPoints.svelte';
import Money from '@src/Money/Money.svelte';
import Skills from '@src/Skills/Skills.svelte';
import { ConfiguratorModal } from '@src/Configurator/ConfiguratorModal';

import { TtrpgStatsSettingTab } from './Settings/SettingTab';
import type { TtrpgStatsPluginSettings } from './Settings/TtrpgStatsPluginSettings';

export default class TtrpgStatsPlugin extends Plugin {

	settings: TtrpgStatsPluginSettings | undefined;
	components: ReturnType<typeof mount>[] = [];
	pluginFileManagers: Map<string, PluginFileManager> = new Map();

	async onload(): Promise<void> {

		await this.loadSettings();
		this.addSettingTab(new TtrpgStatsSettingTab(this.app, this));

		this.addCommand({
			id: 'open-configurator',
			name: 'Insert component',
			editorCallback: (editor: Editor) => {
				new ConfiguratorModal(this.app, editor).open();
			}
		});

		this.addRibbonIcon('plus-circle', 'Insert TTRPG component', () => {
			const editor = this.app.workspace.activeEditor?.editor;
			if (editor) {
				new ConfiguratorModal(this.app, editor).open();
			}
		});

		this.registerComponent('ttrpgstats-hp', HitPoint as unknown as Component);
		this.registerComponent('ttrpgstats-tracker', Tracker as unknown as Component);
		this.registerComponent('ttrpgstats-button', TrackerButtons as unknown as Component);
		this.registerComponent('ttrpgstats-valuta', Money as unknown as Component);
		this.registerComponent('ttrpgstats-skills', Skills as unknown as Component);

		this.app.metadataCache.on('changed', (file: TFile) => this.onMetadataCacheChange(file));
	}

	onMetadataCacheChange(changedFile: TFile): void {
		const pluginFileManager = this.pluginFileManagers.get(changedFile.path);
		if (pluginFileManager) {
			pluginFileManager.propertiesUpdated();
		}
	}

	registerComponent(name: string, component: Component): void {
		this.registerMarkdownCodeBlockProcessor(name, (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			try {
				const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);

				if (file && file instanceof TFile) {
					let pluginFileManager = this.pluginFileManagers.get(file.path);
					if (!pluginFileManager) {
						pluginFileManager = new PluginFileManager(this.app, file);
						this.pluginFileManagers.set(file.path, pluginFileManager);
					}
					const content = parseYaml(source) as Record<string, unknown>;

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
				el.createEl('pre', { text: 'Error rendering component: ' + String(e) });
			}
		});
	}

	onunload(): void {
		for (const component of this.components) {
			unmount(component);
		}
		this.components = [];
		this.pluginFileManagers = new Map();

		this.app.metadataCache.off('changed', (file: TFile) => this.onMetadataCacheChange(file));
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<TtrpgStatsPluginSettings>);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}

const DEFAULT_SETTINGS: TtrpgStatsPluginSettings = {
	maxHealthPropertyName: 'health_max',
	currentHealthPropertyName: 'health_current',
	deathSaveFailurePropertyName: 'deathsave_failure',
	deathSaveSuccessPropertyName: 'deathsave_success'
}
