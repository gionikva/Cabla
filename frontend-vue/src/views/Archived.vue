<template>
  <div>
    <keep-alive>
      <WordRender :collection="'Archived'" :key="'archived'" />
    </keep-alive>
  </div>
</template>

<script>
import WordRender from "../components/WordRender";
export default {
  name: "Archived",
  components: {
    WordRender
  }
};
</script>

<style>
</style>