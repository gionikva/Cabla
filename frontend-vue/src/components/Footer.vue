<template>
  <div :class="{ 'on-mobile': onMobile, 'not-on-mobile': !onMobile, footer: true}">
    <div
      :class="{ 'on-mobile': onMobile, 'not-on-mobile': !onMobile}"
      v-show="!onMobile"
      ref="showArea"
      id="show-area"
    ></div>
    <v-bottom-navigation
      :class="{'hidden': navBarHidden && onMobile, 'on-mobile': onMobile, 'not-on-mobile': !onMobile}"
      ref="navBar"
      app
      v-model="nav"
      id="navbar"
      height="4rem"
      class="font-weight-medium"
    >
      <v-btn value="words">
        <span>Words</span>
        <v-icon>mdi-text-box</v-icon>
      </v-btn>

      <v-btn value="collections">
        <span>Collections</span>
        <v-icon>mdi-rhombus-split</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <AddWord v-if="$route.fullPath.toLowerCase() !== '/words/archived'" :collection="collection" />
  </div>
</template>

<script>
import AddWord from "./AddWord";
import { onMobile } from "../utils/utils";
import { mapGetters } from "vuex";
export default {
  props: ["collection"],
  data() {
    return {
      nav: "words",
      onMobile
    };
  },
  components: {
    AddWord
  },
  computed: {
    ...mapGetters("animations", {
      navBarHidden: "getNavBarHidden"
    })
  },
  methods: {},
  name: "Footer"
};
</script>

<style lang="scss" scoped>
#navbar.not-on-mobile {
  transition: bottom 0.25s;
  bottom: -4rem;
}

#navbar.on-mobile {
  transition: bottom 0.3s;
}

.hidden {
  bottom: -4rem;
}

#navbar:hover.not-on-mobile {
  bottom: 0rem;
}

#show-area {
  position: absolute;
  height: 5rem;
  bottom: 0;
  left: 0;
  right: 0;
}

.footer.not-on-mobile {
  height: 3rem;
  position: fixed;
  bottom: 0rem;
  right: 0rem;
  left: 0rem;
  z-index: 10000;
}

#show-area:hover ~ #navbar {
  bottom: 0rem;
}
</style>