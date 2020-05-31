<template>
  <v-card class="word-card" height="100%">
    <v-row
      max-width="100%"
      align="center"
      justify="space-between"
      no-gutters
      class="card-title mx-4 flex-nowrap top-row"
    >
      <div class="title textColor--text text-no-wrap " width="100%">
        {{ word.title }}
      </div>

      <v-spacer></v-spacer>
      <v-tooltip open-delay="500" bottom>
        <template v-slot:activator="{ on }">
          <v-btn :disabled="!expandable" width="3rem" height="3rem" icon v-on="on" @click="expanded = !expanded">
            <v-icon class="expandButton" :class="{ expanded: expanded }">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <span>{{ expanded ? "Show less" : "Show more" }}</span>
      </v-tooltip>
    </v-row>

    <v-tabs height="2.2rem" show-arrows max-width="5rem" center-active hide-slider v-model="currentTab" class="tabs">
      <v-tab class="tab" v-for="tab in tabs" :key="tab">
        {{ tab }}
      </v-tab>
    </v-tabs>
    <v-window v-model="currentTab" class="elevation-0 v-window">
      <v-window-item continuous class="v-window-item" v-for="tab in tabs" :key="tab">
        <DefinitionEntry :expanded="expanded" :definitionArray="wordDefinition[tab]" :partOfSpeech="tab" />
      </v-window-item>
    </v-window>

    <v-col class="text-left">
      <v-row align="end" class="flex-nowrap text-left ma-2">
        <div class="padding"></div>
      </v-row>
    </v-col>

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
import { capitalize, toArray } from "../../shared/utils";
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
      currentTab: 0,
      expanded: false,
      wordDefinition: this.processDefinition(this.word.definition),
    };
  },
  computed: {
    secondaryIcon() {
      if (this.collection.toLowerCase().match(/archived/)) {
        return "mdi-arrow-up-bold-box";
      } else {
        return "mdi-arrow-down-bold-box";
      }
    },
    tabs() {
      let entries = Object.entries(this.wordDefinition);
      entries.sort((entry1, entry2) => {
        return toArray(entry1[1]).length > toArray(entry2[1]).length ? -1 : 1;
      });
      return entries.map((entry) => entry[0]); //.map((pos)=> contractions[pos] ? contractions[pos] : pos);
    },
    expandable() {
      return this.wordDefinition[this.tabs[this.currentTab]].length > 1;
    },
  },
  methods: {
    ...mapActions("words", ["removeWord", "archiveWord", "unarchiveWord"]),
    toArray,
    filterDefinitionArray(definitionArray, limit = 100) {
      let returnArray = [];
      let srcDicts = {};
      definitionArray.forEach((definitionObject) => {
        if (definitionObject.sourceDictionary in srcDicts) {
          srcDicts[definitionObject.sourceDictionary] += 1;
        } else {
          srcDicts[definitionObject.sourceDictionary] = 1;
        }
        if (srcDicts[definitionObject.sourceDictionary] <= limit) {
          returnArray.push(definitionObject);
        }
      });
      return returnArray;
    },
    limitDefinitions(definitionArray, limit = 5) {
      let newArray = [...definitionArray];
      newArray = newArray.slice(0, limit);
      return newArray;
    },
    processDefinitionArray(definitionArray) {
      const filteredArray = this.filterDefinitionArray(definitionArray, 3);
      const limitedArray = this.limitDefinitions(filteredArray, 6);
      return limitedArray;
    },
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
    processDefinition(definitionData) {
      const definition = {};
      Object.entries(definitionData).forEach(
        (defEntry) => (definition[defEntry[0]] = this.processDefinitionArray(toArray(defEntry[1])))
      );
      return definition;
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
.expandButton {
  transition: ease-in-out;
}

.expanded {
  transform: rotate(180deg); /* Equal to rotateZ(45deg) */
}

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

.action-buttons {
  position: absolute;
  bottom: 1rem;
  right: 1.72rem;
}

.spacer {
  width: 100%;
}

.padding {
  height: 1rem;
  width: 10rem;
}
</style>
