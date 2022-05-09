export const BackendSources = {
  laptop: {
    http: `http://localhost:3333`,
    ws: `ws://localhost:3333`,
  },
  production: {
    http: `https://nw14ybygnl.execute-api.ap-southeast-1.amazonaws.com`,
    ws: `wss://v843hmenm8.execute-api.ap-southeast-1.amazonaws.com/production`,
  },
  stage: {
    http: `https://pb0xooiitl.execute-api.ap-southeast-1.amazonaws.com`,
    ws: `wss://v7hdr4vozd.execute-api.ap-southeast-1.amazonaws.com/staging`,
  },
}

export class Backend {
  constructor({ override = false }) {
    let currentSource = BackendSources.laptop
    if (process.env.NODE_ENV === 'development') {
      //
      currentSource = BackendSources.laptop
      //
    }
    if (process.env.NODE_ENV === 'test') {
      //
      currentSource = BackendSources.stage
      //
    }
    if (process.env.NODE_ENV === 'staging') {
      //
      currentSource = BackendSources.stage
      //
    }
    if (process.env.NODE_ENV === 'production') {
      //
      currentSource = BackendSources.production
      //
    }
    this.source = currentSource

    if (override && BackendSources[override]) {
      this.source = BackendSources[override]
    } else if (override && !BackendSources[override]) {
      console.error('override not found', override)
    }
    //
    //
  }

  async addGraphNode({ title = 'newnode', graphType = 'Life', text = '' }) {
    //
    return fetch(`${this.source.http}/add-graph`, {
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        graphType,
        title,
        text,
      }),
    })
      .then(this.processReturn)
      .then((json) => {
        return json
      })
    //
  }

  async listByGraphType({ graphType }) {
    //
    return fetch(`${this.source.http}/list-graph`, {
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        graphType,
      }),
    })
      .then(this.processReturn)
      .then((json) => {
        return json
      })
    //
  }

  async removeByGraphType({ graphType }) {
    //
    return fetch(`${this.source.http}/remove-graph`, {
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({
        graphType,
      }),
    })
      .then(this.processReturn)
      .then((json) => {
        return json
      })
    //
  }

  processReturn(r) {
    if (r.ok) {
      return r.json()
    } else {
      return Promise.reject({
        status: r.status,
        statusText: r.statusText,
      })
    }
  }
}

export const backendAPI = new Backend()
