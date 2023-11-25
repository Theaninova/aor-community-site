<script>
  import {Canvas, Object3DInstance, OrbitControls, Pass, T} from "@threlte/core"
  import {Environment, GLTF, useGltf} from "@threlte/extras"
  import {TextureLoader, Vector2} from "three"
  import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
  import {SAOPass} from "three/examples/jsm/postprocessing/SAOPass.js"
  import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass.js"
  import {GlitchPass} from "three/addons/postprocessing/GlitchPass.js"
  import cars from "$lib/leaderboard/data/cars.json"

  const loader = new TextureLoader()
  export let car = "Car_A1"
  let livery = "7"
  let liveryLoading = true

  $: gltf = undefined // useGltf(`/cars/${car}/${car}.glb`).gltf

  $: if ($gltf) {
    $gltf.nodes["Shadow"].visible = false
  }

  $: if ($gltf) {
    console.log("Loading livery", livery)
    liveryLoading = true
    /*loader.loadAsync(`/cars/${car}/liveries/${livery}.png`)
      .then(texture => {
        texture.flipY = false
        /** @type {import('three').MeshStandardMaterial} *
        const material = $gltf.nodes['body'].material
        material.map = texture
        material.needsUpdate = true
        liveryLoading = false
      })*/
  }
</script>

<div class="selector">
  <select name="car" id="car-selector" bind:value={car}>
    {#each cars as car}
      <option value={car.prefabName}>{car.name}</option>
    {/each}
  </select>

  <select name="livery" id="livery-selector" bind:value={livery} disabled={liveryLoading}>
    {#each [1, 2, 3, 4, 5, 6, 7] as i}
      <option value={i.toString()}>Livery {i}</option>
    {/each}
  </select>
</div>

<Canvas>
  <T.PerspectiveCamera makeDefault position={[5, 5, 5]}>
    <OrbitControls />
  </T.PerspectiveCamera>

  {#if $gltf}
    <Object3DInstance position={{y: 0.7}} object={$gltf.scene} />
  {/if}

  <!-- <Pass pass={new UnrealBloomPass(new Vector2(512, 512), 1.5, 1, 0.5)} /> -->
  <Environment
    path="/cars/"
    files="kloofendal_38d_partly_cloudy_1k.hdr"
    isBackground
    groundProjection={{radius: 50, height: 5, scale: {x: 25, y: 25, z: 25}}}
  />
</Canvas>

<style lang="scss">
  .selector {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
