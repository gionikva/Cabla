<template>
  <!-- <v-lazy height="100%"> -->
  <v-card class="word-card" height="100%">
    <v-card-title class="card-title ma-0">{{ word.title }}</v-card-title>
    <v-tabs hide-slider v-model="currentTab" class="tabs">
      <v-tab v-for="tab in tabs" :key="tab">
        {{ tab }}
      </v-tab>
    </v-tabs>

    <!-- <v-item-group
      v-model="selected"
      :mandatory="mandatory"
      :multiple="multiple"
    >
      <v-container class="pa-0">
        <v-row>
          <v-col
            v-for="n in 3"
            :key="n"
            cols="12"
            md="4"
          >
            <v-item v-slot:default="{ active, toggle }">
              <v-card
                v-if="type === 'cards'"
                :color="active ? 'primary' : ''"
                class="d-flex align-center"
                dark
                height="200"
                @click="toggle"
              >
                <v-scroll-y-transition>
                  <div
                    v-if="active"
                    class="display-3 flex-grow-1 text-center"
                  >
                    Active
                  </div>
                </v-scroll-y-transition>
              </v-card>
              
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group> -->


    <v-window v-model="currentTab" class="elevation-0 v-window">
      <v-window-item continuous class="v-window-item" v-for="tab in tabs" :key="tab">
        <DefinitionEntry :definitionArray="word.definition[tab]" :partOfSpeech="tab" />
      </v-window-item>
    </v-window>

    <v-card-actions class="padding">
      <template v-if="collection === 'Archived'">
        <v-btn :loading="loading" class="archive-button" width="3rem" height="3rem" @click="unarchive(word)" icon>
          <v-icon size="2rem">mdi-arrow-up-bold-box</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-btn :loading="loading" class="archive-button" width="3rem" height="3rem" @click="archive(word)" icon>
          <v-icon size="2rem">mdi-arrow-down-bold-box</v-icon>
        </v-btn>
      </template>
      <v-btn class="delete-button" width="3rem" height="3rem" @click="removeWord({ word, collection })" icon>
        <v-icon size="2rem">mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
  <!-- </v-lazy> -->
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
      currentTab: 0,
    };
  },
  computed: {
    tabs() {
      let entries = Object.entries(this.word.definition);
      entries.sort((entry1, entry2) => {
        return entry1[1].length > entry2[1].length ? -1 : 1;
      });
      return entries.map((entry) => entry[0]);
    },
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
  }
};
</script>

<style scoped lang="scss">
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

.padding {
  height: 4.2rem;
}

// .tabs {
//   position: absolute;
//   width: 50%;
//   left: 1rem;
//   bottom: 1rem;
// }

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
