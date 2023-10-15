// conversion structure
//
// BD09LL --- GCJ-02 ----------------- WGS84
//   			      |						             |
//		(BaiduMercartorConvert)	 (WebMercartorConvert)
//   			      |						             |
//			      BD09MC					       WebMercator
//

// constants
const a = 6378245.0
const ee = 6.693421622965943e-3
const xPI = Math.PI * 3000.0 / 180.0
const mcBand = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0]
const mc2ll = [
  [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2],
  [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86],
  [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37],
  [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06],
  [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4],
  [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5],
]

export function BD09MC2GCJ02(mercatorX: number, mercatorY: number) {
  mercatorX = Math.abs(mercatorX)
  mercatorY = Math.abs(mercatorY)
  let f: number[] = []
  for (let i = 0; i < mcBand.length; i++) {
    if (mercatorY >= mcBand[i]) {
      f = mc2ll[i]
      break
    }
  }
  if (!f.length) {
    for (let i = mcBand.length - 1; i >= 0; i--) {
      if (mercatorY <= -mcBand[i]) {
        f = mc2ll[i]
        break
      }
    }
  }
  return convertor(mercatorX, mercatorY, f)
}

function convertor(lng: number, lat: number, f: number[]) {
  if (!f) {
    console.error('Invalid lnglat')
    return []
  }
  let tlng = f[0] + f[1] * Math.abs(lng)
  const cc = Math.abs(lat) / f[9]
  let tlat: number = 0
  for (let i = 2; i < 8; i++)
    tlat += (f[i] * cc ** (i - 2))

  tlng *= (lng < 0 ? -1 : 1)
  tlat *= (lat < 0 ? -1 : 1)
  return [tlng, tlat]
}

function isInvalid(lng?: number, lat?: number) {
  return (!lng || !lat) || !(lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90)
}

export function GCJ022BD09(lng: number, lat: number) {
  if (isInvalid(lng, lat)) {
    console.error('Invalid lnglat')
    return
  }
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPI)
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPI)
  return [z * Math.cos(theta) + 0.0065, z * Math.sin(theta) + 0.006]
}

export function GCJ022WGS84(lng: number, lat: number) {
  if (isInvalid(lng, lat)) {
    console.error('Invalid lnglat')
    return
  }
  if (!(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)) {
    console.error('Outof China', lng, lat)
    return
  }

  let dlat = transLat(lng - 105.0, lat - 35.0)
  let dlng = transLng(lng - 105.0, lat - 35.0)
  const radlat = lat / 180.0 * Math.PI
  let magic = Math.sin(radlat)
  magic = 1 - ee * magic * magic
  const sqrtmagic = Math.sqrt(magic)
  dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * Math.PI)
  dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * Math.PI)
  const mglat = lat + dlat
  const mglng = lng + dlng
  return [lng * 2 - mglng, lat * 2 - mglat]
}

function transLat(lng: number, lat: number) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0
  return ret
}

function transLng(lng: number, lat: number) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
  ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0
  return ret
}

export function BD09MC2WGS84(mercatorX: number, mercatorY: number) {
  const [lng, lat] = BD09MC2GCJ02(mercatorX, mercatorY)
  return GCJ022WGS84(lng, lat)
}

export function BD092GCJ02(lng: number, lat: number) {
  if (isInvalid(lng, lat)) {
    console.error('Invalid lnglat')
    return []
  }
  const x = lng - 0.0065
  const y = lat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPI)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPI)
  return [z * Math.cos(theta), z * Math.sin(theta)]
}

export function BD092WGS84(lng: number, lat: number) {
  const [lng2, lat2] = BD092GCJ02(lng, lat)
  return GCJ022WGS84(lng2, lat2)
}
