/**
 * Test file to verify mfapi.in integration
 * Tests the new dynamic NAV fetching functionality
 * 
 * Run with: node testMFAPIIntegration.js
 */

import { getLatestNAV, getSchemeHistory, searchSchemes } from './services/mfService.js'

async function runTests() {
  console.log('🚀 Testing mfapi.in Integration\n')
  console.log('=' .repeat(60))

  // Test 1: Get latest NAV for a specific scheme
  console.log('\n📊 Test 1: Fetch Latest NAV')
  console.log('-'.repeat(60))
  try {
    const schemeCode = '120503' // Axis Bluechip Fund
    console.log(`Fetching latest NAV for scheme: ${schemeCode}`)
    const nav = await getLatestNAV(schemeCode)
    if (nav) {
      console.log('✅ Success!')
      console.log(JSON.stringify(nav, null, 2))
    } else {
      console.log('❌ Failed to fetch NAV')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  // Test 2: Get historical data for a scheme
  console.log('\n📈 Test 2: Fetch Historical NAV Data (Last 3 months)')
  console.log('-'.repeat(60))
  try {
    const schemeCode = '120503'
    console.log(`Fetching 3-month history for scheme: ${schemeCode}`)
    const history = await getSchemeHistory(schemeCode, 3)
    if (history && history.length > 0) {
      console.log('✅ Success!')
      console.log(`Retrieved ${history.length} data points`)
      console.log('Sample (last 5 entries):')
      console.log(JSON.stringify(history.slice(-5), null, 2))
    } else {
      console.log('❌ No history data found')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  // Test 3: Search for funds by name
  console.log('\n🔍 Test 3: Search Mutual Funds')
  console.log('-'.repeat(60))
  try {
    const query = 'axis bluechip'
    console.log(`Searching for: "${query}"`)
    const results = await searchSchemes(query)
    if (results && results.length > 0) {
      console.log('✅ Success!')
      console.log(`Found ${results.length} funds`)
      console.log(JSON.stringify(results.slice(0, 3), null, 2))
    } else {
      console.log('❌ No results found')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }

  // Test 4: Test with different scheme codes
  console.log('\n💼 Test 4: Multiple Schemes')
  console.log('-'.repeat(60))
  const testSchemes = [
    { code: '120503', name: 'Axis Bluechip Fund' },
    { code: '119551', name: 'ICICI Prudential Bluechip Fund' },
    { code: '122639', name: 'Mirae Asset Large Cap Fund' },
  ]

  for (const scheme of testSchemes) {
    try {
      console.log(`\nFetching NAV for: ${scheme.name} (${scheme.code})`)
      const nav = await getLatestNAV(scheme.code)
      if (nav) {
        console.log(`✅ NAV: ₹${nav.nav} (as of ${nav.date})`)
      } else {
        console.log('❌ Could not fetch')
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('✨ Test Suite Completed\n')
}

// Run tests
runTests().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
