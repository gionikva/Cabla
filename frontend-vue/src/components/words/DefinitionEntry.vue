<template>
  <div class="text-left def-list mx-4">
    <p>
      {{ normalizeDef(definitionArray[0].text) }}
    </p>
    <v-expand-transition>
      <div v-if="expanded">
        <p
          :class="{ litem: index !== 0 }"
          v-for="(definitionObject, index) in definitionArray.slice(1)"
          :key="definitionObject.text"
        >
          {{ normalizeDef(definitionObject.text) }}
        </p>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { capitalize, toArray } from "../../shared/utils";
export default {
  name: "DefinitionEntry",
  props: ["definitionArray", "partOfSpeech", "expanded"],
  mounted() {
    console.log("definitionArray:", this.processedArray);
  },
  
  methods: {
    capitalize,
    toArray,
    
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
