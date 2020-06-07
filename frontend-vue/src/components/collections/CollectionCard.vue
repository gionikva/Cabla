<template>
  <v-card>
    <v-card-title >
      <router-link class='link' :to="`${collection.title}`" append>{{ collection.title }} </router-link></v-card-title
    >
    <v-card-text class="text-left textColor--text">
      Word Count: placeholder
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn width="2.5rem" height="2.5rem" icon @click="deleteEvent">
        <v-icon size='1.8rem'>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: "CollectionCard",
  props: ["collection"],
  methods: {
    deleteEvent() {
      this.$emit("delete", this.collection.title);
    },
  },

  computed: mapGetters("words",{
    currentCollection: "getCurrentCollection"
  })
};
</script>

<style></style>
