<template>
  <div>
    <template v-if="offline">
      <div class="title textColor--text">
        Looks like your device is offline.
        Please connect to the internet to use this application.
      </div>
    </template>
    <template v-else>
      <template v-if="user ">
        <div class="title textColor--text" v-if="searching && words.length ==0">No Results</div>
        <template v-else>
          <WordList :key="collection" :words="words" :collection="collection" />
        </template>
      </template>

      <template v-else>
        <div class="display-1 text-center textColor--text">Please sign in</div>
      </template>

      <Footer :collection="collection" />
    </template>
  </div>
</template>

<script>
import WordList from "../components/words/WordList";
import Footer from "../components/Footer";
import { mapGetters } from "vuex";
import { onMobile } from "../utils/utils";
export default {
  name: "CollectionView",
  components: {
    WordList,
    Footer
  },
  data() {
    return {
      onMobile
    };
  },
  methods: {
    splitWords(words, wordsPerPage = 10) {
      let pagesArray = [[]];
      let i = 0;
      let pageIndex = 0;
      for (let word of words) {
        if (i == wordsPerPage) {
          i = 0;
          pageIndex++;
          pagesArray[pageIndex] = [];
        }
        pagesArray[pageIndex].push(word);
        i++;
      }
      return pagesArray;
    }
  },

  computed: {
    offline() {
      return !navigator.onLine;
    },
    ...mapGetters("words", {
      archivedWords_: "getArchivedWords",
      words: "getWords",
      subCollections: "getCollections",
      searching: "getSearching"
    }),
    ...mapGetters("auth", {
      user: "getUser",
      signInStarted: "getSignInStarted"
    })
  },

  props: ["collection"]
};
</script>

<style>
</style>