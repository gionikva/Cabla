<template>
  <div>
      <WordRender v-bind:collection="'Default'" :key="'words'" />

    <AddWord />
  </div>
</template>

<script>
import AddWord from "../components/AddWord";
import WordRender from "../components/WordRender";

export default {
  name: "Words",
  components: {
    WordRender,
    AddWord
  }
};
</script>

<style>
</style>