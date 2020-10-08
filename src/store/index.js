import Vue from 'vue'
import Vuex from 'vuex'

// importar modulos externos que son variables globales
import tareas from '../modulos/tareas'
import contador from '../modulos/contador'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading:{
      titulo:'',
      estado: false,
      color: 'primary'
    },
  },
  mutations: {
    mostrarLoading(state, payload){
      state.loading.titulo = payload.titulo
      state.loading.color  = payload.color
      state.loading.estado = true
    },
    ocultarLoading(state){
      state.loading.estado = false
    }
  },
  actions: {
  },
  modules: {
    tareas, contador
  }
})
