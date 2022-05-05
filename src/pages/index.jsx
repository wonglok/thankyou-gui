// import dynamic from 'next/dynamic'
// Step 5 - delete Instructions components
// import Instructions from '@/components/dom/Instructions'
import { Suspense } from 'react'
import { GlassWindow } from '@/components/canvas/GlassWindow/GlassWindow'
import { Env } from '@/components/canvas/Env/Env'
import { UIContent } from '@/components/canvas/UIContent/UIContent'

const Page = () => {
  return (
    <>
      <Suspense
        fallback={
          <group>
            {/*  */}
            {/*  */}
            <UIContent>
              <div className='absolute top-0 left-0 px-12 py-2 bg-white'>
                Loading....
              </div>
            </UIContent>
          </group>
        }
      >
        <Env></Env>
        <group position={[0, 0, 0]}>
          <GlassWindow />
        </group>
        {/*  */}
        <UIContent>
          <div className='absolute top-0 left-0 px-12 py-2 bg-white'>aaaaa</div>
        </UIContent>
      </Suspense>
    </>
  )
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Haha | Issac | the one who laughs',
    },
  }
}
