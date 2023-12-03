import axios from 'axios'
import type { FeatureCollection } from 'geojson'
import { BD092WGS84, BD09MC2WGS84 } from '~/utils/coordinate'

// prepare a template for geojson
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
  // parse uid, lng, lat from query
  const { uid, lng, lat } = getQuery(event)

  // tried to get aoi info from baidu map api
  const url = `https://map.baidu.com/?newmap=1&qt=ext&uid=${uid}&ext_ver=new&ie=utf-8&l=11`
  const { data } = await axios.get(url)
  // got bd09 coordinate, transform it to wgs84(written in utils)
  const transformedLocation = BD092WGS84(lng as number, lat as number)
  if (!transformedLocation) {
    console.error('transformed location from bd092 to wgs84 error')
    return
  }

  // fill the template with data, and override incoming info
  const geojson: FeatureCollection = geojsonTemplate
  geojson.features[0].properties!.uid = uid

  // all the points in 'Polygon'
  const transformedPoints: number[][] = []
  // if there is an aoi
  if (data.content && data.content.geo) {
    // parse points from data
    const points = (data.content.geo as string).split('|')[2].split(',')
    for (let i = 0; i * 2 <= points.length; i++) {
      if (i === 0)
        points[i * 2] = points[i * 2].slice(2)
      else if (((i + 1) * 2) === points.length)
        points[i * 2 + 1] = points[i * 2 + 1].slice(0, -1)
      if (!points[i * 2] || !points[i * 2 + 1])
        continue
      // bd09 mc to wgs84(utils)
      const final = BD09MC2WGS84(Number.parseFloat(points[i * 2]), Number.parseFloat(points[i * 2 + 1]))
      if (final)
        transformedPoints.push(final)
    }
    geojson.features[0].geometry.type = 'Polygon'
    // @ts-expect-error coordinates
    geojson.features[0].geometry.coordinates = [transformedPoints]
  }
  // else as a point
  else {
    geojson.features[0].geometry.type = 'Point'
    // @ts-expect-error coordinates
    geojson.features[0].geometry.coordinates = transformedLocation
  }
  return geojson
})
