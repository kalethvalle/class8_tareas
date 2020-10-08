export default {
    namespaced: true,
    state: {
        contadores: 1
    },
    mutations: {
        aumentarContador(state, payload){
            state.contadores += payload;
        }
    },
    actions: {

    },
    getters: {

    }
}