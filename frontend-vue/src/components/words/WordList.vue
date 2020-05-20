<template>
  <div>
    <div class="wordlist">
      <template v-if="!bound">
        <SkeletonCard v-for="i in Array(6).keys()" :key="i" />
      </template>
      <SkeletonCard
        v-if="loading && collection === wordAdditionData.collection"
      />
        <WordCard
          dense
          v-bind:collection="collection"
          v-for="word in loadedWords"
          :key="word.id"
          v-bind:word="word"
        />
    </div>
    <div class="scroll-padding"></div>
    <div class="pagination text-center"></div>
  </div>
</template>

<script>
import WordCard from "./WordCard";
import SkeletonCard from "../SkeletonCard";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "WordList",
  data() {
    return {
      getter: "getWords",
      archived: false,
      loadedNumber: 6,
    };
  },
  created() {
    this.bindCollection(this.collection);
  },
  mounted() {
    this.scroll();
    if (this.collection == "/Words/Archived") {
      this.archived = true;
    }
  },
  components: {
    WordCard,
    SkeletonCard,
  },
  computed: {
    ...mapGetters("animations", {
      loading: "getWordAdditionQueued",
      wordAdditionData: "getWordAdditionData",
    }),
    ...mapGetters("words", ["getWordsBound"]),
    bound() {
      return this.getWordsBound;
    },
    loadedWords: {
      get() {
        return this.words.slice(0, this.loadedNumber);
      },
    },
  },
  methods: {
    ...mapMutations("animations", ["setNavBarHidden"]),
    ...mapActions("words", ["bindCollection"]),
    scroll() {
      let prevHeight = document.documentElement.scrollTop;
      let lastDate = Date.now();
      window.onscroll = () => {
        let currentHeight = document.documentElement.scrollTop;
        if (currentHeight > prevHeight) {
          this.setNavBarHidden(true);
        } else {
          this.setNavBarHidden(false);
        }

        prevHeight = document.documentElement.scrollTop;
        let bottomOfWindow =
          Math.abs(
            document.documentElement.offsetHeight -
              (document.documentElement.scrollTop + window.innerHeight)
          ) < 500;
        if (bottomOfWindow && this.loadedNumber <= this.words.length) {
          // Makes sure too many words don't get loaded at once since the cards take some time to load
          if (Date.now() - lastDate >= 700) {
            this.loadedNumber += 12;
            lastDate = Date.now();
          }
        }
      };
    },
  },
  props: ["collection", "words"],
};
</script>

<style lang="scss" scoped>
.wordlist {
  margin: 1rem;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(40rem, 1fr));
}

.pagination {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 100000;
}

@media only screen and (max-width: 42rem) {
  .wordlist {
    margin-top: 4.5rem;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 1fr;
  }
}
.scroll-padding {
  height: 6rem;
}
</style>
