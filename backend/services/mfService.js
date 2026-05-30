import axios from 'axios'
import MutualFund from '../models/MutualFund.js'
import Investment from '../models/Investment.js'

/**
 * MFAPI Service - Fetches mutual fund data from mfapi.in
 * API Base URL: https://api.mfapi.in/
 * Free API - No authentication needed
 * Returns dynamic NAV data for Indian mutual funds
 */

const MFAPI_BASE_URL = 'https://api.mfapi.in/mf'
const MAX_MFAPI_RETRIES = 2

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Get latest NAV for a specific scheme
 * @param {string} schemeCode - The scheme code
 * @returns {Object} { name, nav, date, fundHouse }
 */
export const getLatestNAV = async (schemeCode) => {
  let lastError = null

  for (let attempt = 1; attempt <= MAX_MFAPI_RETRIES; attempt += 1) {
    try {
      const response = await axios.get(`${MFAPI_BASE_URL}/${schemeCode}`, {
        timeout: 10000,
      })

      const { meta, data } = response.data

      if (!meta || !data || data.length === 0) {
        console.warn(`⚠️  No data found for scheme ${schemeCode}`)
        return null
      }

      const latestData = data[0]

      return {
        name: meta.scheme_name,
        nav: parseFloat(latestData.nav),
        date: latestData.date,
        fundHouse: meta.fund_house,
        schemeCode: meta.scheme_code,
      }
    } catch (error) {
      lastError = error
      const status = error?.response?.status
      const isRetryable = status >= 500 || !status

      console.warn(`⚠️  Cannot fetch latest NAV for ${schemeCode} (attempt ${attempt}):`, error.message)

      if (attempt < MAX_MFAPI_RETRIES && isRetryable) {
        await sleep(500 * attempt)
        continue
      }
      break
    }
  }

  // Fallback to MongoDB if API fails
  try {
    const fund = await MutualFund.findOne({ schemeCode })
    if (fund) {
      return {
        name: fund.schemeName,
        nav: fund.currentNAV,
        date: new Date().toISOString().split('T')[0],
        fundHouse: fund.fundHouse,
        schemeCode: fund.schemeCode,
      }
    }

    const investment = await Investment.findOne({ schemeCode }).sort({ lastUpdated: -1 })
    if (investment) {
      return {
        name: investment.name,
        nav: investment.currentNAV || investment.purchaseNAV || 0,
        date: (investment.lastUpdated || new Date()).toISOString().split('T')[0],
        fundHouse: investment.fundHouse,
        schemeCode,
      }
    }
  } catch (dbError) {
    console.error('Error fetching fallback NAV from MongoDB:', dbError.message)
  }

  if (lastError && lastError.response?.status >= 500) {
    console.warn(`⚠️  MFAPI still unavailable for ${schemeCode} after retries.`)
  }

  return null
}

/**
 * Get NAV history for a specific scheme
 * @param {string} schemeCode - The scheme code
 * @param {number} months - Number of months to get history for (default 12)
 */
export const getSchemeHistory = async (schemeCode, months = 12) => {
  let lastError = null

  for (let attempt = 1; attempt <= MAX_MFAPI_RETRIES; attempt += 1) {
    try {
      const response = await axios.get(`${MFAPI_BASE_URL}/${schemeCode}`, {
        timeout: 30000,
      })

      const { data } = response.data
      if (!data || data.length === 0) return []

      const daysToGet = months * 30
      return data
        .slice(0, daysToGet)
        .reverse()
        .map((item) => ({
          date: item.date,
          nav: parseFloat(item.nav),
        }))
    } catch (error) {
      lastError = error
      const status = error?.response?.status
      const isRetryable = status >= 500 || !status

      console.warn(`⚠️  Cannot fetch scheme history for ${schemeCode}:`, error.message)

      if (attempt < MAX_MFAPI_RETRIES && isRetryable) {
        await sleep(500 * attempt)
        continue
      }
      break
    }
  }

  try {
    const fund = await MutualFund.findOne({ schemeCode })
    if (fund && fund.historicalNAVs && fund.historicalNAVs.length > 0) {
      return fund.historicalNAVs.slice(-months * 30)
    }
  } catch (dbError) {
    console.error('Error fetching from MongoDB:', dbError.message)
  }

  if (lastError && lastError.response?.status >= 500) {
    console.warn(`⚠️  MFAPI still unavailable for history request: ${schemeCode}`)
  }

  return []
}

/**
 * Search for schemes by name or scheme code
 * Uses database first (faster, reliable), then tries API for fresh data
 * @param {string} query - Search query (scheme name or partial code)
 * @returns {Array} Array of matching funds with live NAV
 */
export const searchSchemes = async (query) => {
  try {
    // First, search the database for fast results
    const dbResults = await MutualFund.find(
      {
        $or: [
          { schemeName: { $regex: query, $options: 'i' } },
          { fundHouse: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { schemeCode: new RegExp(query, 'i') },
        ],
      },
      null,
      { limit: 20 }
    )

    if (dbResults && dbResults.length > 0) {
      // For each result from DB, try to get fresh NAV from API
      const results = []
      for (const fund of dbResults) {
        try {
          const liveNAVData = await getLatestNAV(fund.schemeCode)
          results.push({
            schemeCode: fund.schemeCode,
            schemeName: fund.schemeName,
            fundHouse: fund.fundHouse || liveNAVData?.fundHouse || 'N/A',
            category: fund.category || 'General',
            nav: liveNAVData?.nav || fund.currentNAV || 0,
            navDate: liveNAVData?.date,
          })
        } catch (navError) {
          // Use DB nav if API fails
          results.push({
            schemeCode: fund.schemeCode,
            schemeName: fund.schemeName,
            fundHouse: fund.fundHouse || 'N/A',
            category: fund.category || 'General',
            nav: fund.currentNAV || 0,
          })
        }
      }
      return results
    }

    console.log(`ℹ️  No results in DB for: ${query}, trying API`)
    
    // Fallback to API search if nothing in DB
    try {
      const response = await axios.get(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`, {
        timeout: 15000,
      })
      
      if (!response.data || response.data.length === 0) {
        return []
      }

      // Map API response and fetch live NAV for each
      const results = []
      for (const fund of response.data.slice(0, 20)) {
        const schemeCode = fund.schemeCode?.toString() || fund.code?.toString() || 'N/A'
        
        try {
          const liveNAVData = await getLatestNAV(schemeCode)
          
          results.push({
            schemeCode,
            schemeName: fund.schemeName || fund.scheme_name || 'Unknown',
            fundHouse: liveNAVData?.fundHouse || fund.fundHouse || fund.fund_house || 'N/A',
            category: fund.category || 'General',
            nav: liveNAVData?.nav || parseFloat(fund.nav) || 0,
            navDate: liveNAVData?.date,
          })
        } catch (navError) {
          results.push({
            schemeCode,
            schemeName: fund.schemeName || fund.scheme_name || 'Unknown',
            fundHouse: fund.fundHouse || fund.fund_house || 'N/A',
            category: fund.category || 'General',
            nav: parseFloat(fund.nav) || 0,
          })
        }
      }
      return results
    } catch (apiError) {
      console.warn(`⚠️  API search also failed:`, apiError.message)
      return []
    }
  } catch (error) {
    console.error('Error searching:', error.message)
    return []
  }
}

/**
 * Search schemes from MongoDB database
 * @param {string} query - Search query
 * @returns {Array} Array of matching funds from database
 */
const searchSchemesFromDB = async (query) => {
  try {
    const dbResults = await MutualFund.find(
      {
        $or: [
          { schemeName: { $regex: query, $options: 'i' } },
          { fundHouse: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { schemeCode: { $regex: query, $options: 'i' } },
        ],
      },
      null,
      { limit: 20 }
    )

    return dbResults.map((fund) => ({
      schemeCode: fund.schemeCode,
      schemeName: fund.schemeName,
      fundHouse: fund.fundHouse,
      category: fund.category,
      nav: fund.currentNAV,
    }))
  } catch (error) {
    console.error('Error searching database:', error.message)
    return []
  }
}

export default {
  getLatestNAV,
  getSchemeHistory,
  searchSchemes,
}
