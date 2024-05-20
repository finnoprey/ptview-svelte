import { error } from '@sveltejs/kit';
import hmacSHA1 from 'crypto-js/hmac-sha1';
import hex from 'crypto-js/enc-hex.js'

export function GET({ url }) {
	const value = decodeURIComponent(url.searchParams.get('value'))
	const key = url.searchParams.get('key')
	// console.log(key, value)
  let response = hex.stringify(hmacSHA1(value, key)).toUpperCase()
	// console.log(response)
	return new Response(String(response));
}