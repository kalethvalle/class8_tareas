<template>
  <v-container fluid>
    <v-row class="d-flex flex-wrap">
      <v-col cols="12">
        <v-card>
          <v-system-bar window dark color="indigo" height="20">
            <!-- <v-icon size="18">mdi-account-multiple</v-icon> -->
            <h3>Organiza mis Tareas</h3>
            <v-spacer></v-spacer>
          </v-system-bar>
          <v-card-text>
            <v-data-table
              :loading="load"
              :headers="headers"
              :items="listaTareas"
              :items-per-page="5"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Todo</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="formAdd" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="indigo"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        rounded
                      >
                        <v-icon>mdi-plus</v-icon>
                        new Task
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-text>
                        <v-form @submit.prevent="addTarea">
                          <v-text-field
                            label="Titulo de Tarea"
                            v-model="title"
                          />
                          <v-textarea
                            label="Descripción de Tarea"
                            v-model="descripcion"
                          />
                          <v-btn block color="success" type="submit"
                            >Add Tarea</v-btn
                          >
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-dialog>

                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="headline"
                        >Are you sure you want to delete this
                        item?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editar(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteTarea(item.id)">
                  mdi-delete
                </v-icon>
              </template>

              <template v-slot:no-data>
                <v-row>
                    <v-col cols="12">
                        <v-icon size="100">mdi-check</v-icon>
                        <h2>No se encontraron Task</h2>
                    </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <v-dialog v-model="formEdit" width="500">
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="editTarea">
            <v-text-field label="Titulo de Tarea" v-model="title" autofocus />
            <v-textarea label="Descripción de Tarea" v-model="descripcion" />
            <v-btn block color="warning" type="submit">Edit Tarea</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar">
      {{ msg }}
      <v-btn color="pink" text @click="snackbar = false">Cerrar</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      headers: [
        {
          text: "Task Title",
          align: "start",
          sortable: false,
          value: "title",
        },
        { text: "Descrip Task", value: "descripcion", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      listaTareas: [],
      title: "",
      descripcion: "",
      snackbar: false,
      msg: "",
      formAdd: false,
      formEdit: false,
      indexTarea: "",
      idTarea: "",
      load: false,
    };
  },
  created() {
    this.getTarea();
  },
  methods: {
    getTarea() {
      this.load = true;
      this.listaTareas = [];
      axios
        .get(`https://librarycf.herokuapp.com/api/v1.0/books/`)
        // . get(`http://5.189.191.207/api/v1.0/books/`)
        .then((res) => {
          // console.log(res.data);
          this.listaTareas = res.data;
          this.load = false;
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

      //   this.value = this.value.split(",").join("");
      //   let k = parseFloat(this.value);
      //   console.log(k);

      axios
        .post(`https://librarycf.herokuapp.com/api/v1.0/books/`, data)
        //   .post(`http://5.189.191.207/api/v1.0/books/`, data)
        .then((res) => {
          this.indexTarea = "";
          this.title = "";
          this.descripcion = "";
          this.snackbar = true;
          this.formAdd = false;
          this.msg = "Tarea agregada con Exito ...!";
          this.getTarea();
        })
        .catch((err) => {
          this.snackbar = true;
          this.msg = "a ocurrido un Error ...!";
        });
    },
    deleteTarea(id) {
      console.log("ingreso ", id);
      axios
        .delete(`https://librarycf.herokuapp.com/api/v1.0/books/${id}/`)
        // .delete(`http://5.189.191.207/api/v1.0/books/${id}/`)
        .then((res) => {
          this.getTarea();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editar(item) {
      console.log(item);
      this.formEdit = true;
      this.title = item.title;
      this.descripcion = item.descripcion;
      this.idTarea = item.id;
    },
    editTarea() {
      let data = {
        title: this.title,
        descripcion: this.descripcion,
      };

      axios
        .put(
          `https://librarycf.herokuapp.com/api/v1.0/books/${this.idTarea}/`,
          data
        )
        // .put(`http://5.189.191.207/api/v1.0/books/${this.idTarea}/`, data)
        .then((res) => {
          this.getTarea();
          this.indexTarea = "";
          this.title = "";
          this.descripcion = "";
          this.snackbar = true;
          this.formEdit = false;
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