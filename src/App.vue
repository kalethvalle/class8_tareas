<template>
<!-- 
  *** crear proyecto con vuetify https://vuetifyjs.com/en/getting-started/quick-start/
  *** como usar las rutas con vuex https://vuex.vuejs.org/guide/modules.html
  *** como hacer calendario con vuetify - firebase https://bluuweb.github.io/
  *** database en firebase https://console.firebase.google.com/u/0/
  *** iconos con mdi https://cdn.materialdesignicons.com/5.0.45/
 -->
  <v-app>
    <v-app-bar app color="secondary" dence dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Proyecto Vue</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
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
      <router-view />
      <v-dialog v-model="loading.estado" hide-overlay persistent width="300">
        <v-card :color="loading.color" dark>
          <v-card-text>
            {{loading.titulo}}
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-content>

    <v-navigation-drawer v-model="drawer"  app>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link :to="{name: item.title}" exact>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "App",
  components: {},
  data: () => ({
    drawer: false,
    items: [
      { title: "Home", icon: "mdi-home" },
      { title: "About", icon: "mdi-forum-outline" },
      { title: "Tareas", icon: "mdi-pencil-remove" },
      { title: "Ncalendario", icon: "mdi-calendar" },
      { title: "Store", icon: "mdi-store" },
      { title: "Library", icon: "mdi-book" }
    ]
  }),
  computed: {
    ...mapState(['loading'])
  },
};
</script>
