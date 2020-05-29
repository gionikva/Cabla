<template>
  <section class="root-div">
    <div class="banner">
      <div class="inside-img">
        <div flat tile class="overlay-card">
          <div class="banner-title textColor--text" align="left">Cabla</div>
          <div
            class="banner-text textColor--text"
            align="left"
          >A simple digtal vocabulary and word learning application made for english students.</div>
        </div>
        <v-row class="actions">
          <router-link class='link' to="/words">
            <v-btn class="button-words" height="3rem" width="10rem">Words</v-btn>
          </router-link>
        </v-row>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style scoped>
.button-words {
  font-size: 110%;
}

.banner-title {
  font-size: 6vmax;
}
.banner-text {
  font-size: 2rem;
}
.root-div {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.banner {
  filter: opacity(100%);
  grid-column: 1/3;
  height: 68%;
}
.inside-img {
  position: absolute;
  top: 0;
  background: skyblue;
  right: 0;
  left: 0;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  grid-template-rows: repeat(4, 1fr) auto;
  /* align-items: center; */
}

.actions {
  height: 5rem;
  grid-column: 2;
  grid-row: 5;
}

.overlay-card {
  grid-row: 2;
  grid-column: 2;
}

img {
  grid-column: 1/4;
  object-fit: cover;
  width: 100%;
  height: 100%;
  filter: brightness(70%);
}
</style>
