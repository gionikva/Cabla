<template>
  <div>
    <v-list width="100%">
      <v-subheader>Local</v-subheader>
      <v-list-item>
        <v-list-item-content>Dark Mode</v-list-item-content>
        <v-list-item-action>
          <v-switch v-model="isDark"></v-switch>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <template v-if="smallDisplay">
          <v-select
            max-width="100%"
            v-model="enabledOptions"
            :items="searchOptions"
            chips
            label="Search By"
            multiple
          ></v-select>
        </template>
        <template v-else>
          <v-list-item-content>Search By</v-list-item-content>
          <v-list-item-action max-width="2rem">
            <v-select
              min-width="1rem"
              v-model="enabledOptions"
              :items="searchOptions"
              chips
              multiple
            ></v-select>
          </v-list-item-action>
        </template>
      </v-list-item>
      <v-subheader>Synced</v-subheader>
    </v-list>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Settings",
  data() {
    return {
      searchOptions: ["title", "content"],
      smallDisplay: window.matchMedia("(max-width: 35rem)").matches,
    };
  },
  methods: {
    ...mapMutations("settings", ["setDark"]),
    ...mapMutations("settings", ["setEnabledSearchOptions"]),
  },
  computed: {
    ...mapGetters("settings", {
      dark: "getDark",
    }),
    ...mapGetters("settings", {
      enabledOptions_: "getEnabledSearchOptions",
    }),
    enabledOptions: {
      get() {
        return this.enabledOptions_;
      },
      set(options) {
        this.setEnabledSearchOptions(options);
      },
    },
    isDark: {
      get() {
        return this.dark;
      },
      set(value) {
        this.setDark(value);
      },
    },
  },
};
</script>

<style></style>
