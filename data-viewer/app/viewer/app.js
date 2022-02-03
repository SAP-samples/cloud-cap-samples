/* global Vue axios */ //> from vue.html
const GET = (url) => axios.get('/-data'+url)
const storageGet = (key, def) => localStorage.getItem('data-viewer:'+key) || def
const storageSet = (key, val) => localStorage.setItem('data-viewer:'+key, val)
const columnKeysFirst = (c1, c2) => {
  if (c1.isKey  && !c2.isKey) return -1
  if (!c1.isKey && c2.isKey) return 1
  if (c1.isKey && c2.isKey) return c1.name.localeCompare(c2.name)
  return 0 // retain natural order of normal columns
}

const vue = new Vue ({

  el:'#app',

  data: {
    error: undefined,
    dataSource: storageGet('data-source', 'db'),
    skip: storageGet('skip', 0),
    top: storageGet('top', 20),
    entity: storageGet('entity') ? JSON.parse(storageGet('entity')) : undefined,
    entities: [],
    columns: [],
    data: [],
    rowDetails: {},
    rowKey: storageGet('rowKey')
  },

  watch: {
    dataSource: (v) => { storageSet('data-source', v);  vue.fetchEntities() },
    skip: (v) => { storageSet('skip', v); if (vue.entity)  vue.fetchData() },
    top:  (v) => { storageSet('top',  v); if (vue.entity)  vue.fetchData() },
  },

  methods: {

    async fetchEntities () {
      let url = `/Entities`
      if (vue.dataSource === 'db')  url += `?dataSource=db`
      const {data} = await GET(url)
      vue.entities = data.value
      vue.entities.forEach(entity => entity.columns.sort(columnKeysFirst))
      const entity = vue.entity && vue.entities.find(e => e.name === vue.entity.name)
      if (entity) { // restore selection from previous fetch
        vue.columns = entity.columns
        await vue.fetchData(entity)
      } else {
        vue.entity = undefined
        vue.columns = []
        vue.data = []
        vue.rowDetails = {}
      }
    },

    async inspectEntity (eve) {
      const entity = vue.entity = vue.entities [eve.currentTarget.rowIndex-1]
      storageSet('entity', JSON.stringify(entity))
      vue.columns = vue.entities.find(e => e.name === entity.name).columns
      return await this.fetchData()
    },

    async fetchData () {
      let url = `/Data?entity=${vue.entity.name}&$skip=${vue.skip}&$top=${vue.top}`
      if (vue.dataSource === 'db')  url += `&dataSource=db`

      try {
        const {data} = await GET(url)
        // sort data along column order
        const columnIndexes = {}
        vue.columns.forEach((col, i) => columnIndexes[col.name] = i)
        vue.data = data.value.map(d => d.record
          .sort((r1, r2) => columnIndexes[r1.column] - columnIndexes[r2.column])
          .map(r => r.data)
        )
        const row = vue.data.find(data => vue._makeRowKey(data) === vue.rowKey)
        if (row)  vue._setRowDetails(row)
        else vue.rowDetails = {}
        vue.error = undefined
      } catch (err) {
        if (err.response?.data?.error) {
          vue.error = err.response?.data?.error
        } else {
          vue.error = err
        }
        vue.data = []
        vue.rowDetails = {}
      }

    },

    inspectRow (eve) {
      vue.rowDetails = {}
      const selectedRow = eve.currentTarget.rowIndex-1
      vue.rowKey = vue._makeRowKey(vue.data[selectedRow])
      storageSet('rowKey', vue.rowKey)
      vue._setRowDetails(vue.data[selectedRow])
    },

    _setRowDetails(row) {
      vue.rowDetails = {}
      row.forEach((line, colIndex) => {
        vue.rowDetails[vue.columns[colIndex].name] = line
      })
    },

    _makeRowKey(row) {
      // to identify a row, build a key string out of all key columns' values
      return row
        .filter((_, colIndex) => vue.columns[colIndex] && vue.columns[colIndex].isKey)
        .reduce(((prev, next) => prev += next), '')
    },

    isActiveRow(row) {
      return vue._makeRowKey(row) === vue.rowKey
    }

  }
})

vue.fetchEntities()
