<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="6">
                <v-card
                elevation="2"
                >
                    <v-card-title>New USer</v-card-title>
                    <v-col
                        cols="12"            
                    >
                        <v-text-field
                            label="Usuario"
                            type="text"
                        ></v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                    >
                        <v-text-field
                            label="Clave"
                            type="password"
                        ></v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                        
                    >
                        <v-text-field
                            label="Confirma Clave"
                            type="password"
                        ></v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                    >
                        <v-text-field
                            label="Email"
                            type="email"
                        ></v-text-field>
                    </v-col>
                    <v-card-actions>
                    <v-btn
                        color="deep-purple lighten-2"
                        text
                        
                    >
                        Enviar
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card
                    class="mx-auto"
                    max-width="300"
                    tile
                >
                    <v-list>
                    <v-subheader >Usuarios</v-subheader>
                        <v-list-item
                        v-for="(item, i) in usuarios"
                        :key="i"
                        >
                            <v-list-item-icon>
                                <v-icon size="40">mdi-account-circle</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content >
                                <v-list-item-title v-text="item.username"></v-list-item-title>
                                <v-list-item-subtitle v-html="item.email"></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action >
                            <v-btn 
                                icon
                                @click="mostrarUsuario(item)"
                            >
                                <v-icon color="grey lighten-0">mdi-account-edit</v-icon>
                            </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
      </v-row>

        <v-dialog
            transition="dialog-bottom-transition"
            max-width="600"
            v-model="edit_user"
        >
            <v-card>
            <v-toolbar
                color="dark"
                dark
            >
                <h3>Actualizar Usuario</h3>
            </v-toolbar>
            <v-card-text>
                
                    <v-col
                        cols="12"            
                    >
                        <v-text-field
                            v-model="user.username"
                            label="Usuario"
                            type="text"
                        ></v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                    >
                        <v-text-field
                            v-model="user.clave1"
                            label="Clave"
                            type="password"
                        ></v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                    >
                        <v-text-field
                            v-model="user.clave2"
                            label="Confirma Clave"
                            type="password"
                        ></v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                    >
                        <v-text-field
                            v-model="user.email"
                            label="Email"
                            type="email"
                        ></v-text-field>
                    </v-col>                
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn
                    text
                    @click="deleteUsuario(user.id)"
                >
                    Eliminar
                </v-btn>
                <v-btn
                    text
                    @click="edit_user = false"
                >
                    Actualizar
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="edit_user = false"
                >
                    Cerrar
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template> 

<script>
export default {
    data() {
        return {
            url: `ws://127.0.0.1:8000/ws/users/`,
            connection: null,
            usuarios: [],
            edit_user: false,
            user: {
                id: 0,
                username: '',
                clave1: '',
                clave2: '',
                email: '',
            }
        }
    },
    created() {
        this.changeWs()
    },
    methods: {
        changeWs(){
            console.log("Starting connection to WebSocket Server")
            this.connection = new WebSocket(this.url)

            this.connection.onopen = (event) =>{
                console.log("Successfully connected to the echo websocket server...")
                this.connection.send(JSON.stringify({
                    action: "list",
                    request_id: new Date().getTime(),
                }))
            }  

            this.connection.onmessage = (data) =>{
                let users = JSON.parse(data.data)

                switch (users.action) {
                    case "list":
                        this.usuarios = users.data
                        break;
                    case "create":
                        this.usuarios.push(users.data)
                        break;
                    case "delete":
                        console.log(users);
                        break;
                    default:
                        break;
                }

                
            }

            this.connection.onclose = (e) =>{
                console.log('Cerrada la conexion ...!');
            }
        },
        mostrarUsuario(data){
            console.log(data);
            this.user.id = data.id
            this.user.username = data.username
            this.user.email = data.email
            this.edit_user = true
        },
        updateUsuario(data){
            console.log(data);
        },
        deleteUsuario(id){
            console.log(id);
            this.connection.send(JSON.stringify({
                action: "delete",
                request_id: new Date().getTime(),
                pk: id,
            }))
        },

},
}
</script>