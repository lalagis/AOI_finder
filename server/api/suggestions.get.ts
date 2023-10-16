// https://lbsyun.baidu.com/faq/api?title=webapi/place-suggestion-api
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const { region, query, appKey } = getQuery(event)

  const baseUrl = `https://api.map.baidu.com/place/v2/suggestion?query=${query}&region=${region}&city_limit=true&output=json&ak=${appKey}`
  const { data } = await axios.get(baseUrl)
  if (data.status !== 0)
    throw new Error(data.message)

  return data.result
})
