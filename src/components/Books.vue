<template>
  <v-container fluid>
    <v-row class="d-flex flex-wrap">
      <v-col cols="12" md="6">
        <v-card class="mb-3" v-for="(item, index) in listaTareas" :key="index">
          <v-card-text>
            <v-chip color="fff" label text-color="black">
              <v-icon left>mdi-label</v-icon>
              <strong>{{ item.title }}</strong>
            </v-chip>

            <div>
              <br>
              <p class="font-weight-bold text-justify">
                <v-icon>mdi-book-open-variant</v-icon>
                {{ item.descripcion }}
              </p>
            </div>
            <v-btn color="warning" @click="editar(item.id, index)">Editar</v-btn>
            <v-btn class="ma-2" color="error" @click="deleteTarea(item.id)">Eliminar</v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-3 pa-3" v-if="formAdd">
          <v-form @submit.prevent="addTarea">
            <v-text-field label="valida moneda" ref="field" prefix="$" v-model="value" autofocus />
            <v-text-field label="Titulo de Tarea" v-model="title" />
            <v-textarea label="Descripción de Tarea" v-model="descripcion" />
            <v-btn block color="success" type="submit">Add Tarea</v-btn>
          </v-form>
        </v-card>

        <v-card class="mb-3 pa-3" v-if="!formAdd">
          <v-form @submit.prevent="editTarea">
            <v-text-field label="Titulo de Tarea" v-model="title" autofocus />
            <v-textarea label="Descripción de Tarea" v-model="descripcion"  />
            <v-btn block color="warning" type="submit">Edit Tarea</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar"> 
      {{ msg }}
      <v-btn color="pink" text @click="snackbar = false">Cerrar</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import AutoNumeric from "autonumeric";
export default {
  mounted() {
    new AutoNumeric(this.$refs.field.$refs.input);
  },
  data() {
    return {
      value: "",
      listaTareas: [],
      title: "",
      descripcion: "",
      snackbar: false,
      msg: "",
      formAdd: true,
      indexTarea: "",
      idTarea: "",
    };
  },
  created() {
    this.getTarea();
  },
  methods: {
    getTarea() {
      axios
        .get(`https://librarycf.herokuapp.com/api/v1.0/books/`)
        // . get(`http://5.189.191.207/api/v1.0/books/`)
        .then((res) => {
          // console.log(res.data);
          this.listaTareas = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addTarea() {
      let data = {
        title: this.title,
        descripcion: this.descripcion,
      };

      this.value = this.value.split(",").join("");
      let k = parseFloat(this.value)
      console.log(k);

      axios
        .post(`https://librarycf.herokuapp.com/api/v1.0/books/`, data)
      //   .post(`http://5.189.191.207/api/v1.0/books/`, data)
        .then((res) => {
          this.indexTarea = "";
          this.title = "";
          this.descripcion = "";
          this.snackbar = true;
          this.formAdd = true;
          this.msg = "Tarea agregada con Exito ...!";
          this.getTarea();
        })
        .catch((err) => {
          this.snackbar = true;
          this.msg = "a ocurrido un Error ...!";
        });

    },
    deleteTarea(id) {
      console.log('ingreso ', id);
      axios
        .delete(`https://librarycf.herokuapp.com/api/v1.0/books/${id}/`)
        // .delete(`http://5.189.191.207/api/v1.0/books/${id}/`)
        .then((res) => {
          this.getTarea();
        })
        .catch((err) => {
          console.log(err)
        })
    },
    editar(id, index) {
      this.formAdd = false;
      this.title = this.listaTareas[index].title;
      this.descripcion = this.listaTareas[index].descripcion;
      this.idTarea = id;
      this.indexTarea = index;
    },
    editTarea() {
      let data = {
        title: this.title,
        descripcion: this.descripcion,
      };

      axios
        .put(`https://librarycf.herokuapp.com/api/v1.0/books/${this.idTarea}/`, data)
        // .put(`http://5.189.191.207/api/v1.0/books/${this.idTarea}/`, data)
        .then((res) => {
          this.listaTareas[this.indexTarea].title = res.data.title;
          this.listaTareas[this.indexTarea].descripcion = res.data.descripcion;
          this.indexTarea = "";
          this.title = "";
          this.descripcion = "";
          this.snackbar = true;
          this.formAdd = true;
          this.msg = "Tarea se modifico con exito ...!";
        })
        .catch((err) => {
          this.snackbar = true;
          this.msg = "a ocurrido un error ...!";
        });
    },
  },
};
</script>