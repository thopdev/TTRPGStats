import { ConfigResult } from "@src/General/Models/ConfigResult";
import { ConfigError } from "@src/Error/ConfigError";
import { ToArray } from "@src/Functions/ToArray";

export class SkillItemConfig {
    name: string = "";
    ability: string = "str";
    proficient: boolean = false;
    expertise: boolean = false;
    comment: string | undefined = undefined;

    constructor(init?: Partial<SkillItemConfig>) {
        Object.assign(this, init);
    }
}

export class SkillConfig {
    proficiencyId: string = "proficiency_bonus";
    abilities: Record<string, string> = {
        str: "str", dex: "dex", con: "con",
        int: "int", wis: "wis", cha: "cha"
    };
    skills: SkillItemConfig[] = [];
    sort: "ability" | "name" | undefined = undefined;
    modifiers: boolean = false;

    constructor(init?: Partial<SkillConfig>) {
        Object.assign(this, init);
    }

    static DEFAULT = {
        proficiency: "proficiency_bonus",
        abilities: {
            str: "str",
            dex: "dex",
            con: "con",
            int: "int",
            wis: "wis",
            cha: "cha"
        },
        skills: [
            { name: "Athletics", ability: "str" },
            { name: "Acrobatics", ability: "dex" },
            { name: "Sleight of Hand", ability: "dex" },
            { name: "Stealth", ability: "dex", proficient: true },
            { name: "Arcana", ability: "int" },
            { name: "History", ability: "int" },
            { name: "Investigation", ability: "int" },
            { name: "Nature", ability: "int" },
            { name: "Religion", ability: "int" },
            { name: "Animal Handling", ability: "wis" },
            { name: "Insight", ability: "wis" },
            { name: "Medicine", ability: "wis" },
            { name: "Perception", ability: "wis", proficient: true },
            { name: "Survival", ability: "wis" },
            { name: "Deception", ability: "cha" },
            { name: "Intimidation", ability: "cha" },
            { name: "Performance", ability: "cha" },
            { name: "Persuasion", ability: "cha", expertise: true }
        ]
    };
}

export function ToSkillConfig(obj: Record<string, unknown> | undefined): ConfigResult<SkillConfig> {
    if (!obj?.skills) {
        return new ConfigResult<SkillConfig>({
            error: new ConfigError(
                "Yaml is missing required property 'skills'",
                SkillConfig.DEFAULT
            )
        });
    }

    const abilitiesRaw = obj.abilities;
    const abilities: Record<string, string> = (abilitiesRaw && typeof abilitiesRaw === "object" && !Array.isArray(abilitiesRaw))
        ? Object.fromEntries(
            Object.entries(abilitiesRaw as Record<string, unknown>).map(([k, v]) => [k, String(v)])
        )
        : { str: "str", dex: "dex", con: "con", int: "int", wis: "wis", cha: "cha" };

    const sortRaw = obj.sort;
    const sort: "ability" | "name" | undefined =
        sortRaw === "ability" || sortRaw === "name" ? sortRaw : undefined;

    return new ConfigResult<SkillConfig>({
        value: new SkillConfig({
            proficiencyId: typeof obj.proficiency === "string" ? obj.proficiency : "proficiency_bonus",
            abilities,
            sort,
            modifiers: obj.modifiers === true,
            skills: ToArray(obj.skills as Record<string, unknown>[]).map(s => new SkillItemConfig({
                name: typeof s.name === "string" ? s.name : "",
                ability: typeof s.ability === "string" ? s.ability : "str",
                proficient: s.proficient === true,
                expertise: s.expertise === true,
                comment: typeof s.comment === "string" ? s.comment : undefined,
            }))
        })
    });
}
