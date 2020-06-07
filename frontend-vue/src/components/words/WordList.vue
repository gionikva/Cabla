<template>
  <div>
    <div class="wordlist">
      <template v-if="!bound">
        <SkeletonCard v-for="i in Array(6).keys()" :key="i" />
      </template>
      <SkeletonCard v-if="loading && collection === wordAdditionData.collection" />
      <template v-if="bound && !loading && words.length==0">
        <v-col class="textColor--text">
          <div class='text-center display-2'>Collection Empty</div>
        <div class='headline text-center'>Click '+' to add words</div>
        </v-col>
        
      </template>
      
      <WordCard dense v-bind:collection="collection" v-for="word in loadedWords" :key="word.id" v-bind:word="word" />
    </div>
    <div class="scroll-padding"></div>
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
      loadedNumber: 0,
      prevHeight: document.documentElement.scrollTop,
      lastDate: Date.now(),
    };
  },
  created() {
    this.bindCollection(this.collection);
  },
  mounted() {
    window.scrollTo(0, 0);
    this.loadGradually(16, 8, 1500);
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
    loadGradually(number, atOnce, time) {
      let x = 0;
      let intervalID = setInterval(() => {
        // Your logic here
        this.loadedNumber += atOnce;
        x += atOnce;
        if (x === number) {
          window.clearInterval(intervalID);
        }
      }, time / (number / atOnce));
    },
    onscrollCallback() {
      //let currentHeight = document.documentElement.scrollTop;
      /* if (currentHeight > this.prevHeight) {
        this.setNavBarHidden(true);
      } else {
        this.setNavBarHidden(false);
      } */
      let velocity;
      if (Date.now() - this.lastDate >= 30) {
        velocity = -(this.prevHeight - document.documentElement.scrollTop) / (Date.now() - this.lastDate);
        this.prevHeight = document.documentElement.scrollTop;
      }

      let bottomOfWindow =
        Math.abs(document.documentElement.offsetHeight - (document.documentElement.scrollTop + window.innerHeight)) <
        (velocity * 8000) + 600;
      if (bottomOfWindow && this.loadedNumber <= this.words.length) {
        // Makes sure too many words don't get loaded at once since the cards take some time to load
        if (Date.now() - this.lastDate >= 500) {
          this.loadedNumber += 12;
          this.lastDate = Date.now();
        } else {
          setTimeout(this.onscrollCallback, 200);
        }
      }
    },
    scroll() {
      window.onscroll = () => this.onscrollCallback();
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
  max-width: 100%;

  grid-template-columns: repeat(auto-fit, minmax(40rem, 1fr));
}

@media only screen and (max-width: 42rem) {
  .wordlist {
    margin-top: 4.5rem;
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 100%;
  }
}
.scroll-padding {
  height: 6rem;
}
</style>
