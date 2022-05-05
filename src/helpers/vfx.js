import { TJCore } from '@/components/canvas/render/TJCore'
import { Euler } from 'three'
import { Vector3 } from 'three'

let vfx = new TJCore({ name: 'core' })

vfx.now.myPosition = new Vector3(0, 0, 0)
vfx.now.myGoingTo = new Vector3(0, 0, 0)
vfx.now.rotation = new Euler(0, 0, 0)

export default vfx
