import { UIContent } from '@/components/canvas/UIContent/UIContent'
import { backendAPI } from '@/vfx/api/aws'

export default function Page() {
  return (
    <>
      <UIContent>
        <div className='absolute top-0 left-0'>
          <div
            className='bg-white'
            onClick={() => {
              //
              backendAPI
                .addGraphNode({
                  graphType: 'Life',
                  title: 'blessed life',
                  text: 'mylife is blessed',
                })
                .then((json) => {
                  console.log(json)
                })
            }}
          >
            add Node
          </div>
          <div
            className='bg-white'
            onClick={() => {
              //
              backendAPI
                .listByGraphType({
                  graphType: 'Life',
                })
                .then((json) => {
                  console.log(json)
                })
            }}
          >
            list graph by type 'graphType'
          </div>
          <div
            className='bg-white'
            onClick={() => {
              //
              backendAPI
                .removeByGraphType({
                  graphType: 'Life',
                })
                .then((json) => {
                  console.log(json)
                })
            }}
          >
            remove graph by type 'graphType'
          </div>
        </div>
      </UIContent>
    </>
  )
}
