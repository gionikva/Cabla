<template>
  <div class="text-left def-list mx-4">
    <template v-if="partOfSpeech !== 'verb'">
      <p :class="{litem: index !== 0}" v-for="(definitionObject, index) in processDefinitionArray(definitionArray)" :key="definitionObject.text">
        {{ normalizeDef(definitionObject.text) }}
      </p>
    </template>
    <template v-else>
      <template v-if="definitionArray.transitive && definitionArray.intransitive">
        <p
          class="litem"
          v-for="definitionObject in processDefinitionArray(definitionArray.transitive)"
          :key="definitionObject.text"
        >
          {{ normalizeDef(definitionObject.text) }}
        </p>
        <!-- <v-list-item
          class="def-list"
          v-for="definitionObject in processDefinitionArray(definitionArray.transitive)"
          :key="definitionObject.text"
        >
          <v-list-item-content height="1rem" align="left">
            <p>{{ normalizeDef(definitionObject.text) }}</p>
          </v-list-item-content>
        </v-list-item> -->
        <p
          class="litem"
          v-for="definitionObject in processDefinitionArray(definitionArray.intransitive)"
          :key="definitionObject.text"
        >
          {{ normalizeDef(definitionObject.text) }}
        </p>
      </template>

      <template v-else-if="definitionArray.transitive">
        <p
          class="litem"
          v-for="definitionObject in processDefinitionArray(definitionArray.transitive)"
          :key="definitionObject.text"
        >
          {{ normalizeDef(definitionObject.text) }}
        </p>
      </template>

      <template v-else>
        <p
          class="litem"
          v-for="definitionObject in processDefinitionArray(definitionArray.intransitive)"
          :key="definitionObject.text"
        >
          {{ normalizeDef(definitionObject.text) }}
        </p>
      </template>
    </template>
  </div>
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
    limitDefinitions(definitionArray, limit = 5) {
      let newArray = [...definitionArray];
      newArray = newArray.slice(0, limit);
      /*  newArray.sort((defObject1, defObject2) => {
        defObject1.text.length > defObject2.text.length ? -1 : 1 
      }); */
      return newArray;
    },
    processDefinitionArray(definitionArray) {
      const filteredArray = this.filterDefinitionArray(definitionArray, 3);
      const limitedArray = this.limitDefinitions(filteredArray, 3);
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

<style lang="scss" scoped>

.list-item {
  height: 0%;
}
.def-list {
  display: grid;
  grid-template-columns: 1fr;
}
</style>
