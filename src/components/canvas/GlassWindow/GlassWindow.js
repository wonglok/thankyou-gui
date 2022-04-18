import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

useGLTF.preload(`/scene/2022-04-18-glasswindow/glassrow.glb`)

export function GlassWindow(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF(
    `/scene/2022-04-18-glasswindow/glassrow.glb`
  )
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    names.forEach((n) => {
      actions[n]?.play()
    })
  }, [])
  return (
    <group ref={group} {...props} dispose={null}>
      <group name='Scene'>
        <group name='glass-windowglb'>
          <mesh
            name='inner_ring'
            geometry={nodes.inner_ring.geometry}
            material={nodes.inner_ring.material}
            position={[0, 4.44, -0.11]}
            rotation={[-Math.PI / 2, 0, -Math.PI]}
            scale={[1.23, 1.23, 1.23]}
            userData={{ enableBloom: true }}
          >
            <mesh
              name='ring'
              geometry={nodes.ring.geometry}
              material={nodes.ring.material}
              position={[0, 0.17, 0]}
              rotation={[Math.PI, 1.38, 0]}
              userData={{ enableBloom: true }}
            />
            <mesh
              name='ring001'
              geometry={nodes.ring001.geometry}
              material={nodes.ring001.material}
              position={[0, 0.17, 0]}
              rotation={[-Math.PI, -0.86, 0]}
              scale={[1.91, 1.91, 1.91]}
              userData={{ enableBloom: true }}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}
