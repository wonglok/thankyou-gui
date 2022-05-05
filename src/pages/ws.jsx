import { useEffect, useState } from 'react'

// stage
// HTTP https://6b38bc38za.execute-api.ap-southeast-1.amazonaws.com
// WS wss://v754u5hand.execute-api.ap-southeast-1.amazonaws.com/staging

// prod
// HTTP: https://52jnt5l5ll.execute-api.ap-southeast-1.amazonaws.com
// WS: wss://77btibkhih.execute-api.ap-southeast-1.amazonaws.com/production

export default function Page() {
  return <div>{<WebsocketPage></WebsocketPage>}</div>
}

export function WebsocketPage() {
  useEffect(() => {
    let getURL = ({ ownerID, roomID, channelID }) => {
      let useLocalHostForDevelopment = true
      let urlSearch = new URLSearchParams()
      urlSearch.set('ownerID', ownerID)
      urlSearch.set('roomID', roomID)
      urlSearch.set('channelID', channelID)

      let params = `?${urlSearch.toString()}`

      // return `wss://77btibkhih.execute-api.ap-southeast-1.amazonaws.com/production${params}`

      if (process.env.NODE_ENV === 'development') {
        if (useLocalHostForDevelopment) {
          return `ws://localhost:3333${params}`
        } else {
          return `wss://v754u5hand.execute-api.ap-southeast-1.amazonaws.com/staging${params}`
        }
      } else if (process.env.NODE_ENV === 'preview') {
        return `wss://v754u5hand.execute-api.ap-southeast-1.amazonaws.com/staging${params}`
      } else if (process.env.NODE_ENV === 'production') {
        return `wss://77btibkhih.execute-api.ap-southeast-1.amazonaws.com/production${params}`
      }
    }

    //
    let clientID = Math.random().toString(36).slice(2, 15)
    let ownerID = 'lok_aaa' + clientID
    let roomID = 'roomIDloklokroom'
    let channelID = 'defaultChannel'

    let clean = () => {}

    let url = getURL({ ownerID, channelID, roomID })

    let signal = new SignalClient({ url, debug: false })

    signal.on('walk', (v) => {
      console.log('walk', v)
    })
    signal.on('online', (v) => {
      console.log('online', v)
    })
    clean = () => {
      signal.dispose()
    }

    window.onclick = () => {
      signal.send({
        // connection attribute
        ownerID: ownerID,
        roomID: roomID,
        channelID: 'walk',

        //
        type: 'walk',
        posX: 0 + Math.random(),
        posY: 0,
        posZ: 0,
        avatarMode: 'fight',
        avatarActionName: 'stand',
        avatarURL: '',
      })
    }

    return () => {
      clean()
    }
  }, [])

  return <group>test</group>
}
//

const SCMaps = new Map()
class SignalClient {
  constructor({ url, debug = false }) {
    if (SCMaps.has(url)) {
      return SCMaps.get(url)
    }
    SCMaps.set(url, this)
    this.url = url
    this.debug = debug
    this.autoReconnectInterval = 15 * 1000
    this.eventHandlers = []
    this.open()
  }
  dispose() {
    console.log('dispose-signal')
    this.eventHandlers = []
    this.close()
  }

  get ready() {
    return this.ws.readyState === WebSocket.OPEN
  }

  on(type, fnc) {
    let listenerObj = {
      type,
      fnc,
    }
    let clean = () => {
      let idx = this.eventHandlers.findIndex((h) => h.fnc === listenerObj.fnc)
      this.eventHandlers.splice(idx, 1)
    }
    this.eventHandlers.push(listenerObj)

    return clean
  }

  onDataArrive(data) {
    if (this.onAny) {
      this.onAny(data)
    }
    this.eventHandlers.forEach((handler) => {
      if (data.type === handler.type) {
        handler.fnc(data)
      }
    })
  }

  close() {
    try {
      this.ws.__disposed = true
      this.ws.close()
      console.log('WebSocket: closed')
    } catch (e) {
      console.log(e)
    }
  }

  open() {
    console.log('open-signal')
    this.ws = new WebSocket(this.url)
    this.ws.__disposed = false

    this.ws.addEventListener('open', (e) => {
      if (this.ws.__disposed) {
        return
      }
      console.log('WebSocket: opened')
      // this.joinRoom();
    })

    this.ws.addEventListener('message', (evt) => {
      if (this.ws.__disposed) {
        return
      }

      try {
        let detail = JSON.parse(evt.data)
        console.log('WebSocketDataOnArrival:', detail.type, detail)
        this.onDataArrive(detail)
      } catch (e) {
        console.log(e)
      }
    })

    this.ws.addEventListener('close', (e) => {
      //

      if (this.ws.__disposed) {
        return
      }

      switch (e.code) {
        case 1000: // CLOSE_NORMAL
          console.log('WebSocket: closed')
          break
        default:
          // Abnormal closure
          this.reconnect(e)
          break
      }
      this.onClose(e)
    })

    this.ws.addEventListener('error', (e) => {
      if (this.ws.__disposed) {
        return
      }

      //

      switch (e.code) {
        case 'ECONNREFUSED':
          this.reconnect(e)
          break
        default:
          this.onError(e)
          break
      }
    })
  }

  onClose(e) {
    console.log(e)
  }
  onError(e) {
    console.log(e)
  }

  reconnect(e) {
    if (this.ws) {
      this.ws.__disposed = true
    }
    console.log('WebSocket: retry in ' + this.autoReconnectInterval + 'ms', e)

    setTimeout(() => {
      console.log('WebSocket: reconnecting...')
      this.open()
    }, this.autoReconnectInterval)
  }

  ensureWS(fnc) {
    let tt = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        clearInterval(tt)
        fnc()
      }
    }, 0)
  }

  send(data) {
    this.ensureWS(() => {
      this.ws.send(JSON.stringify(data))
    })
  }
}
