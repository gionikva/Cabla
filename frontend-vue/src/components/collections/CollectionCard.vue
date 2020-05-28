<template>
  <v-card>
    <v-card-title>{{ collection.title }}</v-card-title>
    <v-card-content>
      {{ collection.wordCount }}
    </v-card-content>
  </v-card>
</template>

<script>
export default {
  name: "CollectionCard",
  props: ["collection"],
};
</script>

<style></style>
