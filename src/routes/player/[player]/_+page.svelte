<script lang="ts">
  import PlatformSelector from "$lib/components/PlatformSelector.svelte"
  import {makeUserUrl} from "$lib/leaderboard/leaderboard"
  import {areas} from "$lib/leaderboard/data/stage/area"
  import {groups} from "$lib/leaderboard/data/stage/group"
  import {leaderboardWeathers} from "$lib/leaderboard/data/stage/weather"
  import {leaderboardDirection} from "$lib/leaderboard/data/stage/direction"
  import {makeLeaderboardString} from "$lib/leaderboard/leaderboard.js"

  let platform: number
  let userId: string

  let selectedUrls = []

  const total =
    areas.length *
    areas[0].stages.length *
    groups.length *
    leaderboardWeathers.length *
    Object.values(leaderboardDirection).length
</script>

<PlatformSelector bind:platform />

<input placeholder="name" bind:value={userId} />

<table>
  <thead>
    {selectedUrls.length} / {total}
  </thead>
  <tbody>
    <tr>
      <th />
      <th />
      <th />
      {#each groups as group}
        <th colspan="2">{group.name}</th>
      {/each}
    </tr>
    <tr>
      <th />
      <th />
      <th />
      {#each groups as group}
        {#each leaderboardWeathers as weather}
          <th>{weather.name === "Wet" ? "≊" : ""}</th>
        {/each}
      {/each}
    </tr>
    {#each areas as area, areaIndex}
      {#each area.stages as stage, stageIndex}
        {#each Object.values(leaderboardDirection) as direction, directionIndex}
          <tr class="area-{areaIndex % 2} stage-{stageIndex % 2} direction-{directionIndex % 2}">
            {#if stageIndex + directionIndex === 0}
              <th class="vertical" rowspan={area.stages.length * 2}>{area.name}</th>
            {/if}
            {#if directionIndex === 0}
              <td rowspan="2">{stage.name}</td>
            {/if}
            <td>{direction === "Forward" ? "" : "⭯"}</td>
            {#each groups as group, groupIndex}
              {#each leaderboardWeathers as weather, weatherIndex}
                <td class="group-{groupIndex % 2} weather-{weatherIndex % 2}">
                  <input
                    value={makeLeaderboardString({
                      direction: direction,
                      weather: weather.id,
                      group: group.id,
                      area: area.id,
                      stage: stage.id,
                    })}
                    bind:group={selectedUrls}
                    type="checkbox"
                  /></td
                >
              {/each}
            {/each}
          </tr>
        {/each}
      {/each}
    {/each}
  </tbody>
</table>

<section>
  {#each selectedUrls as url}
    <div>{url}</div>
  {/each}
</section>

<style lang="scss">
  @use "sass:list";
  @use "sass:color";

  $bg: hsl(120deg 40% 60% / 40%), hsl(140deg 40% 60% / 40%);

  .vertical {
    transform: rotateZ(180deg);
    writing-mode: vertical-rl;
  }

  td:has(input) {
    padding: 0;
  }

  input[type="checkbox"] {
    display: block;

    width: 100%;
    min-width: 32px;
    height: 100%;
    min-height: 32px;
    margin: 0;

    appearance: none;
  }
  @for $i from 0 through 1 {
    .area-#{$i} {
      $bg-local: list.nth($bg, $i + 1);

      background: $bg-local;

      td:has(:checked) {
        background: saturate($bg-local, 100%);
      }

      &.direction-1 {
        $bg-dir-1: color.adjust($bg-local, $lightness: -5%);

        background: $bg-dir-1;

        td:has(:checked) {
          background: saturate($bg-dir-1, 100%);
        }
      }

      &.stage-1 {
        $bg-1: color.adjust($bg-local, $saturation: -10%);

        background: $bg-1;

        td:has(:checked) {
          background: saturate($bg-1, 100%);
        }

        &.direction-1 {
          $bg-dir-1: color.adjust($bg-1, $lightness: -5%);

          background: $bg-dir-1;

          td:has(:checked) {
            background: saturate($bg-dir-1, 100%);
          }
        }
      }
    }
  }
</style>
