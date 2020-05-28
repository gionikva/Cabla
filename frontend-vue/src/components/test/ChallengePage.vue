<template>
  <div>
    <template v-if="pageType == 'intro'"> </template>
    <template v-if="pageType == 'challenge1'"> </template>
    <template v-if="pageType == 'challenge2'"> </template>
  </div>
</template>

<script>
export default {
  name: "TestPage",
  props: ["pageType"],
};
</script>

<style lang="scss" scoped></style>
