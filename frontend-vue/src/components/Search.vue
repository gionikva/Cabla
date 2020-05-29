<template>
  <div class="d-flex flex-row align-center search-bar-col">
    <form @submit.prevent="search(title.trim())">
      <v-text-field
        class="search fab-bar"
        v-model="title"
        height="2rem"
        width="1rem"
        @click:append="search(title.trim())"
        append-icon="mdi-magnify"
        @click:prepend-inner="title = ''"
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
      titleData: "",
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
      if (this.title !== this.waitingTitle) {
        await this.search(this.title);
        this.waitingTitle = this.title;
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
    title: {
      set(value) {
        this.titleData = value;
        if (value == "") {
          this.search("");
        }
      },
      get() {
        return this.titleData;
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
