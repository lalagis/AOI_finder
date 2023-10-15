import type { FeatureCollection } from 'geojson'
import { BD092WGS84, BD09MC2GCJ02, GCJ022WGS84 } from './coordinate'

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
      ID: 0,
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[]],
    },
  }],
}

export async function getAOIFromPOI(poi: POI) {
  if (!poi.location) {
    console.error('POI has no location')
    return
  }

  const uid = poi.uid
  const url = `https://map.baidu.com/?newmap=1&qt=ext&uid=${uid}&ext_ver=new&ie=utf-8&l=11`
  const { data } = $(await useFetch(url, {
    method: 'get',
  }))
  const result = JSON.parse(data as string)

  const location = poi.location
  const transformedLocation = BD092WGS84(location.lng, location.lat)
  if (!transformedLocation) {
    console.error('transformed location from bd092 to wgs84 error')
    return
  }
  const geojson: FeatureCollection = geojsonTemplate

  const transformedPoints: number[][] = []
  if (result.content && result.content.geo) {
    const points = (result.content.geo as string).split('|')[2].split(',')
    for (let i = 0; i * 2 <= points.length; i++) {
      if (i === 0)
        points[i * 2] = points[i * 2].slice(2)
      else if (i + 1 === (points.length / 2))
        points[i * 2 + 1] = points[i * 2 + 1].slice(0, -1)
      const gcj02 = BD09MC2GCJ02(Number.parseFloat(points[i * 2]), Number.parseFloat(points[i * 2 + 1]))
      const wgs84 = GCJ022WGS84(gcj02[0], gcj02[1])
      if (wgs84)
        transformedPoints.push(wgs84)
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
}
