<template>
  <v-container fluid>
    <v-row class="d-flex flex-wrap">
      <v-col cols="12">
        <v-card>
          <v-system-bar window dark color="indigo" height="20">
            <h3>Organiza mis Tareas</h3>
            <v-spacer></v-spacer>
          </v-system-bar>
          <v-card-text>
            <v-data-table
              :loading="load"
              :headers="headers"
              :items="listaTareas"
              :items-per-page="15"
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
                        <v-form @submit.prevent="addTarea" class="pa-3">
                          <v-switch
                            v-if="taskResol"
                            v-model="taskResol"
                            color="indigo"
                            :label="`Procesa Resolucion Factura`"
                          ></v-switch>

                          <v-text-field
                            label="Titulo de Tarea"
                            v-model="title"
                          />

                          <v-textarea
                            label="Descripción de Tarea"
                            rows="3"
                            v-model="descripcion"
                          />

                          <v-file-input
                            v-if="taskResol"
                            dense
                            label="Subir Archivos"
                            v-model="taskfile"
                          ></v-file-input>

                          <v-btn block color="success" type="submit">
                            Add Tarea
                          </v-btn>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-dialog>

                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="headline">
                        Esta seguro de Eliminar esta tarea
                      </v-card-title>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="taskDelete = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="taskDelete = true"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.taskFile="{ item }">
                <v-avatar
                  tile
                  class="mt-1 mb-1 ml-2"
                  v-if="item.taskFile == null"
                >
                  <v-icon size="60" color="grey lighten-1" dark>
                    mdi-camera-off
                  </v-icon>
                </v-avatar>
                <v-btn
                  :href="item.taskFile"
                  target="_blank"
                  v-else-if="
                    item.taskFile.split('.')[4] == 'jpg' ||
                    item.taskFile.split('.')[4] == 'jpeg' ||
                    item.taskFile.split('.')[4] == 'png'
                  "
                  text
                  class="mx-0 px-0"
                  elevation="0"
                >
                  <v-avatar tile class="px-0 mx-0 mt-1 mb-1">
                    <img :src="item.taskFile" />
                  </v-avatar>
                </v-btn>
                <v-avatar
                  tile
                  class="mt-1 mb-1 ml-2"
                  v-else-if="item.taskFile.split('.')[4] == 'pdf'"
                >
                  <a :href="item.taskFile" target="_blank">
                    <v-icon size="60" color="red" dark>mdi-pdf-box</v-icon>
                  </a>
                </v-avatar>
                <v-avatar
                  tile
                  class="mt-1 mb-1 ml-2"
                  v-else-if="
                    item.taskFile.split('.')[4] == 'xlsx' ||
                    item.taskFile.split('.')[4] == 'csv' ||
                    item.taskFile.split('.')[4] == 'CSV'
                  "
                >
                  <a :href="item.taskFile" target="_blank">
                    <v-icon size="60" color="green" dark>mdi-file-excel</v-icon>
                  </a>
                </v-avatar>
                <v-avatar
                  tile
                  class="mt-1 mb-1 ml-2"
                  v-else-if="
                    item.taskFile.split('.')[4] == 'json' ||
                    item.taskFile.split('.')[4] == 'JSON'
                  "
                >
                  <a :href="item.taskFile" target="_blank">
                    <v-icon size="60" color="green" dark>mdi-nodejs</v-icon>
                  </a>
                </v-avatar>
                <v-avatar
                  tile
                  class="mt-1 mb-1 ml-2"
                  v-else-if="
                    item.taskFile.split('.')[4] == 'txt' ||
                    item.taskFile.split('.')[4] == 'TXT'
                  "
                >
                  <a :href="item.taskFile" target="_blank">
                    <v-icon size="60" color="grey lighten-1" dark
                      >mdi-file</v-icon
                    >
                  </a>
                </v-avatar>
                <v-avatar
                  tile
                  class="mt-1 mb-1 ml-2"
                  v-else-if="
                    item.taskFile.split('.')[4] == 'zip' ||
                    item.taskFile.split('.')[4] == 'rar'
                  "
                >
                  <a :href="item.taskFile" target="_blank">
                    <v-icon size="60" color="grey lighten-1" dark>
                      mdi-folder
                    </v-icon>
                  </a>
                </v-avatar>
              </template>
              <template v-slot:item.taskEnd="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      v-bind="attrs"
                      v-on="on"
                      :color="item.taskEnd ? 'green' : '#D4D5D4'"
                      @click="tareaTerminada(item)"
                      dark
                    >
                      {{ item.taskEnd ? "Terminada" : "Pendiente" }}
                      <v-icon class="ml-2 mb-1">
                        {{ item.taskEnd ? "mdi-thumb-up" : "mdi-thumb-down" }}
                      </v-icon>
                    </v-chip>
                  </template>
                  <span>
                    {{
                      item.taskEnd
                        ? "Tarea Terminada ..."
                        : "Click Para terminar tarea"
                    }}
                  </span>
                </v-tooltip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-1" @click="editar(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small class="mr-1" @click="deleteTarea(item.id)">
                  mdi-delete
                </v-icon>
                <!-- <v-icon
                  :small="!item.taskEnd"
                  @click="tareaTerminada(item)"
                  :color="item.taskEnd ? 'green' : ''"
                >
                  {{ item.taskEnd ? "mdi-check" : "mdi-alert" }}
                </v-icon> -->
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
      <v-col cols="12" v-if="taskResol">
        <v-card>
          <v-system-bar window dark color="indigo" height="20">
            <h3>Tabla de Prefijos</h3>
            <v-spacer></v-spacer>
          </v-system-bar>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Ide</th>
                  <th class="text-left">Prefijo</th>
                  <th class="text-left">Resolucion</th>
                  <th class="text-left">Numero Inicio</th>
                  <th class="text-left">Numero Fin</th>
                  <th class="text-left">Fecha Inicio</th>
                  <th class="text-left">Vigencia</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in prefijos" :key="item.prefijo">
                  <td>{{ item.id_task }}</td>
                  <td>{{ item.prefijo }}</td>
                  <td>{{ item.resolucion_pref }}</td>
                  <td>{{ item.nro_ini_pref }}</td>
                  <td>{{ item.nro_fin_pref }}</td>
                  <td>{{ item.fecha_ini_pref }}</td>
                  <td>{{ item.vigencia_pref }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="formEdit" width="500">
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="editTarea" class="pa-3">
            <v-text-field label="Titulo de Tarea" v-model="title" autofocus />
            <v-textarea
              label="Descripción de Tarea"
              rows="3"
              v-model="descripcion"
            />
            <v-file-input
              dense
              label="Subir Archivos"
              v-model="taskfile"
            ></v-file-input>

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
      path: "https://tareasadmincf.herokuapp.com",
      headers: [
        {
          text: "Task Title",
          align: "start",
          sortable: false,
          value: "taskTitle",
        },
        {
          text: "Descrip Task",
          align: "start",
          value: "taskDescrip",
          sortable: false,
        },
        {
          text: "File Task",
          align: "start",
          value: "taskFile",
          sortable: false,
        },
        {
          text: "Tarea Terminada",
          align: "center",
          value: "taskEnd",
          sortable: false,
        },
        {
          text: "Fecha Creación",
          align: "center",
          value: "taskFechaCrea",
          sortable: false,
        },
        { text: "Actions", align: "center", value: "actions", sortable: false },
      ],
      listaTareas: [],
      prefijos: [],
      title: "",
      fecha: new Date(),
      descripcion: "",
      taskend: false,
      taskResol: false,
      taskfile: null,
      snackbar: false,
      msg: "",
      formAdd: false,
      formEdit: false,
      idTarea: "",
      dialogDelete: false,
      taskDelete: false,
      load: false,
    };
  },
  created() {
    this.getTarea();
  },
  methods: {
    async getPrefijos() {
      const url = `${this.path}/api/v1.0/prefijos/`; //prueba
      this.load = true;
      this.prefijos = [];

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        this.prefijos = await res.json();

        console.log(this.prefijos);
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    async getTarea() {
      // console.log(`fecha: ${this.fecha.getDate()}/${this.fecha.getMonth()}/${this.fecha.getFullYear()}`);
      // const url = `https://tareascf.herokuapp.com/api/v1.0/books/`; // produccion
      const url = `${this.path}/api/v1.0/task/`; //prueba
      this.load = true;
      this.listaTareas = [];

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        this.listaTareas = await res.json();

        console.log(this.listaTareas);
        this.getPrefijos();
      } catch (e) {
        console.log(e);
      } finally {
        this.load = false;
      }
    },
    addTarea() {
      const formData = new FormData();
      const f = `${this.fecha.getFullYear()}-${this.fecha.getMonth()}-${this.fecha.getDate()}`;
      // console.log(f);
      // debugger

      formData.append("taskTitle", this.title);
      formData.append("taskDescrip", this.descripcion);
      formData.append("taskEnd", this.taskend);
      formData.append("taskResol", this.taskResol);
      formData.append("taskFechaCrea", f); 
      if (this.taskfile != null) formData.append("taskFile", this.taskfile);

      // const url = `https://tareascf.herokuapp.com/api/v1.0/books/`; // produccion
      const url = `${this.path}/api/v1.0/task/`; //prueba
      let _optionsParam = {
        method: "POST",
        data: formData,
        headers: "",
        params: "",
        url: url,
      };

      axios(_optionsParam)
        .then((res) => {
          this.title = "";
          this.descripcion = "";
          this.taskend = false;
          this.taskfile = "";
          this.snackbar = true;
          this.formAdd = false;
          this.msg = "Tarea agregada con Exito ...!";
          this.getTarea();
        })
        .catch((err) => {
          console.log("error: ", err);
          this.snackbar = true;
          this.msg = "a ocurrido un Error ...!";
        });
    },
    deleteTarea(id) {
      // const url = `https://librarycf.herokuapp.com/api/v1.0/books/`; //produccion
      const url = `${this.path}/api/v1.0/task/`; //prueba
      axios
        .delete(`${url}${id}/`)
        .then((res) => {
          this.getTarea();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editar(item) {
      this.formEdit = true;
      this.title = item.taskTitle;
      this.descripcion = item.taskDescrip;
      this.taskend = item.taskEnd;
      this.taskfile = item.taskFile;
      this.idTarea = item.id;
    },
    editTarea() {
      const formData = new FormData();

      formData.append("taskTitle", this.title);
      formData.append("taskDescrip", this.descripcion);
      formData.append("taskEnd", this.taskend);
      formData.append("taskResol", this.taskResol);
      formData.append("taskFile", this.taskfile);

      // const url = `https://librarycf.herokuapp.com/api/v1.0/books/`; //produccion
      const url = `${this.path}/api/v1.0/task/`; //prueba

      axios
        .put(`${url}${this.idTarea}/`, formData)
        .then((res) => {
          this.getTarea();
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
    tareaTerminada(item) {
      var formData = new FormData();

      if (!item.taskEnd) {
        item.taskEnd = !item.taskEnd;
        for (var [key, value] of Object.entries(item))
          key !== "taskFile" ? formData.append(key, value) : false;

        // const url = `https://librarycf.herokuapp.com/api/v1.0/books/`; //produccion
        const url = `${this.path}/api/v1.0/task/${item.id}/`; //prueba

        let _optionsParam = {
          method: "PUT",
          data: formData,
          headers: "",
          params: "",
          url: url,
        };

        axios(_optionsParam)
          .then((res) => {
            this.getTarea();
            this.title = "";
            this.descripcion = "";
            this.snackbar = true;
            this.formEdit = false;
            this.msg = "Tarea Terminada ...!";
          })
          .catch((err) => {
            this.snackbar = true;
            item.taskEnd = false;
            this.msg = "a ocurrido un error ...!";
          });
      } else {
        this.snackbar = true;
        this.msg = "Tarea ya esta terminada ...!";
      }
    },
  },
};
</script>
