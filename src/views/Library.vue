<template>
    <v-container fluid>
        <Books />
    </v-container>
</template> 

<script>
import Books from '@/components/Books.vue'
export default {
    name: 'Library',
    components:{
        Books
    }
}
</script>