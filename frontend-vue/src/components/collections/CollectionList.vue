<template>
  <div class="collection-list">
    <v-dialog max-width="20rem" v-model="deletePrompt">
      <v-card>
        <v-card-title> Confirm Delete </v-card-title>
        <v-card-text class="text-left textColor--text subtitle-1">
          Are you sure you want to delete {{ selectedCollection }}?
          <br />
          Note: This action will remove all nested data, including words and sub-collections.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="accent" @click="deletePrompt = false">
            No
          </v-btn>
          <v-btn
            text
            color="accent"
            @click="
              deleteCollection();
              deletePrompt = false;
            "
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <CollectionCard
      v-for="collection in collections.filter((collection) => collection.title !== 'Archived')"
      :collection="collection"
      :key="collection.title"
      :deleteLoading='deleteData[collection.title]'
      @delete="promptDelete"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CollectionCard from "./CollectionCard";
export default {
  components: {
    CollectionCard,
  },
  data() {
    return {
      deletePrompt: false,
      selectedCollection: "",
      deleteData: {

      }
    };
  },

  created() {
    this.bindCollection("/collections");
  },
  methods: {
    ...mapActions("words", ["bindCollection", "removeCollection"]),
    promptDelete(title) {
      this.selectedCollection = title;
      this.deletePrompt = true;
    },
    async deleteCollection() {
      this.deleteData[this.selectedCollection] = true;
      await this.removeCollection(this.selectedCollection);
      this.deleteData[this.selectedCollection] = false;
    },
  },
  computed: {
    ...mapGetters("words", {
      currentCollection: "getCurrentCollection",
    }),
  },
  name: "CollectionList",
  props: ["collections"],
};
</script>

<style lang="scss" scoped>
.collection-list {
  display: grid;
  grid-gap: 1rem;
  margin: 1rem;
  grid-template-columns: 1fr;
}
</style>
