<template>
  <div :style="{ width: width }" class="d-flex flex-row align-center search-bar-col">
    <form @submit.prevent="search(term.trim())">
      <v-text-field
        class="search fab-bar"
        v-model="term"
        :height="height_"
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
  props: ["width", "height"],
  data() {
    return {
      term: "",
      waitingTitle: "",
      width_: this.width ? this.width : '20rem' ,
      height_: this.height_ ? this.height_ : '2rem'
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
