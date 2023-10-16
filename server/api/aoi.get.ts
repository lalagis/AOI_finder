import axios from 'axios'
import type { FeatureCollection } from 'geojson'
import { BD092WGS84, BD09MC2WGS84 } from '~/utils/coordinate'

const geojsonTemplate: FeatureCollection = {
  type: 'FeatureCollection',
  // @ts-expect-error with name props
  name: 'aoi',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:EPSG::4326',
    },
  },
  features: [{
    type: 'Feature',
    properties: {
      uid: '',
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[]],
    },
  }],
}

export default defineEventHandler(async (event) => {
  const { uid, lng, lat } = getQuery(event)

  const url = `https://map.baidu.com/?newmap=1&qt=ext&uid=${uid}&ext_ver=new&ie=utf-8&l=11`
  const { data } = await axios.get(url)
  const transformedLocation = BD092WGS84(lng as number, lat as number)
  if (!transformedLocation) {
    console.error('transformed location from bd092 to wgs84 error')
    return
  }
  const geojson: FeatureCollection = geojsonTemplate
  geojson.features[0].properties!.uid = uid

  const transformedPoints: number[][] = []
  if (data.content && data.content.geo) {
    const points = (data.content.geo as string).split('|')[2].split(',')
    for (let i = 0; i * 2 <= points.length; i++) {
      if (i === 0)
        points[i * 2] = points[i * 2].slice(2)
      else if (((i + 1) * 2) === points.length)
        points[i * 2 + 1] = points[i * 2 + 1].slice(0, -1)
      if (!points[i * 2] || !points[i * 2 + 1])
        continue
      const final = BD09MC2WGS84(Number.parseFloat(points[i * 2]), Number.parseFloat(points[i * 2 + 1]))
      if (final)
        transformedPoints.push(final)
    }
    geojson.features[0].geometry.type = 'Polygon'
    // @ts-expect-error coordinates
    geojson.features[0].geometry.coordinates = [transformedPoints]
  }
  else {
    geojson.features[0].geometry.type = 'Point'
    // @ts-expect-error coordinates
    geojson.features[0].geometry.coordinates = transformedLocation
  }
  return geojson
})
