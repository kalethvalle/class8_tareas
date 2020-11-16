<template>
  <v-container fluid>
    <v-row class="d-flex flex-wrap" id="prin">
      <v-col cols="12" md="6" id="compra_venta"> </v-col>
      <v-col cols="12" md="6" id="vlr_dolar">
        <!-- <h3>Valor del Dolar</h3> -->
      </v-col>
      <v-col cols="12" id="materia_prima">
        
      </v-col>
      <v-col cols="12" md="4">
        <h3>aprendiendo a usar modulos Store</h3>
        <v-card>
          <v-card-text>
            <p class="display-1 text--primary">{{ contadores }}</p>

            <div class="text--primary">
              <ul>
                <li v-for="(item, index) in tareasState" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text :color="loading.color" @click="aumentarContador(1)"
              >add +</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <h3>pagination query</h3>
        <router-link
          :to="{ query: { pagina: item } }"
          v-for="(item, index) in paginas"
          :key="index"
        >
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
      paginas: [1, 2, 3, 4, 5],
    };
  },
  computed: {
    ...mapState("tareas", ["tareasState"]),
    ...mapState("contador", ["contadores"]),
    ...mapState(["loading"]),
  },
  mounted() {
    this.creando();
  },
  methods: {
    ...mapMutations("contador", ["aumentarContador"]),
    creando() {
      const vlr_dolar = document.getElementById("vlr_dolar");
      const compra_venta = document.getElementById("compra_venta");
      const materia_prima = document.getElementById("materia_prima");

      const space = document.createElement("br");
      const google = document.createElement("button");

      const div1 = document.createElement("div");
      const srcVlrDolar = document.createElement("script");
      const srcCompraVenta = document.createElement("script");
      const srcMateriaPrima = document.createElement("script");

      google.setAttribute("type", "button");
      google.setAttribute(
        "class",
        "v-btn v-btn--contained theme--light v-size--default indigo white--text mt-5"
      );
      google.textContent = "google";

      //   prin.appendChild(space);
      //   prin.appendChild(google);

      srcVlrDolar.setAttribute(
        "src",
        "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
      );
      srcVlrDolar.async = true;
      srcVlrDolar.textContent = `
        {
            "symbol": "FX_IDC:USDCOP",
            "width": "100%",
            "height": "100%",
            "locale": "es",
            "dateRange": "12M",
            "colorTheme": "light",
            "trendLineColor": "#37a6ef",
            "underLineColor": "#E3F2FD",
            "isTransparent": false,
            "autosize": false,
            "largeChartUrl": ""
        }`;
      div1.setAttribute("class", "tradingview-widget-container");

      div1.appendChild(srcVlrDolar);
      vlr_dolar.appendChild(div1);

      srcCompraVenta.setAttribute(
        "src",
        "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
      );
      srcCompraVenta.async = true;
      srcCompraVenta.textContent = `
        {
            "interval": "1m",
            "width": "100%",
            "height": "450",
            "isTransparent": false,
            "symbol": "FX_IDC:USDCOP",
            "showIntervalTabs": true,
            "locale": "es",
            "colorTheme": "light"
        }`;

      compra_venta.appendChild(srcCompraVenta);

      const divprim = document.createElement("div")
      divprim.setAttribute("class", "d-none d-sm-flex d-md-flex")

      srcMateriaPrima.setAttribute(
        "src",
        "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
      );
      srcMateriaPrima.async = true;
      srcMateriaPrima.textContent = `
        {
            "width": "100%",
            "height": "450",
            "symbolsGroups": [
                {
                "name": "Materias primas",
                "originalName": "Commodities",
                "symbols": [
                    {
                    "name": "CME:6E1!",
                    "displayName": "Euro"
                    },
                    {
                    "name": "COMEX:GC1!",
                    "displayName": "ORO"
                    },
                    {
                    "name": "CBOT:ZC1!",
                    "displayName": "MAIZ"
                    },
                    {
                    "name": "NYMEX:NG1!",
                    "displayName": "Gaz Natural"
                    },
                    {
                    "name": "NYMEX:CL1!",
                    "displayName": "Crudo Oil"
                    },
                    {
                    "name": "NASDAQ:JVA",
                    "displayName": "Café"
                    }
                ]
                }
            ],
            "showSymbolLogo": true,
            "colorTheme": "light",
            "isTransparent": false,
            "locale": "es"
        }`;

        divprim.appendChild(srcMateriaPrima)
        materia_prima.appendChild(divprim);
        console.log(materia_prima); 
    },
  },
  watch: {
    "$route.query.pagina": {
      immediate: true,
      handler(seccion) {
        console.log(`Seccion a cambiado: ${seccion}`);
      },
    },
  },
};
</script>