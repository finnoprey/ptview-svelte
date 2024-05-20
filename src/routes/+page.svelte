<script>
  export let data

  let stops = data?.stops || []
  let status = data?.status || null

  let USE_FAKE = data?.USE_FAKE || false

  function determine_class_from_type(type) {
    return type === 0 ? 'train' : type === 1 ? 'tram' : type === 2 ? 'bus' : ''
  }

  function has_estimated_time(departure) {
    return departure.estimated_departure_utc != null
  }
</script>

{#if status === 302}
  <p>Redirecting to positioner...</p>
{:else if stops.length}
  <h1>Nearby</h1>
  <div class="main">
    <table>
    {#each stops as stop}
      <p>{stop.stop_name} ({Math.round(stop.stop_distance)}m)</p>
      {#each stop.routes as route, i}
        <!-- <tr class="option-{determine_class_from_type(route.route_type)}">
          <td colspan="4" align="center">
            <h2>{route.route_number}</h2>
          </td>
          <td>
            <p><strong>{route.route_name.split(' - ')[0]}</strong> in <strong>9</strong></p>
            <p><strong>{route.route_name.split(' - ')[1]}</strong> in <strong>15</strong></p>
          </td>
        </tr> -->
        {#each route.departures as departure, i}
          { #if route.route_type < 3 } <!-- EXCLUDE non-metro services -->
            <tr class="option-{determine_class_from_type(route.route_type)}">
              <td colspan="4" align="center">
                {#if i === 0} <!-- REMOVE route number after first display -->
                  <h2>{route.route_number}</h2>
                {/if}
              </td>
              <td>
                <p><strong>{departure.direction_from_name}</strong> to <strong>{departure.direction_to_name}</strong></p>
              </td>
              <td>
                <p>{ (has_estimated_time(departure) ? Math.floor((new Date(departure.estimated_departure_utc).getTime() - new Date().getTime()) / (1000 * 60)) : Math.floor((new Date(departure.scheduled_departure_utc).getTime() - new Date().getTime()) / (1000 * 60))) } mins</p>
                {#if !has_estimated_time(departure)}
                  <p>(Scheduled)</p>
                {/if}
              </td>
            </tr>
          {/if}
        {/each}
      {/each}
    {/each}
    <tr>
      
    </tr>
    </table>
  </div>
{:else}
  <p>Loading...</p>
{/if}

<style>
  * {
    padding: 0px;
    margin: 0px;
  }

  h1 {
    font-size: 48px;
    font-weight: 100;
    line-height: 34px;
  }

  table {
    border-spacing: 0;
    border-collapse: collapse;
  }

  .main {
    display: flex;
    flex-direction: column;
  }

  .option {
    display: flex;
    align-items: center;
    height: 60px;
  }

  td {
    height: 40px;
  }

  .option > td > h2 {
    margin-left: 10px;
    margin-right: 10px;
    font-size: 30px;
  }

  .option > td > p {
    font-size: 16px;
  }

  tr.option-train {
    background-color: #6592fc;
  }

  tr.option-train:nth-child(odd) {
    background-color: #467af4;
  }

  tr.option-tram {
    background-color: #A6E441;
  }

  tr.option-tram:nth-child(odd) {
    background-color: #94cc3a;
  }

  tr.option-bus {
    background-color: #F4AF46;
  }

  tr.option-bus:nth-child(odd) {
    background-color: #e4a240;
  }
</style>