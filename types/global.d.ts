// POI type
interface POI {
  adcode: string
  address: string
  business: string
  children: POI[]
  city: string
  cityid: string
  district: string
  location: { lat: number, lng: number }
  name: string
  province: string
  tag: string
  uid: string
}
