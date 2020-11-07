<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-date-picker
            v-model="fecha"
            full-width
            locale="es-co"
            :min="minimo"
            :max="maximo"
            @change="getDolar(fecha)"
          ></v-date-picker>
        </v-card>

        <v-card color="#1F7087" dark>
          <v-card-text class="display-1 text-center">{{valor}}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  name: "HelloWorld",
  data() {
    return {
      valor: null,
      fecha: new Date().toISOString().substr(0, 10),
      minimo: "1984",
      maximo: new Date().toISOString().substr(0, 10)
    };
  },
  methods: {
    ...mapMutations(['mostrarLoading', 'ocultarLoading']),
    async getDolar(dia) {
      let dd = dia
        .split(["-"])
        .reverse()
        .join("-");

      try {
        this.mostrarLoading({
          titulo: "Cargando informacion",
          color: "success"
        });

        let datos = await axios.get(`https://mindicador.cl/api/dolar/${dd}`);

        if (datos.data.serie.length > 0) {
          this.valor = `Dolar: $ ${await datos.data.serie[0].valor}`;
        } else {
          this.valor = "Sin resultados";
        }

        // console.log(datos.data);
      } catch (e) {
        console.log(e);
        alert('ocurrio un error')
      } finally {
        this.ocultarLoading();
      }
    }
  },
  created() {
    this.getDolar(this.fecha);
  }
};
</script>
