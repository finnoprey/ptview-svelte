import { onMount } from "svelte";
import { page } from '$app/stores'
import { redirect } from '@sveltejs/kit';
import { DEV_ID, DEV_KEY, USE_FAKE, VERCEL_URL, VERCEL_ENV } from '$env/static/private';

const PTV_API_BASE_URL = 'https://timetableapi.ptv.vic.gov.au'
const PTV_API_VERSION = 'v3'
const DISTANCE = 1000
const MAX_RESULTS = 2

const BASE_URL = ( VERCEL_ENV == 'development' ? 'http://' : 'https://') + VERCEL_URL

export async function load({ url }) {
  const latitude = url.searchParams.get('latitude')
  const longitude = url.searchParams.get('longitude') 

  console.log(VERCEL_URL)

  if (!latitude || !longitude) {
    throw redirect(302, '/positioner');
  }

  // type 0: train, type 1: tram, type 2: bus
  
  async function ptv_request(content) {
    const combiner = content.includes('?') ? '&' : '?';
    const url_path = `/${PTV_API_VERSION}${content}${combiner}devid=${DEV_ID}`
  
    const signature_response = await fetch(`${BASE_URL}/api/hmacsha1?key=${DEV_KEY}&value=${encodeURIComponent(url_path)}`)
    const signature = await signature_response.text()
  
    const response = await fetch(`${PTV_API_BASE_URL}${url_path}&signature=${signature}`);
    const body = await response.json();

    return body;
  }

  if (USE_FAKE == "true") {
    let fake_data = await fetch(`${BASE_URL}/fake_data.json`)
    return fake_data.json()
  } else {
    let data = await ptv_request(`/stops/location/${latitude},${longitude}?max_distance=${DISTANCE}&max_results=${MAX_RESULTS}`)
    
    for (let stop of data.stops) {
      for (let route of stop.routes) {
        let departure_data = await ptv_request(`/departures/route_type/${route.route_type}/stop/${stop.stop_id}/route/${route.route_id}?max_results=2&expand=Direction`)
        route.directions = departure_data.directions
        
        for (let departure of departure_data.departures) {
          let direction_to_id = departure.direction_id;
      
          let route_directions_list = Object.values(route.directions).map(direction => direction.direction_id);
      
          // make list of direction id numbers
          let direction_from_id = route_directions_list.find(number => number !== direction_to_id);
      
          // find direction names using direction id's
          let direction_to_name = route.directions[direction_to_id]?.direction_name || '';
          let direction_from_name = route.directions[direction_from_id]?.direction_name || '';
      
          // set direction names to departure object
          departure.direction_from_name = direction_from_name;
          departure.direction_to_name = direction_to_name;
      }

        route.departures = departure_data.departures
      }
    }

    data.USE_FAKE = false // passthrough that data is real
    return data;
  }
}