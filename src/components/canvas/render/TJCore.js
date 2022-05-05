import md5 from 'md5'
import { useEffect, useMemo, useState } from 'react'

class TJCore {
  constructor({ parent = false, name = 'ThankyouJesusCore', global = {} }) {
    let self = this

    let core = this
    this.isAborted = false
    this.isPaused = false
    this.id = md5(Math.random())

    console.log('core init: ', name)

    // console.trace(name);

    this.reactTo = (key) => {
      let [st, setSt] = useState(0)
      useEffect(() => {
        let noGo = false
        core.onChange(key, () => {
          if (noGo) {
            return
          }
          setSt((st) => {
            return st + 1
          })
        })

        return () => {
          //
          noGo = true
        }
      }, [])
    }

    if (typeof window !== 'undefined') {
      global = window
    } else {
      global.document = {
        addEventListener: () => {},
      }
      global.addEventListener = () => {}
      global.removeEventListener = () => {}
      global.dispatchEvent = () => {}
      global.performance = { now: () => {} }
      global.requestAnimationFrame = () => {}
      global.CustomEvent = class CustomEventClass {}
    }

    this.react = new Proxy(this, {
      get: (obj, key) => {
        return self.reactTo(key)
      },
    })

    //

    //
    this.makeKeyReactive = this.reactTo
    this.parent = parent
    this.name = name
    this.resource = new Map()

    this.remove = (k) => {
      this.resource.delete(k)
    }
    this.get = (k) => {
      return new Promise((resolve) => {
        let ttt = 0
        ttt = setInterval(() => {
          if (this.parent) {
            if (this.resource.has(k) || this.parent.resource.has(k)) {
              clearInterval(ttt)
              resolve(this.resource.get(k) || this.parent.resource.get(k))
            }
          } else {
            if (this.resource.has(k)) {
              clearInterval(ttt)
              resolve(this.resource.get(k))
            }
          }
        })
      })
    }
    let NS = `_${Math.random()}`
    this.set = (k, v) => {
      this.resource.set(k, v)
      global.dispatchEvent(new global.CustomEvent(k + NS, { detail: v }))
    }

    let defaultChange = { initFire: false }
    this.onChange = (key, fnc, { initFire = false } = defaultChange) => {
      let hh = ({ detail }) => {
        fnc(detail)
      }
      global.addEventListener(key + NS, hh)

      if (initFire === true) {
        this.get(key).then((v) => {
          fnc(v)
        })
      }

      this.onClean(() => {
        global.removeEventListener(key + NS, hh)
      })
    }

    this.tasks = []
    this.resizeTasks = []
    this.cleanTasks = []
    this.onLoop = (fnc, num = 0) => {
      if (num >= 0) {
        this.tasks.push(fnc)
        // this.tasks.sort((a, b) => {
        //   if (a.num > b.num) {
        //     return -1;
        //   } else if (a.num < b.num) {
        //     return 1;
        //   } else {
        //     return 0;
        //   }
        // });

        //
      } else {
        this.tasks.unshift(fnc)
      }
    }

    this.onResize = (fnc) => {
      fnc()
      this.resizeTasks.push(fnc)
    }

    this.onClean = (func) => {
      this.cleanTasks.push(func)
    }

    let intv = 0
    const internalResize = async () => {
      for (let t of this.resizeTasks) {
        await t()
      }

      // clearTimeout(intv);
      // intv = setTimeout(async () => {
      //   for (let t of this.resizeTasks) {
      //     await t();
      //   }
      // }, 16.8888);
    }

    let hresize = () => {
      internalResize()
    }
    global.addEventListener('resize', hresize)
    this.onClean(() => {
      global.removeEventListener('resize', hresize)
    })

    this.title = ''
    this.toggle = () => {
      this.isPaused = !this.isPaused
      console.log(this.title, 'status ::', !this.isPaused ? 'run' : 'pause')
    }
    this.pause = () => {
      this.isPaused = true
      console.log(this.title, 'status ::', !this.isPaused ? 'run' : 'pause')
    }
    this.play = () => {
      this.isPaused = false
      console.log(this.title, 'status ::', !this.isPaused ? 'run' : 'pause')
    }

    this.clean = () => {
      console.log('clean core:', name)
      this.isAborted = true
      this.isPaused = true
      try {
        this.cleanTasks.forEach((e) => e())
      } catch (e) {
        console.error(e)
      }
    }

    this.lastTime = global.performance.now()
    this.work = () => {
      this.timeNow = global.performance.now()
      if (this.isAborted) {
        return {
          name: this.name,
          duration: 0,
        }
      }
      if (this.isPaused) {
        return {
          name: this.name,
          duration: 0,
        }
      }
      const start = global.performance.now()
      try {
        let t = this.timeNow
        const lt = this.lastTime
        let dt = t - lt
        this.lastTime = t
        dt = dt / 1000
        t = t / 1000
        //
        if (dt >= 0.1) {
          dt = 0.1
        }

        this.tasks.forEach((e) => e(dt, dt))
      } catch (e) {
        console.error(e)
      }
      const end = global.performance.now()
      const duration = end - start

      return {
        name: this.name,
        duration,
      }
    }

    this.ready = new Proxy(
      {},
      {
        get: (obj, key) => {
          return this.get(key)
        },
      }
    )

    this.now = new Proxy(
      {},
      {
        get: (obj, key) => {
          if (this.parent) {
            return this.resource.get(key) || this.parent.resource.get(key)
          } else {
            return this.resource.get(key)
          }
        },
        set: (o, key, value) => {
          this.set(key, value)
          return true
        },
      }
    )

    if (parent) {
      // parent.onLoop(() => {
      //   this.work();
      // });
      parent.onClean(() => {
        this.clean()
      })
    }

    // console.log(
    //   "make core:",
    //   JSON.stringify({
    //     name: this.name,
    //     parent: this.parent.name,
    //   })
    // );

    this.autoEvent = (eventName, fnc, dom = global, config) => {
      //
      dom.addEventListener(eventName, fnc, config)
      this.onClean(() => {
        dom.removeEventListener(eventName, fnc)
      })
    }

    this.makeNode = ({ name = 'node' }) => {
      // subname
      let subname = name
      let parentName = self.name
      return new TJCore({
        parent: self,
        name: `${parentName}-${subname}`,
      })
    }

    this.scope = (fnc) => {
      let sub = useMemo(() => {
        let sub = new TJCore({
          parent: self,
          name: 'sub-node',
        })

        return sub
      }, [])

      useEffect(() => {
        fnc(sub)
        return () => {
          sub.clean()
        }
      }, [sub])

      return sub
    }

    this.name = (name) => (v) => {
      this.now[name] = v
    }

    // this.syncGL = () => {
    //   useFrame((prop) => {
    //     for (let kn in prop) {
    //       this.resource.set(kn, prop[kn]);
    //     }
    //   });
    // };
    //
  }
}

export { TJCore }
