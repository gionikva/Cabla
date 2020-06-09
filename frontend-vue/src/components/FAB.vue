<template>
  <div>
    <v-dialog v-model="dialogOpen" max-width="30rem">
      <template v-slot:activator="{ on }">
        <v-btn absolute v-bind:loading="loading" fab @click="title = ''" v-on="on" class="fab" color="accent">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title v-if="isWordList">Add New Word</v-card-title>
        <v-card-title v-else>Add New Collection</v-card-title>
        <v-card-text>
          <form @submit.prevent="onSubmit">
            <v-text-field
              color="primary"
              autofocus
              v-model="title"
              :placeholder="isWordList ? 'Enter Word' : 'Enter Title'"
            ></v-text-field>
          </form>
        </v-card-text>
        <v-card-actions align="left">
          <v-spacer></v-spacer>
          <v-btn @click="dialogOpen = false" text color="accent">Close</v-btn>
          <v-btn @click="onSubmit" text color="accent">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ errorMessage }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
  name: "FAB",
  data() {
    return {
      snackbar: false,
      title: "",
      dialogOpen: false,
      errorMessage: "",
    };
  },
  computed: {
    ...mapGetters("animations", {
      loading: "getWordAdditionQueued",
    }),
    ...mapGetters("words", {
      currentCollection: "getCurrentCollection",
    }),
    isWordList() {
      return (
        this.currentCollection.path
          .replace(/^\/+|\/+$/g, "")
          .split("/")
          .reverse()[0] !== "collections"
      );
    },
  },
  methods: {
    ...mapActions("words", ["addWord", "addCollection"]),
    ...mapMutations("animations", ["setWordAdditionData"]),
    async onSubmit() {
      this.dialogOpen = false;

      if (this.title.trim() !== "") {
        if (this.isWordList) {
          try {
            this.setWordAdditionData({
              queued: true,
              collection: this.collection,
              wordTitle: this.title.trim(),
            });
            await this.addWord(this.title.trim());
            this.setWordAdditionData({
              queued: false,
              collection: null,
              wordTitle: null,
            });
          } catch (error) {
            this.setWordAdditionData({
              queued: false,
              collection: null,
              wordTitle: null,
            });
            this.errorMessage = error.message;
            this.snackbar = true;
          }
        } else{
          await this.addCollection(this.title.trim())
        }
      }
    },
  },
  props: ["collection"],
};
</script>

<style>
.fab {
  position: fixed;
  bottom: 1.8rem;
  right: 1.8rem;
}
</style>
