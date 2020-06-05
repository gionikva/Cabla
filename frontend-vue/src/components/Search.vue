<template>
  <div class="d-flex flex-row align-center search-bar-col">
    <form @submit.prevent="search(term.trim())">
      <v-text-field
        class="search fab-bar"
        v-model="term"
        height="2rem"
        width="1rem"
        @click:append="search(term.trim())"
        append-icon="mdi-magnify"
        @click:prepend-inner="term = ''"
        prepend-inner-icon=""
      ></v-text-field>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Search",
  data() {
    return {
      term: "",
      waitingTitle: "",
    };
  },
  mounted() {
    this.initSearch();
  },
  methods: {
    ...mapActions("words", ["search"]),
    initSearch() {
      setInterval(async () => await this.searchEvent(), 500);
    },
    async searchEvent() {
      if (this.term !== this.waitingTitle) {
        await this.search(this.term);
        this.waitingTitle = this.term;
      }
    },
  },
  computed: {
    ...mapGetters("words", {
      term: "getSearchTerm",
    }),
    ...mapGetters("words", {
      searching: "getSearching",
    }),
    icon: {
      get() {
        if (this.searching) {
          return "mdi-close";
        } else {
          return "";
        }
      },
    },
  },
};
</script>

<style>
.search-bar-col {
  margin-top: 1rem;
}
</style>
