<template>
  <div class="about">
    <div class="grid">
      <v-tabs hide-slider v-model="currentTab" class="tabs">
        <v-tab v-for="tab in tabs" :key="tab">
          {{ tab }}
        </v-tab>
      </v-tabs>
      <p class='textColor--text'>Lorem, ipsum.</p>
    </div>

    <div class="display-2 textColor--text">This is an about page</div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      currentTab: 0,
      tabs: ["adjective", "noun", "verb", "adverb", "idiom", "interjection"],
    };
  },
});
</script>

<style lang="css" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
</style>
