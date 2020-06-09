<template>
  <v-dialog v-model="value" max-width="30rem">
    <a id="downloadAnchorElem" style="display:none"></a>
    <v-card>
      <v-card-title v-if="mode === 'export'">Export {{ currentCollection.name }}</v-card-title>
      <v-card-title v-if="mode === 'import'">Import Collection'</v-card-title>
      <v-card-text v-if="mode === 'import'">
        <v-file-input v-model="file" ref="fileInput" class="mx-2" label="Select Collection File"> </v-file-input>
      </v-card-text>
      <v-card-text class='text-left' v-if="mode === 'export'">
        Click "Export" to download the exported collection
      </v-card-text>

      <!-- <v-card-text>
        <form @submit.prevent="onSubmit">
          <v-text-field color="primary" autofocus v-model="title" placeholder="Enter Word"></v-text-field>
        </form>
      </v-card-text> -->
      <v-card-actions align="left">
        <v-spacer></v-spacer>
        <v-btn @click="value = false" text color="accent">Cancel</v-btn
        ><v-btn
          v-if="mode === 'import'"
          @click="
            value = false;
            importItems();
          "
          text
          color="accent"
          >Import</v-btn
        >

        <v-btn
          v-if="mode == 'export'"
          @click="
            value = false;
            exportItems();
          "
          text
          color="accent"
          >Export</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>



<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ImportExport",
  data() {
    return {
      mode: "export",
      value: false,
      fileText: "",
      file: null,
    };
  },
  computed: {
    ...mapGetters("words", {
      words: "getWords",
      currentCollection: "getCurrentCollection",
    }),
  },
  methods: {
    ...mapActions("words", ["batchAdd"]),
    open(mode) {
      this.mode = mode;
      this.value = true;
    },
    exportItems() {
      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(
          JSON.stringify({
            collection: this.currentCollection,
            words: this.words,
          })
        );
      var dlAnchorElem = document.getElementById("downloadAnchorElem");
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", `${this.currentCollection.name} Collection.json`);
      dlAnchorElem.click();
    },
    async importItems() {
      if (this.file && this.file.type === "application/json") {
        await this.batchAdd({
          collection: this.currentCollection.path,
          words: JSON.parse(await this.file.text()).words,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-input {
  width: 20rem;
}
</style>
