<script lang="ts">
  import {
    AmbientLight,
    Canvas,
    DirectionalLight,
    Group,
    HemisphereLight,
    Line2,
    Mesh,
    OrbitControls,
    PerspectiveCamera,
  } from "@threlte/core"
  import {LineMaterial} from "three/examples/jsm/lines/LineMaterial.js"
  import type {PageData} from "./$types"
  import {
    BoxGeometry,
    CylinderGeometry,
    Euler,
    MeshBasicMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
    PCFShadowMap,
    PlaneGeometry,
    SphereGeometry,
    Texture,
    TextureLoader,
    Vector3,
  } from "three"
  import {browser} from "$app/environment"

  export let data: PageData

  $: heightMap = browser ? new TextureLoader().loadAsync(data.heightMapUrl) : undefined
  $: normalMap = browser
    ? new TextureLoader().loadAsync(data.normalMapUrl).then(it => {
        console.log(it)
        return it
      })
    : undefined

  $: {
    console.log(data.stage)
  }
</script>

<div>
  {#await Promise.all([heightMap, normalMap]) then [heightMap, normalMap]}
    <Canvas shadowMap shadows={true} shadowMapType={PCFShadowMap}>
      <PerspectiveCamera
        position={{x: 1000, y: 1000, z: 1000}}
        lookAt={{x: 0, y: 0, z: 0}}
        fov={60}
        far={40000}
      >
        <OrbitControls />
      </PerspectiveCamera>
      <DirectionalLight castShadow position={{x: 1000, y: 1000, z: 1000}} />
      <HemisphereLight intensity={0.2} />

      <Group rotation={data.stage.staticObjects.rotation} position={data.stage.staticObjects.position}>
        <Group
          rotation={data.stage.staticObjects.terrain.rotation}
          position={data.stage.staticObjects.terrain.position}
        >
          {#each data.stage.staticObjects.terrain.children as terrain}
            <Mesh
              receiveShadow
              castShadow
              scale={{x: 1, y: -1, z: 1}}
              rotation={new Euler(terrain.rotation.x - Math.PI / 2, terrain.rotation.y, terrain.rotation.z)}
              position={new Vector3(terrain.position.x, terrain.position.y, terrain.position.z).add(
                new Vector3(terrain.position.x * -2, -1024 / 3, terrain.position.z * -2).divideScalar(2),
              )}
              geometry={new PlaneGeometry(
                Math.abs(terrain.position.x * 2),
                Math.abs(terrain.position.z * 2),
                1024,
                1024,
              )}
              material={new MeshStandardMaterial({
                color: "#0e0e0e",
                roughness: 0.5,
                bumpMap: heightMap,
                bumpScale: 1024,
                // normalMap: normalMap,
                // normalScale: 2000,
                displacementMap: heightMap,
                displacementScale: 1024,
              })}
            />
          {/each}
        </Group>
      </Group>

      <Group position={data.stage.dynamicObjects.position} rotation={data.stage.dynamicObjects.rotation}>
        <Group
          position={data.stage.dynamicObjects.roadNetwork.position}
          rotation={data.stage.dynamicObjects.roadNetwork.rotation}
        >
          <Line2
            points={data.stage.dynamicObjects.roadNetwork.waypoints.points}
            position={data.stage.dynamicObjects.roadNetwork.waypoints.position}
            rotation={data.stage.dynamicObjects.roadNetwork.waypoints.rotation}
            material={new LineMaterial({worldUnits: true, linewidth: 8, color: "gray"})}
          />
        </Group>

        <Group
          position={data.stage.dynamicObjects.resetZones.position}
          rotation={data.stage.dynamicObjects.resetZones.rotation}
        >
          {#each data.stage.dynamicObjects.resetZones.children as resetZone}
            <Mesh
              geometry={new SphereGeometry(resetZone.radius)}
              position={resetZone.position}
              material={new MeshBasicMaterial({color: "red"})}
            />
          {/each}
        </Group>

        <Group
          position={data.stage.dynamicObjects.props.position}
          rotation={data.stage.dynamicObjects.props.rotation}
        >
          {#each data.stage.dynamicObjects.props.children as hayBale}
            {#if hayBale.name.startsWith("HayBale")}
              <Mesh
                castShadow
                geometry={new CylinderGeometry(1, 1, 2)}
                position={hayBale.position}
                rotation={hayBale.rotation}
                material={new MeshStandardMaterial({color: "orange"})}
              />
            {/if}
          {/each}
        </Group>

        <Group
          position={data.stage.prefabs.timingGates.position}
          rotation={data.stage.prefabs.timingGates.rotation}
        >
          <Mesh
            geometry={new BoxGeometry(16, 16, 4)}
            position={data.stage.prefabs.timingGates.forwardGate.position}
            rotation={data.stage.prefabs.timingGates.forwardGate.rotation}
            material={new MeshBasicMaterial({color: "green"})}
          />
          <Mesh
            geometry={new BoxGeometry(16, 16, 4)}
            position={data.stage.prefabs.timingGates.reverseGate.position}
            rotation={data.stage.prefabs.timingGates.reverseGate.rotation}
            material={new MeshBasicMaterial({color: "blue"})}
          />
        </Group>
      </Group>
    </Canvas>
  {/await}
</div>

<style lang="scss">
  div {
    width: 100%;
    height: 100%;
  }
</style>
