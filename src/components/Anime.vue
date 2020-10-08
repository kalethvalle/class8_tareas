<template>
  <div class="d-flex justify-space-around flex-wrap">
    <v-container :fluid="true">
      <div class="d-flex justify-space-between text-center">
        <v-btn class="ma-2" outlined small fab color="indigo" @click="rsAnime(20)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn class="ma-2" outlined small fab color="indigo" @click="sgAnime(20)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      
      <v-row dense>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="(anime, index) in animes" :key="index">
          <v-card class="mx-auto" elevation="14">
            <v-img :src="anime.attributes.posterImage.medium"></v-img>
            <v-card-title>{{ anime.attributes.titles.en }}</v-card-title>
            <v-card-subtitle>{{ anime.attributes.titles.ja_jp }}</v-card-subtitle>

            <v-card-text class="text--primary">
              <p>{{anime.attributes.ageRatingGuide}}</p>
              <p>{{anime.attributes.status}}</p>
            </v-card-text>

            <v-card-actions class="d-flex flex-column">
              <v-spacer></v-spacer>
              <v-btn icon @click="mostrarSynopsis(index)">
                <v-icon>{{ show[index].estado ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="show[index].estado">
                  <!-- <youtube class="ml-3" :video-id="anime.attributes.youtubeVideoId" player-width="auto" player-height="220"></youtube> -->
                <v-divider></v-divider>
                <v-card-text class="text-justify">{{anime.attributes.synopsis}}</v-card-text>
              </div> 
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row> 
    </v-container>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      animes: [],
      index: 0,
      show: []
    };
  },
  methods: {
    mostrarSynopsis(index) {
      if (index === this.show[index].id) {
        if (this.show[index].estado === false) {
          this.show[index].estado = true;
        } else {
          this.show[index].estado = false;
        }
      }
    },
    sgAnime(isg) {
      this.index += isg;
      this.getAnime(this.index);
    },
    rsAnime(irs) {
      this.index -= irs;

      if (this.index < 0) {
        this.index = 0;
      }

      this.getAnime(this.index);
    },
    async getAnime(index) {
      try {
        let datos = await axios.get(
          `https://kitsu.io/api/edge/anime?page[limit]=20&page[offset]=${index}`
        );

        this.animes = datos.data.data;

        console.log(this.animes);
      } catch (e) {
        console.log(e);
      }
    }
  },
  created() {
    for (let i = 0; i < 20; i++) {
      this.show.push({ id: i, estado: false });
    }
    this.getAnime(this.index);
  }
};
</script>
