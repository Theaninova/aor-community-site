import { configDotenv } from "dotenv";
import * as path from "path";
import fs from "fs/promises";
import type { Car } from '../src/lib/leaderboard/data/cars'
import { existsSync } from "fs";

configDotenv()

const cars: Car[] = JSON.parse(await fs.readFile('src/lib/leaderboard/data/cars.json', 'utf8'))

const dumpPath = process.env.GAME_DUMP_PATH as string
const carPath = path.join(dumpPath, 'ExportedProject', 'Assets', 'Resources', 'prefabs', 'cars')
const staticPath = path.join('static', 'cars')

for (const car of cars) {
  const modelPath = path.join(carPath, car.prefabName.toLowerCase())
  const targetPath = path.join(staticPath, car.prefabName)
  if (existsSync(targetPath))
    await fs.rm(targetPath, { recursive: true })
  await fs.mkdir(targetPath)

  await fs.copyFile(path.join(modelPath, `${car.prefabName}.glb`), path.join(targetPath, `${car.prefabName}.glb`))

  const liveries = await fs.readdir(path.join(modelPath, 'liveries')).then(dir => dir.filter(it => it.endsWith('.png')))
  await fs.mkdir(path.join(targetPath, 'liveries'))
  for (const livery of liveries) {
    await fs.copyFile(path.join(modelPath, 'liveries', livery), path.join(targetPath, 'liveries', livery))
  }

  await fs.copyFile(path.join(modelPath, 'ao.png'), path.join(targetPath, 'ao.png'))
  await fs.copyFile(path.join(modelPath, 'dirttexture', 'dirt_texture.png'), path.join(targetPath, 'dirt.png'))
}
