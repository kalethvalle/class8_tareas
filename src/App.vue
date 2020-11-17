<template>
  <!-- 
  *** crear proyecto con vuetify https://vuetifyjs.com/en/getting-started/quick-start/
  *** como usar las rutas con vuex https://vuex.vuejs.org/guide/modules.html
  *** como hacer calendario con vuetify - firebase https://bluuweb.github.io/
  *** database en firebase https://console.firebase.google.com/u/0/
  *** iconos con mdi https://cdn.materialdesignicons.com/5.0.45/
 -->
  <v-app>
    <v-app-bar
      app
      clipped-right
      flat
      prominent
      color="accent"
      dark
      src="./assets/fondo.jpg"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Proyecto Vue</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @dblclick="show = !show">
        <v-icon>{{ show ? "mdi-heart-outline" : "mdi-heart" }}</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <v-dialog v-model="loading.estado" hide-overlay persistent width="300">
        <v-card :color="loading.color" dark>
          <v-card-text>
            {{ loading.titulo }}
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <router-view id="first" />
    </v-content>

    <v-navigation-drawer v-model="drawer" app>
      <!-- <v-avatar
        class="d-block text-center mx-auto mt-4"
        color="grey darken-1"
        size="50"
      >
        <v-icon dark> mdi-account </v-icon>
      </v-avatar> -->

      <v-sheet color="grey lighten-5" height="50" width="100%"></v-sheet>
      <v-divider class="mx-1 my-3"></v-divider>
      <v-list shaped>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="{ name: item.path }"
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-footer app color="transparent" inset class="pa-6">
      <v-fab-transition>
        <v-btn
          color="pink"
          fab
          dark
          mediums
          absolute
          top
          right
          @click="$vuetify.goTo(target)"
        >
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
      </v-fab-transition>
      <!-- <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} &copy; <strong>Proyecto Vue</strong>
      </v-col> -->
    </v-footer>
  </v-app>
</template>

<script>
import * as easings from "vuetify/es5/services/goto/easing-patterns";
import { mapState } from "vuex";
export default {
  name: "App",
  components: {},
  data: () => ({
    type: "selector",
    selector: "#first",
    show: true,
    drawer: null,
    items: [
      { path: "Home", title: "Valor Dolar Peso Chileno", icon: "mdi-home" },
      { path: "About", title: "Animes TBT", icon: "mdi-jellyfish" },
      {
        path: "Tareas",
        title: "Organiza mis Tareas",
        icon: "mdi-format-list-checks",
      },
      {
        path: "Ncalendario",
        title: "Calendario Recordatorio",
        icon: "mdi-calendar",
      },
      {
        path: "Store",
        title: "Maneja mis Variables Vuex",
        icon: "mdi-vuetify",
      },
      // { path: "Library", title: "New Site", icon: "mdi-book" }
    ],
  }),
  computed: {
    ...mapState(["loading"]),
    target() {
      const value = this["selector"];
      if (!isNaN(value)) return Number(value);
      else return value;
    },
  },
};
</script>
