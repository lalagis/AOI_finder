// https://lbsyun.baidu.com/faq/api?title=webapi/place-suggestion-api
import { useConfigStore } from '~/stores/config'

export async function getSuggestions(query: string, region: string) {
  const { appKey } = $(useConfigStore())

  const baseUrl = `https://api.map.baidu.com/place/v2/suggestion?query=${query}&region=${region}&city_limit=true&output=json&ak=${appKey}`
  const { data } = $(await useFetch(baseUrl, {
    method: 'get',
  }))
  const result = JSON.parse(data as string)
  if (result.status !== 0)
    throw new Error(result.message)

  return result.result
}
