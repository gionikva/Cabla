<template>
  <v-card>
    <v-card-title>
      <router-link class="link" :to="`${collection.title}`" append>{{ collection.title }} </router-link>
      <v-spacer></v-spacer>
     
    </v-card-title>
    <v-card-text class="text-left textColor--text">
      <v-row class="row">
        <p>Word Count: placeholder</p>
        <v-spacer></v-spacer>
         <router-link class="link" :to="`${collection.title}`" append
        ><v-btn width="2.5rem" height="2.5rem" icon @click="deleteEvent">
          <v-icon size="1.8rem">mdi-open-in-new</v-icon>
        </v-btn>
      </router-link>
        <v-btn :loading="deleteLoading" width="2.5rem" height="2.5rem" icon @click="deleteEvent">
          <v-icon size="1.8rem">mdi-delete</v-icon>
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CollectionCard",
  props: ["collection", "deleteLoading"],
  methods: {
    deleteEvent() {
      this.$emit("delete", this.collection.title);
    },
  },

  computed: mapGetters("words", {
    currentCollection: "getCurrentCollection",
  }),
};
</script>

<style lang="scss" scoped>
.row {
  margin: 0rem 0.2rem;
}
</style>
