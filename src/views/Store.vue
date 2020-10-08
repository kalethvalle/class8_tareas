<template>
  <v-container :fluid="true">
    <v-row class="d-flex flex-wrap">
        <v-col cols="3" md="3">
            <v-card >
            <v-card-text>
                <div>aprendiendo a usar modulos Store</div>
                <p class="display-1 text--primary">{{ contadores }}</p>

                <div class="text--primary">
                <ul>
                    <li v-for="(item, index) in tareasState" :key="index">{{ item }}</li>
                </ul>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn text :color="loading.color" @click="aumentarContador(1)">add +</v-btn>
            </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="3" md="3">
            <h1>pagination query</h1>
            <router-link :to="{query: {pagina: item}}" v-for="(item, index) in paginas" :key="index">
                <v-btn block color="indigo" dark class="mb-4">
                    {{ item }}
                </v-btn>
            </router-link>
        </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
    data() {
        return {
            paginas: [1,2,3,4,5]
        }
    },
  computed: {
    ...mapState("tareas", ["tareasState"]),
    ...mapState("contador", ["contadores"]),
    ...mapState(["loading"])
  },
  methods: {
    ...mapMutations("contador", ["aumentarContador"])
  },
  watch: {
      "$route.query.pagina":{
          immediate: true,
          handler(seccion){
              console.log(`Seccion a cambiado: ${seccion}`);
          }
      }
  },
};
</script>