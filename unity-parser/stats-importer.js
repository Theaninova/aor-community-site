import { configDotenv } from "dotenv";
import * as path from "path";
import { readFile, writeFile } from "fs/promises";

configDotenv()

const setupDir = path.join(process.env.GAME_DUMP_PATH, 'ExportedProject', 'Assets', 'Resources', 'prefabs', 'carsetups')

const groups = {
  group2: "60s_setup.txt",
  group3: "70s_setup.txt",
  group4: "80s_setup.txt",
  groupA: "groupa_setup.txt",
  groupB: "groupb_setup.txt",
  groupS: "groups_setup.txt",
  dakar: "bonus_dakar_setup.txt",
  logging: "bonus_logging_setup.txt",
  piaggio: "bonus_piaggio_setup.txt",
  vans: "bonus_vans_setup.txt",
}

for (const key in groups) {
  groups[key] = parseConfigFile(await readFile(path.join(setupDir, groups[key]), 'utf8'))
}

function parseConfigFile(file) {
  return file
    .split(/^\[/m)
    .filter(it => it !== it.trim())
    .map(group => {
      const [title, ...props] = group.split("\n").filter(it => it !== it.trim())

      return [
        camelCaseToTitleCase(title.replace(/]$/m, "")),
        props
          .map(prop => {
            const [key, value] = prop.split("=")
            return [camelCaseToTitleCase(key), value]
          })
          .filter(([, it]) => !!it),
      ]
    })
}

function camelCaseToTitleCase(camelCase) {
  return camelCase
    .replace(/-/g, " - ")
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/(^| )./g, match => match.toUpperCase())
    .trim()
}

export const SETUP = [
  ["Group 2", groups.group2],
  ["Group 3", groups.group3],
  ["Group 4", groups.group4],
  ["Group B", groups.groupB],
  ["Group S", groups.groupS],
  ["Group A", groups.groupA],
  ["Dakar", groups.dakar],
  ["Logging", groups.logging],
  ["Triwheeler", groups.piaggio],
  ["Vans", groups.vans],
]

await writeFile(path.join('src', 'assets', 'car-stats', 'car-setups.json'), JSON.stringify(SETUP, null, 2))
