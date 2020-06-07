<template>
  <div class="rdiv">
    <template v-if="offline">
      <div class="title textColor--text">
        Looks like your device is offline. Please connect to the internet to use this application.
      </div>
    </template>
    <template v-else>
      <template v-if="user">
        <template v-if="viewType == 'words'">
          <WordList :key="collection" :words="words" :collection="collection" />
          <Footer :collection="collection" />
        </template>
        <template v-else-if="viewType == 'test'">
          <Test />
        </template>
        <template v-else-if="viewType == 'collections'"> 
          <CollectionList :collections="subCollections" />
          <FAB />
        </template>

        <div class="title textColor--text" v-if="searching && words.length == 0">No Results</div>
      </template>

      <template v-else>
        <div class="display-1 text-center textColor--text">Please sign in</div>
      </template>
    </template>
  </div>
</template>

<script>
import WordList from "../components/words/WordList";
import FAB from "../components/FAB";
import CollectionList from '../components/collections/CollectionList'
import Test from "../components/test/Test";
import Footer from "../components/Footer";
import { mapGetters } from "vuex";
import { onMobile } from "../shared/utils";

export default {
  name: "CollectionView",
  components: {
    WordList,
    Footer,
    Test,
    CollectionList,
    FAB,
  },
  data() {
    return {
      onMobile,
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
    },
  },

  computed: {
    viewType() {
      let lastRoute = this.collection
        .toLowerCase()
        .split("/")
        .slice(-1)[0];
      console.log("collection:", this.collection)
      if (this.collection.replace(/^\/+|\/+$/g, "")=='collections'){
         return "collections";
      }
      else if (lastRoute !== "test" && lastRoute !== "collections") {
        return "words";
      } else {
        return lastRoute;
      }
    },
    offline() {
      return !navigator.onLine;
    },
    ...mapGetters("words", {
      archivedWords_: "getArchivedWords",
      words: "getWords",
      subCollections: "getCollections",
      searching: "getSearching",
    }),
    ...mapGetters("auth", {
      user: "getUser",
      signInStarted: "getSignInStarted",
    }),
  },

  props: ["collection"],
};
</script>

<style lang="scss" scoped>

</style>
