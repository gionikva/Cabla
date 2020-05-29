<template>
  <v-card class="word-card" height="100%">
    <v-row
      max-width="100%"
      align="center"
      justify="space-between"
      no-gutters
      class="card-title mx-4 flex-nowrap top-row"
    >
      <div class="title textColor--text text-no-wrap " width="100%">{{ word.title }}</div>

      <v-spacer></v-spacer>
      <!--  <v-btn :loading="loading" class="archive-button" width="3rem" height="3rem" @click="secondaryAction(word)" icon>
        <v-icon size="2rem">{{ secondaryIcon }}</v-icon>
      </v-btn>

      <v-btn class="delete-button" width="3rem" height="3rem" @click="removeWord({ word, collection })" icon>
        <v-icon size="2rem">mdi-delete</v-icon>
      </v-btn> -->
      <v-btn width="3rem" height="3rem" icon @click="expanded = !expanded">
        <v-icon v-if="!expanded">mdi-chevron-down</v-icon>
        <v-icon v-else>mdi-chevron-up</v-icon>
      </v-btn>
    </v-row>
    <v-expand-transition>
      <div v-show="expanded">
        <!-- <v-divider class='mx-4'></v-divider> -->
        <v-tabs
          height="2.2rem"
          show-arrows
          max-width="5rem"
          center-active
          hide-slider
          v-model="currentTab"
          class="tabs"
        >
          <v-tab class="tab" v-for="tab in tabs" :key="tab">
            {{ tab }}
          </v-tab>
        </v-tabs>

        <v-window v-if="Object.entries(word.definition).length > 1" v-model="currentTab" class="elevation-0 v-window">
          <v-window-item continuous class="v-window-item" v-for="tab in tabs" :key="tab">
            <DefinitionEntry :definitionArray="word.definition[tab]" :partOfSpeech="tab" />
          </v-window-item>
        </v-window>
        <DefinitionEntry v-else :definitionArray="word.definition[tabs[0]]" :partOfSpeech="tabs[0]" />
      </div>
    </v-expand-transition>

    <v-row align="end" class="flex-nowrap text-left ma-4">
      <p v-if="!expanded">{{ normalizeDef(word.definition[tabs[0]]) }}</p>
      <div class="padding"></div>

      <!-- <v-spacer></v-spacer> -->
    </v-row>
    <v-row class="action-buttons bottom-actions ">
      <v-btn :loading="loading" class="archive-button" width="3rem" height="3rem" @click="secondaryAction(word)" icon>
        <v-icon size="2rem">{{ secondaryIcon }}</v-icon>
      </v-btn>

      <v-btn class="delete-button" width="3rem" height="3rem" @click="removeWord({ word, collection })" icon>
        <v-icon size="2rem">mdi-delete</v-icon>
      </v-btn>
    </v-row>
  </v-card>
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

  data: () => ({
    loading: false,
    currentTab: 0,
    expanded: false,
  }),
  computed: {
    secondaryIcon() {
      if (this.collection.toLowerCase().match(/archived/)) {
        return "mdi-arrow-up-bold-box";
      } else {
        return "mdi-arrow-down-bold-box";
      }
    },
    tabs() {
      let entries = Object.entries(this.word.definition);
      entries.sort((entry1, entry2) => {
        return entry1[1].length > entry2[1].length ? -1 : 1;
      });
      return entries.map((entry) => entry[0]); //.map((pos)=> contractions[pos] ? contractions[pos] : pos);
    },
  },
  methods: {
    ...mapActions("words", ["removeWord", "archiveWord", "unarchiveWord"]),
    normalizeDef(defObject) {
      if (defObject.transitive) {
        let string = defObject.transitive[0].text;
        const tagsRemoved = string.trim().replace(/<[^>]+>/g, "");
        return tagsRemoved.slice(0, 1).toUpperCase() + tagsRemoved.slice(1);
      } else if (defObject.intransitive) {
        let string = defObject.intransitive[0].text;
        const tagsRemoved = string.trim().replace(/<[^>]+>/g, "");
        return tagsRemoved.slice(0, 1).toUpperCase() + tagsRemoved.slice(1);
      } else {
        let string = defObject[0].text;
        const tagsRemoved = string.trim().replace(/<[^>]+>/g, "");
        return tagsRemoved.slice(0, 1).toUpperCase() + tagsRemoved.slice(1);
      }
    },
    async secondaryAction(word) {
      this.loading = true;
      if (this.collection.toLowerCase().match(/archived/)) {
        await this.unarchiveWord(word);
      } else {
        await this.archiveWord(word);
      }
    },
    capitalize,
  },
};
</script>

<style scoped lang="scss">
.tabs {
  background: red;
}

.card-title {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.v-window-item {
  padding: 0;
  margin: 0;
}

.word-card {
  animation: fadein 0.5s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.top-row {
  //margin: 0;
  //padding: 0;
  //height: 2rem;
  //background: red;
}

.action-buttons {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

.spacer {
  width: 100%;
}

.padding {
  height: 2em;
  width: 10rem;
}
/*
.tabs {
  position: absolute;
  width: 50%;
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
} */
</style>
