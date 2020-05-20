<template>
  <div>
    <v-card flat tile>
      <v-card-title class="card-title  font-weight-bold">{{word.title}}</v-card-title>
      <DefinitionRender :definition='word.definition' />
      <v-card-actions>
        <v-btn icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DefinitionRender from '../components/definitions/DefinitionRender';
export default {
  name: "FullscreenWord",
  components:{
    DefinitionRender
  },
  methods: {
    getWordByTitle(title) {
      return this.words.filter(word => word.title === title)[0];
    }
  },
  computed: {
    ...mapGetters("firebase", { words: "getWords" }),
    word() {
      return this.getWordByTitle(this.$route.params.word);
    }
  }
};
</script>

<style>
</style>