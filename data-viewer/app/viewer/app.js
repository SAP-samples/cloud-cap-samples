/* global Vue axios */ //> from vue.html
const GET = (url) => axios.get('/-data'+url)
const storageGet = (key, def) => localStorage.getItem('data-viewer:'+key) || def
const storageSet = (key, val) => localStorage.setItem('data-viewer:'+key, val)

const viewer = new Vue ({

    el:'#app',

    data: {
        dataSource: storageGet('data-source', 'db'),
        skip: storageGet('skip', 0),
        top: storageGet('top', 20),
        entity: storageGet('entity') ? JSON.parse(storageGet('entity')) : undefined,
        entities: [],
        columns: [],
        data: [],
        rowDetails: undefined,
    },

    watch: {
        dataSource: (v) => { storageSet('data-source', v);    viewer.fetchEntities() },
        skip: (v) => { storageSet('skip', v); if (viewer.entity)  viewer.fetchData() },
        top:  (v) => { storageSet('top',  v); if (viewer.entity)  viewer.fetchData() },
    },

    methods: {

        async fetchEntities () {
            let url = `/Entities`
            if (viewer.dataSource === 'db')  url += `?dataSource=db`
            const {data} = await GET(url)
            viewer.entities = data.value
            const entity = viewer.entity && viewer.entities.find(e => e.name === viewer.entity.name)
            if (entity) { // restore selection from previous fetch
                viewer.columns = entity.columns
                await viewer.fetchData(entity)
            } else {
                viewer.entity = undefined
                viewer.columns = []
                viewer.data = []
                viewer.rowDetails = {}
            }
        },

        async inspectEntity (eve) {
            const entity = viewer.entity = viewer.entities [eve.currentTarget.rowIndex-1]
            storageSet('entity', JSON.stringify(entity))
            viewer.columns = viewer.entities.find(e => e.name === entity.name).columns
            return await this.fetchData()
        },

        async fetchData () {
            let url = `/Data?entity=${viewer.entity.name}&$skip=${viewer.skip}&$top=${viewer.top}`
            if (viewer.dataSource === 'db')  url += `&dataSource=db`
            const {data} = await GET(url)
            viewer.data = data.value.map(d => d.record.map(r => r.data))
            viewer.rowDetails = undefined
        },

        inspectRow (eve) {
            viewer.rowDetails = {}
            const selectedRow = eve.currentTarget.rowIndex-1
            viewer.data[selectedRow].forEach((line, colIndex) => {
                viewer.rowDetails[viewer.columns[colIndex].name] = line
            })
        },

    }
})

viewer.fetchEntities()
