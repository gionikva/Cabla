<template>
  <v-lazy>
    <v-card v-bind:class="{ 'dark-grad': !dark, 'white-grad': dark }" class="card" height="">
      <v-card-title>
        <v-skeleton-loader width="40%" type="card-heading"></v-skeleton-loader>
      </v-card-title>
      <v-card-text>
        <v-skeleton-loader type="article"></v-skeleton-loader>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-skeleton-loader height="6rem" width="20rem" type="card-heading"></v-skeleton-loader>
      </v-card-actions>
    </v-card>
  </v-lazy>
</template>

<script>
export default {
  name: "SkeletonCard",
  data() {
    return {
      dark: this.$vuetify.dark,
    };
  },
};
</script>

<style lang="less" scoped>
.card {
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.card.dark-grad::before {
  content: "";
  display: block;
  position: absolute;
  left: -100%;
  top: 0;
  height: 100%;
  width: 70%;
  background-image: linear-gradient(to right, transparent 0%, fadeout(#f0f0f0cb, 50%) 50%, transparent 100%);
  animation: load 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  z-index: 2;
}
.card.white-grad::before {
  content: "";

  display: block;
  position: absolute;
  left: -100%;
  top: 0;
  height: 100%;
  width: 70%;
  background-image: linear-gradient(to right, transparent 0%, fadeout(#000000bb, 50%) 50%, transparent 100%);
  animation: load 1.2s ease-in-out infinite;
  z-index: 2;
}

@keyframes load {
  from {
    left: -100%;
  }
  to {
    left: 100%;
  }
}
</style>
