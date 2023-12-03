// https://lbsyun.baidu.com/faq/api?title=webapi/place-suggestion-api
import axios from 'axios'

export default defineEventHandler(async (event) => {
  // parse region, query, appKey from query
  const { region, query, appKey } = getQuery(event)

  // tried to get suggestions from baidu map api
  const baseUrl = `https://api.map.baidu.com/place/v2/suggestion?query=${query}&region=${region}&city_limit=true&output=json&ak=${appKey}`
  const { data } = await axios.get(baseUrl)
  // any error
  if (data.status !== 0)
    throw new Error(data.message)

  return data.result
})
