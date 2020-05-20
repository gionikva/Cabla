<template>
  <div class="d-flex flex-row align-center search-bar-col">
    <form @submit.prevent="setSearchTerm(title.trim())">
      <v-text-field
        class="search fab-bar"
        v-model="title"
        height="2rem"
        width="1rem"
        @click:append="setSearchTerm(title.trim())"
        append-icon="mdi-magnify"
        @click:prepend-inner="title=''"
        :prepend-inner-icon="icon"
      ></v-text-field>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      titleData: ""
    };
  },
  methods: {
    ...mapMutations("words", ["setSearchTerm"])
  },
  computed: {
    ...mapGetters("words", {
      term: "getSearchTerm"
    }),
    ...mapGetters("words", {
      searching: "getSearching"
    }),
    icon: {
      get() {
        if (this.searching) {
          return "mdi-close";
        } else {
          return "";
        }
      }
    },
    title: {
      set(value) {
        this.titleData = value;
        if (value == "") {
          this.setSearchTerm("");
        }
      },
      get() {
        return this.titleData;
      }
    }
  }
};
</script>

<style>
.search-bar-col {
  margin-top: 1rem;
}
</style>