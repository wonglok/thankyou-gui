import { Env } from '@/components/canvas/Env/Env'
import { GlassWindow } from '@/components/canvas/GlassWindow/GlassWindow'
import { UIContent } from '@/components/canvas/UIContent/UIContent'
import { Suspense } from 'react'
import { uuid } from 'short-uuid'

export default function Page() {
  return (
    <>
      <Suspense
        fallback={
          <group>
            <UIContent>
              <div className='absolute top-0 left-0 px-12 py-2 bg-white'>
                Loading....
              </div>
            </UIContent>
          </group>
        }
      >
        <Env url={`/hdr/greenwich_park_02_1k.hdr`}></Env>
        <group position={[0, 0, 0]}>
          <GlassWindow />
        </group>

        <UIContent>
          <div
            className='absolute bg-white bg-opacity-80'
            style={{
              width: '320px',
              height: '320px',
              top: 'calc(50% - 320px / 2)',
              left: 'calc(50% - 320px / 2)',
            }}
          >
            <div className='w-full h-full p-3'>
              <div className='p-3 text-2xl'>1</div>
            </div>
          </div>
        </UIContent>
      </Suspense>
    </>
  )
}
