<template>
      <v-lazy height="100%">

    <v-card height="100%">
      <v-card-title class="card-title">{{ word.title }}</v-card-title>
      <v-window v-model="currentTab" class="elevation-0">
        <v-window-item continuous v-for="tab in tabs" :key="tab">
          
          <DefinitionEntry
            :definitionArray="word.definition[tab]"
            :partOfSpeech="tab"
          />
        </v-window-item>
      </v-window>

      <v-card-actions class="padding">
        <v-tabs hide-slider v-model="currentTab" class="tabs">
          <v-tab v-for="tab in tabs" :key="tab">
            {{ tab }}
          </v-tab>
        </v-tabs>
        <template v-if="collection === 'Archived'">
          <v-btn
            :loading="loading"
            class="archive-button"
            width="3rem"
            height="3rem"
            @click="unarchive(word)"
            icon
          >
            <v-icon size="2rem">mdi-arrow-up-bold-box</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            :loading="loading"
            class="archive-button"
            width="3rem"
            height="3rem"
            @click="archive(word)"
            icon
          >
            <v-icon size="2rem">mdi-arrow-down-bold-box</v-icon>
          </v-btn>
        </template>
        <v-btn
          class="delete-button"
          width="3rem"
          height="3rem"
          @click="removeWord({ word, collection })"
          icon
        >
          <v-icon size="2rem">mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
      </v-lazy>
</template>

<script>
import { mapActions } from "vuex";
import { capitalize } from "../../utils/utils";
import DefinitionEntry from "./DefinitionEntry";
export default {
  name: "WordCard",
  props: ["word", "collection"],
  components: {
    DefinitionEntry,
  },

  data() {
    return {
      loading: false,
      tabs: Object.entries(this.word.definition).map((entry) => entry[0]),
      currentTab:0,
    };
  },

  methods: {
    ...mapActions("words", ["removeWord", "archiveWord", "unarchiveWord"]),

    async archive(word) {
      this.loading = true;
      await this.archiveWord(word);
    },
    async unarchive(word) {
      this.loading = true;
      await this.unarchiveWord(word);
    },
    capitalize,
  },
  watch: {
    currentTab(newVal) {
      console.log("CURRENT TAB:", newVal);
    },
  },
};
</script>

<style scoped>
.padding {
  height: 5rem;
}

.tabs {
  position: absolute;
  width: 80%;
  left: 1rem;
  bottom: 1rem;
}

.delete-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  padding: 2rem;
}

.archive-button {
  position: absolute;
  right: 5rem;
  bottom: 1rem;
  padding: 2rem;
}

.actions {
  position: absolute;
  height: 2rem;
}

.def-list {
  margin: 0;
}
</style>
