<template>
  <v-container :fluid="true" class="mt-0">
    <h1> {{ title }} </h1>
    <v-row class="fill-height" >
      <v-col>
        <v-sheet class="mb-7">
          <v-toolbar flat color="white" >
            <!-- Botón Agregar Evento -->
            <v-row class="d-flex"> 
              <v-col >
                  <v-btn color="primary" dark class="mr-4" @click="dialog = true">
                    Nuevo Evento
                  </v-btn>

                  <v-btn outlined class="mr-4" @click="setToday">
                    Hoy
                  </v-btn>
              
                  <v-btn fab text small @click="prev">
                    <v-icon medium>mdi-chevron-left</v-icon>
                  </v-btn>

                  <v-btn fab text small @click="next">
                    <v-icon medium>mdi-chevron-right</v-icon>
                  </v-btn>
              </v-col>
              <v-spacer></v-spacer>
              <v-col>
                  <v-menu bottom right>
                    <template v-slot:activator="{ on }">
                      <v-btn outlined v-on="on">
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="type = 'day'">
                        <v-list-item-title>Día</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'week'">
                        <v-list-item-title>Semana</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'month'">
                        <v-list-item-title>Mes</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = '4day'">
                        <v-list-item-title>4 Días</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
              </v-col>
            </v-row>
          </v-toolbar>
        </v-sheet>

        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            locale="es"
            :short-weekdays="true"
          ></v-calendar>

          <!-- Agregar Modal Agregar Evento -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-container>
                <v-form @submit.prevent="addEvent">
                  <v-text-field type="text" label="Agrege Nombre del Evento" v-model="name" />
                  <v-text-field type="text" label="Agrege Detalle del Evento" v-model="details" />
                  <v-text-field type="date" label="Inicio del Evento" v-model="start" />
                  <v-text-field type="date" label="Fin del Evento" v-model="end" />
                  <v-text-field type="color" label="Prioridad del Evento" v-model="color" />

                  <v-btn type="submit" color="primary" block @click.stop="dialog = false">
                    Crear Evento
                  </v-btn>
                </v-form>
              </v-container>
            </v-card>
          </v-dialog>
          

          <v-menu v-model="selectedOpen" 
                  :close-on-content-click="false" 
                  :activator="selectedElement"
                  offset-x >
            <v-card color="grey lighten-4" min-width="350px" flat >
              <!-- Agregar Funcionalidades Editar y Eliminar -->
              <v-toolbar :color="selectedEvent.color" dark>
                <v-btn icon @click="deleteEvent(selectedEvent)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card-text>
                <v-form v-if="currentlyEditing !== selectedEvent.id">
                  {{ selectedEvent.name }} - {{ selectedEvent.details }}
                </v-form>

                <!-- formulario para editar -->
                <v-form v-else>
                  <v-container>
                    <v-text-field type="text" v-model="selectedEvent.name" label="Editar Nombre del Evento" />
                    <textarea-autosize 
                      type="text" v-model="selectedEvent.details" style="width: 100%" :min-height="100" >
                    </textarea-autosize>
                  </v-container>

                </v-form>
                
              </v-card-text>

              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false" >
                  Cancel
                </v-btn>
                <v-btn text v-if="currentlyEditing !== selectedEvent.id"
                      @click.prevent="editEvent(selectedEvent.id)">Editar</v-btn>
                <v-btn text v-else @click="updateEvent(selectedEvent)">Guardar Cambios</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { db } from '../main'
  export default {
    data: () => ({
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        '4day': '4 Días',
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      // Adicionales...
      name: null,
      details: null,
      color: '#1976D2',
      dialog: false,
      currentlyEditing: null
    }),
    computed: {
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day + this.nth(start.day)
        const endDay = end.day + this.nth(end.day)

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    created() {
      this.getEvents();
    },
    methods: {
      async updateEvent(ev){
        try {
          
          await db.collection('eventos').doc(ev.id).update({

            name: ev.name,
            details: ev.details

          })

          this.selectedOpen = false;
          this.currentlyEditing = null;

          this.getEvents();

        } catch (error) {
          console.log(error)
        }
      },
      editEvent(id){

        this.currentlyEditing = id

      },
      async deleteEvent(ev){
        try {
          
          await db.collection('eventos').doc(ev.id).delete();
          this.selectedOpen = false;
          this.getEvents();

        } catch (error) {
          console.log(error)
        }
      },
      async addEvent(){
        try {
          if (this.name && this.start && this.end) {
            
            await db.collection('eventos').add({
              name: this.name,
              details: this.details,
              start: this.start,
              end: this.end,
              color: this.color
            });

            this.getEvents();

            this.name = null;
            this.details = null;
            this.start = null;
            this.end = null;
            this.color = '#1976D2'

          }else{
            alert('Campos obligatorios...!')
          }
        } catch (error) {
          console.log(error);
        }
      },
      async getEvents(){
        try {

          const snapshot = await db.collection('eventos').get()
          const events = [];

          snapshot.forEach(doc => {
            // console.log(doc.data());
            let addEvents = doc.data();
            addEvents.id = doc.id;
            events.push(addEvents);
          });

          this.events = events;
          
        } catch (error) {
          console.log(error)
        }
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
    },
  }
</script>