import type {PageLoad} from "./$types"
import type {Stage} from "../../../unity-parser/stage/stage"

export const load = (async ({fetch}) => {
  const stage = await fetch("/stages/Indonesia2dir.json").then<Stage>(it => it.json())
  const normalMapUrl = await fetch(
    `/stages/terrain/${stage.staticObjects.terrain.children[0].name}.normal.png`,
  ).then(it => it.url)
  const heightMapUrl = await fetch(
    `/stages/terrain/${stage.staticObjects.terrain.children[0].name}.height.png`,
  ).then(it => it.url)

  return {
    stage,
    heightMapUrl,
    normalMapUrl,
  }
}) satisfies PageLoad
