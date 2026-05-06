import { App, Modal, Editor, parseYaml } from 'obsidian';
import { mount, unmount } from 'svelte';
import Configurator from './Configurator.svelte';

const COMPONENT_TYPES: Record<string, string> = {
    'ttrpgstats-hp': 'hp',
    'ttrpgstats-tracker': 'tracker',
    'ttrpgstats-button': 'button',
    'ttrpgstats-valuta': 'valuta',
    'ttrpgstats-skills': 'skills',
};

interface DetectedBlock {
    type: string;
    config: Record<string, any>;
    startLine: number;
    endLine: number;
}

function detectBlockAtCursor(editor: Editor): DetectedBlock | null {
    const cursor = editor.getCursor();
    const lineCount = editor.lineCount();

    let startLine = -1;
    let codeBlockName = '';

    for (let i = cursor.line; i >= 0; i--) {
        const line = editor.getLine(i);
        const match = line.match(/^```(ttrpgstats-[\w-]+)/);
        if (match) {
            startLine = i;
            codeBlockName = match[1];
            break;
        }
        if (i !== cursor.line && line.startsWith('```')) break;
    }

    if (startLine === -1 || !COMPONENT_TYPES[codeBlockName]) return null;

    let endLine = -1;
    for (let i = startLine + 1; i < lineCount; i++) {
        if (editor.getLine(i).startsWith('```')) {
            endLine = i;
            break;
        }
    }

    if (endLine === -1) return null;

    const yamlLines = [];
    for (let i = startLine + 1; i < endLine; i++) {
        yamlLines.push(editor.getLine(i));
    }
    const yaml = yamlLines.join('\n').trim();
    const config = yaml ? (parseYaml(yaml) as Record<string, any>) ?? {} : {};

    return { type: COMPONENT_TYPES[codeBlockName], config, startLine, endLine };
}

export class ConfiguratorModal extends Modal {
    private editor: Editor;
    private svelteComponent: any;

    constructor(app: App, editor: Editor) {
        super(app);
        this.editor = editor;
    }

    onOpen() {
        this.modalEl.style.width = 'min(90vw, 680px)';

        const existing = detectBlockAtCursor(this.editor);

        if (existing) {
            this.titleEl.setText('Edit TTRPG Component');
        } else {
            this.titleEl.setText('Insert TTRPG Component');
        }

        this.contentEl.empty();
        this.svelteComponent = mount(Configurator, {
            target: this.contentEl,
            props: {
                initialType: existing?.type ?? null,
                initialConfig: existing?.config ?? null,
                onInsert: (codeBlock: string) => {
                    if (existing) {
                        this.editor.replaceRange(
                            codeBlock,
                            { line: existing.startLine, ch: 0 },
                            { line: existing.endLine, ch: this.editor.getLine(existing.endLine).length }
                        );
                    } else {
                        this.editor.replaceSelection(codeBlock);
                    }
                    this.close();
                }
            }
        });
    }

    onClose() {
        if (this.svelteComponent) {
            unmount(this.svelteComponent);
            this.svelteComponent = null;
        }
        this.contentEl.empty();
    }
}
