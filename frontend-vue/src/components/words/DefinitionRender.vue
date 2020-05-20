<template>
  <div>
    <v-expansion-panels
      color
      flat
      :hover="true"
      class="def-list elevation-0"
      :accordion="true"
      :multiple="true"
      :tile="true"
      v-model="expandedArray"
      dense
    >
      <v-expansion-panel
        color="background"
        v-for="(definitionArray, partOfSpeech, i) in definition"
        :key="i"
      >
        <v-expansion-panel-header
          color="background"
          class="font-weight-bold"
          v-bind:class="{ 'primary--text': !(expandedArray.indexOf(i) < 0),
             'secondary--text': (expandedArray.indexOf(i) < 0) }"
        >&#8226; {{normalizePos(partOfSpeech, definitionArray)}}</v-expansion-panel-header>
        <v-expansion-panel-content class="def-list" color="background">
          <template v-if="partOfSpeech !== 'verb'">
            <v-list dense class="def-list" color="background">
              <v-list-item
                height="1rem"
                class="def-list list-item"
                v-for="(definitionObject ,i) in processDefinitionArray(definitionArray)"
                :key="i"
              >
                <v-list-item-content height="1rem" align="left">
                  <p>{{normalizeDef(definitionObject.text)}}</p>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
          <template v-else>
            <v-list dense class="def-list" color="background">
              <template v-if="definitionArray.transitive && definitionArray.intransitive">
                <div class="accent--text verb-type" align="left">Transitive:</div>
                <v-list-item
                  class="def-list"
                  v-for="(definitionObject ,i) in processDefinitionArray(definitionArray.transitive)"
                  :key="i"
                >
                  <v-list-item-content height="1rem" align="left">
                    <p>{{normalizeDef(definitionObject.text)}}</p>
                  </v-list-item-content>
                </v-list-item>
                <div class="accent--text verb-type" align="left">Intransitive:</div>
                <v-list-item
                  class="def-list"
                  v-for="(definitionObject ,i) in processDefinitionArray(definitionArray.intransitive)"
                  :key="i"
                >
                  <v-list-item-content height="1rem" align="left">
                    <p>{{normalizeDef(definitionObject.text)}}</p>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <template v-else-if="definitionArray.transitive">
                <v-list-item
                  class="def-list"
                  v-for="(definitionObject ,i) in processDefinitionArray(definitionArray.transitive)"
                  :key="i"
                >
                  <v-list-item-content height="1rem" align="left">
                    <p>{{normalizeDef(definitionObject.text)}}</p>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <template v-else>
                <v-list-item
                  class="def-list"
                  v-for="(definitionObject ,i) in processDefinitionArray(definitionArray.intransitive)"
                  :key="i"
                >
                  <v-list-item-content height="1rem" align="left">
                    <p>{{normalizeDef(definitionObject.text)}}</p>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- <template v-else>
      <v-list class="def-list" multiple dense justify="start">
        <v-list-item v-for="(definitionArray, partOfSpeech, i) in definition" :key="i">
          <v-list-item-content>
            <v-list-item-title class="d-flex justify-start">{{partOfSpeech}}</v-list-item-title>
            <v-list>
              <v-list-item v-for="(definitionObject ,i) in definitionArray" :key="i">
                <v-list-item-content align="left">{{normalizeDef(definitionObject.text)}}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>-->
  </div>
</template>

<script>
import { capitalize } from "../../utils/utils";
export default {
  name: "DefinitionRender",
  props: ["definition", "compact", "title"],
  data() {
    return {
      expandedArray: []
    };
  },
  created() {
    if (this.compact == "") {
      for (const i of Array(2).keys()) {
        this.expandedArray.push(i);
      }
    }
  },
  methods: {
    capitalize,

    filterDefinitionArray(definitionArray, limit = 100) {
      let returnArray = [];
      let srcDicts = {};
      definitionArray.forEach(definitionObject => {
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
    limitDefinitions(definitionArray, limit = 3) {
      let newArray = [...definitionArray];
      newArray.sort((defObject1, defObject2) => {
        if (defObject1.text.length > defObject2.text.length) {
          return -1;
        } else {
          return 1;
        }
      });
      return newArray.slice(0, limit);
    },
    processDefinitionArray(definitionArray) {
      const filteredArray = this.filterDefinitionArray(definitionArray, 3);
      const limitedArray = this.limitDefinitions(filteredArray);
      return limitedArray;
    },
    normalizePos(pos, array) {
      if (pos !== "verb") {
        return capitalize(pos);
      } else {
        if (array.transitive && array.intransitive) {
          return "Verb";
        } else if (array.transitive) {
          return "Transitive Verb";
        } else {
          return "Intransitive Verb";
        }
      }
    },
    normalizeDef(string) {
      if (string) {
        const tagsRemoved = string.trim().replace(/<[^>]+>/g, "");
        return tagsRemoved.slice(0, 1).toUpperCase() + tagsRemoved.slice(1);
      }
    }
  }
};
</script>

<style scoped>
.list-item {
  line-height: 2rem;
}
.pos-def-list {
  padding: 0;
  margin: 0;
}
.def-list {
  padding: 0;
  margin: 0;
}
.v-item--active {
  background: red;
}

</style>