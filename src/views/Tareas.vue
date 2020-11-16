<template>
    <v-main>
      <Books/>
    </v-main>
</template>
 
<script>
// @ is an alias to /src
import Books from '@/components/Books.vue'

export default {
  name: 'Home',
  components: {
    Books
  }
}
</script>