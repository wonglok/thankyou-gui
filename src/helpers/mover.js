import { Matrix4 } from 'three'
import { Mesh } from 'three'
import { MeshStandardMaterial } from 'three'
import { Line3 } from 'three'
import { Box3 } from 'three'
import { Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three-stdlib'

export function Mover() {
  return <group></group>
}

class MainPlayer {
  constructor() {
    let playerIsOnGround = false
    let fwdPressed = false,
      bkdPressed = false,
      lftPressed = false,
      rgtPressed = false
    let playerVelocity = new Vector3()
    let upVector = new Vector3(0, 1, 0)
    let tempVector = new Vector3()
    let tempVector2 = new Vector3()
    let tempBox = new Box3()
    let tempMat = new Matrix4()
    let tempSegment = new Line3()

    // character
    let player = new Mesh(
      new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5),
      new MeshStandardMaterial()
    )
    player.geometry.translate(0, -0.5, 0)
    player.capsuleInfo = {
      radius: 0.5,
      segment: new Line3(new Vector3(), new Vector3(0, -1.0, 0.0)),
    }
    player.castShadow = true
    player.receiveShadow = true
    player.material.shadowSide = 2

    this.updatePlayer = function updatePlayer(delta, collider) {
      playerVelocity.y += playerIsOnGround ? 0 : delta * params.gravity
      player.position.addScaledVector(playerVelocity, delta)

      // move the player
      const angle = controls.getAzimuthalAngle()
      if (fwdPressed) {
        tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle)
        player.position.addScaledVector(tempVector, params.playerSpeed * delta)
      }

      if (bkdPressed) {
        tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle)
        player.position.addScaledVector(tempVector, params.playerSpeed * delta)
      }

      if (lftPressed) {
        tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle)
        player.position.addScaledVector(tempVector, params.playerSpeed * delta)
      }

      if (rgtPressed) {
        tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle)
        player.position.addScaledVector(tempVector, params.playerSpeed * delta)
      }

      player.updateMatrixWorld()

      // adjust player position based on collisions
      const capsuleInfo = player.capsuleInfo
      tempBox.makeEmpty()
      tempMat.copy(collider.matrixWorld).invert()
      tempSegment.copy(capsuleInfo.segment)

      // get the position of the capsule in the local space of the collider
      tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)
      tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat)

      // get the axis aligned bounding box of the capsule
      tempBox.expandByPoint(tempSegment.start)
      tempBox.expandByPoint(tempSegment.end)

      tempBox.min.addScalar(-capsuleInfo.radius)
      tempBox.max.addScalar(capsuleInfo.radius)

      collider.geometry.boundsTree.shapecast({
        intersectsBounds: (box) => box.intersectsBox(tempBox),

        intersectsTriangle: (tri) => {
          // check if the triangle is intersecting the capsule and adjust the
          // capsule position if it is.
          const triPoint = tempVector
          const capsulePoint = tempVector2

          const distance = tri.closestPointToSegment(
            tempSegment,
            triPoint,
            capsulePoint
          )
          if (distance < capsuleInfo.radius) {
            const depth = capsuleInfo.radius - distance
            const direction = capsulePoint.sub(triPoint).normalize()

            tempSegment.start.addScaledVector(direction, depth)
            tempSegment.end.addScaledVector(direction, depth)
          }
        },
      })

      // get the adjusted position of the capsule collider in world space after checking
      // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
      // the origin of the player model.
      const newPosition = tempVector
      newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld)

      // check how much the collider was moved
      const deltaVector = tempVector2
      deltaVector.subVectors(newPosition, player.position)

      // if the player was primarily adjusted vertically we assume it's on something we should consider ground
      playerIsOnGround =
        deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25)

      const offset = Math.max(0.0, deltaVector.length() - 1e-5)
      deltaVector.normalize().multiplyScalar(offset)

      // adjust the player model
      player.position.add(deltaVector)

      if (!playerIsOnGround) {
        deltaVector.normalize()
        playerVelocity.addScaledVector(
          deltaVector,
          -deltaVector.dot(playerVelocity)
        )
      } else {
        playerVelocity.set(0, 0, 0)
      }

      // adjust the camera
      camera.position.sub(controls.target)
      controls.target.copy(player.position)
      camera.position.add(player.position)

      // if the player has fallen too far below the level reset their position to the start
      if (player.position.y < -25) {
        reset()
      }
    }
  }
}
