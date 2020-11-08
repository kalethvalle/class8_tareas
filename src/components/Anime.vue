<template>
    <v-container fluid>
      <div class="d-flex justify-space-between text-center">
        <v-btn
          class="ma-2"
          outlined
          small
          fab
          color="indigo"
          @click="rsAnime(20)"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          class="ma-2"
          outlined
          small
          fab
          color="indigo"
          @click="sgAnime(20)"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
      <v-row dense>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="(anime, index) in animes"
          :key="index"
        >
   
          <v-card class="mx-auto" elevation="14">
            <v-img
              :src="anime.attributes.posterImage.medium"
              @click="mostrarSynopsis(index)"
            ></v-img>
            <v-card-title>{{ anime.attributes.titles.en }}</v-card-title>
            <v-card-subtitle>{{
              anime.attributes.titles.ja_jp
            }}</v-card-subtitle>

            <v-card-text class="text--primary">
              <p>{{ anime.attributes.ageRatingGuide }}</p>
              <p>{{ anime.attributes.status }}</p>
            </v-card-text>
          </v-card>

          <v-dialog v-model="show[index].estado" width="700">
            <v-card>
              <v-card-title>{{ anime.attributes.titles.en }}</v-card-title>
              <v-card-subtitle>
                {{ anime.attributes.titles.ja_jp }}
              </v-card-subtitle>
              <v-divider class="mx-4"></v-divider>
              <v-card-text class="mt-3">
                <v-card flat>
                  <youtube
                    class="d-none d-sm-flex d-md-flex"
                    :video-id="anime.attributes.youtubeVideoId"
                    width="650"
                    height="250"
                  ></youtube>
                  <youtube
                    class="d-flex d-sm-none "
                    :video-id="anime.attributes.youtubeVideoId"
                    width="300"
                    height="250"
                  ></youtube>
                </v-card>
                <p class="text-justify mt-2 text--primary">
                  {{ anime.attributes.synopsis }}
                </p>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="show[index].estado = false">
                  Cerrar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      animes: [],
      index: 0,
      show: [],
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

        // console.log(this.animes);
      } catch (e) {
        console.log(e);
        console.log("a ocurrio un error");
      }
    },
  },
  created() {
    for (let i = 0; i < 20; i++) {
      this.show.push({ id: i, estado: false });
    }
    this.getAnime(this.index);
  },
};
</script>
<style>
/* This is for documentation purposes and will not be needed in your application */
#lateral .v-btn--example {
  bottom: 0;
  position: absolute;
  margin: 0 0 16px 16px;
}
</style>