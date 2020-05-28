<template>
  <div>
    <v-window v-model="currentPage" class="ma-2">
      <v-window-item continuous>

        
      </v-window-item>
      <v-window-item continuous v-for="page in pages" :key="page">

        <TestPage :pageType='page' />
      </v-window-item>
    </v-window>
    <v-spacer></v-spacer>
    <v-row class="bottom-actions ma-1">
      <v-btn color="decline" class="mx-2">Quit Test</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="accent" class="mx-2">Go Back</v-btn>
      <v-btn color="accent">Next Word</v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Test",
  props: ["words", "collection"],
};
</script>

<style lang="scss" scoped>
.bottom-actions {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  left: 0.5rem;
}
</style>
