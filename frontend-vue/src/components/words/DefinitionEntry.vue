<template>
  
  <v-list dense class="def-list" color="background">
    <template v-if="partOfSpeech !== 'verb'">
      <v-list-item
        class="def-list list-item"
        v-for="definitionObject in processDefinitionArray(definitionArray)"
        :key="definitionObject.text"
      >
        <v-list-item-content class='list-item' align="left">
          <p>{{ normalizeDef(definitionObject.text) }}</p>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-else>
      <template
        v-if="definitionArray.transitive && definitionArray.intransitive"
      >
        
        <v-list-item
          class="def-list"
          v-for="definitionObject in processDefinitionArray(
            definitionArray.transitive
          )"
          :key="definitionObject.text"
        >
          <v-list-item-content height="1rem" align="left">
            <p>{{ normalizeDef(definitionObject.text) }}</p>
          </v-list-item-content>
        </v-list-item>
         
        <v-list-item
          class="def-list"
          v-for="definitionObject in processDefinitionArray(
            definitionArray.intransitive
          )"
          :key="definitionObject.text"
        >
          <v-list-item-content height="1rem" align="left">
            <p>{{ normalizeDef(definitionObject.text) }}</p>
          </v-list-item-content>
        </v-list-item>
      </template>

      <template v-else-if="definitionArray.transitive">
        <v-list-item
          class="def-list"
          v-for="definitionObject in processDefinitionArray(
            definitionArray.transitive
          )"
          :key="definitionObject.text"
        >
          <v-list-item-content height="1rem" align="left">
            <p>{{ normalizeDef(definitionObject.text) }}</p>
          </v-list-item-content>
        </v-list-item>
      </template>

      <template v-else>
        <v-list-item
          class="def-list"
          v-for="definitionObject in processDefinitionArray(
            definitionArray.intransitive
          )"
          :key="definitionObject.text"
        >
          <v-list-item-content height="1rem" align="left">
            <p>{{ normalizeDef(definitionObject.text) }}</p>
          </v-list-item-content>
        </v-list-item>
      </template>
    </template>
  </v-list>
</template>

<script>
import { capitalize } from "../../utils/utils";
export default {
  name: "DefinitionEntry",
  props: ["definitionArray", "partOfSpeech"],
  methods: {
    capitalize,

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
    },
  },
};
</script>

<style lang='scss' scoped>
.list-item{
  height: 0%
}
.def-list{
  height: 50%
}
</style>
