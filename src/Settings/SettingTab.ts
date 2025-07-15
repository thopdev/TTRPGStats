import type TtrpgStatsPlugin from '@src/main';
import { PluginSettingTab, Setting } from 'obsidian';

export class TtrpgStatsSettingTab extends PluginSettingTab {
    plugin: TtrpgStatsPlugin;

    constructor(app: any, plugin: TtrpgStatsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        this.AddSetting(containerEl,
            "Max health",
            "Property name used for maximum health",
            "health_max",
            () => this.plugin.settings.maxHealthPropertyName,
            (value) => this.plugin.settings.maxHealthPropertyName = value);

        this.AddSetting(containerEl,
            "Current health",
            "Property name used for current health",
            "health_current",
            () => this.plugin.settings.currentHealthPropertyName,
            (value) => this.plugin.settings.currentHealthPropertyName = value);

        this.AddSetting(containerEl,
            "Death save failure",
            "Property name used for death save failures",
            "deathsave_failure",
            () => this.plugin.settings.deathSaveFailurePropertyName,
            (value) => this.plugin.settings.deathSaveFailurePropertyName = value);

        this.AddSetting(containerEl,
            "Death save success",
            "Property name used for death save successes",
            "deathsave_success",
            () => this.plugin.settings.deathSaveSuccessPropertyName,
            (value) => this.plugin.settings.deathSaveSuccessPropertyName = value);
    }

    AddSetting(element: HTMLElement, name: string, desc: string, placeholder: string, get: () => string, set: (value: string) => void) {

        new Setting(element)
            .setName(name)
            .setDesc(desc)
            .addText((text) => text
                .setPlaceholder(placeholder)
                .setValue(get())
                .onChange(async (value) => {
                    set(value);
                    await this.plugin.saveSettings();
                })
            );
    }
}
