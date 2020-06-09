<template>
  <v-row>
    <template v-for="(item, index) in items">
      <router-link class="link" :to="item.link" :key="index">
        <v-btn class="text-none ma-0" :class="{ 'primary--text': index == items.length - 1 }" text>
          {{ item.title }}
        </v-btn></router-link
      >

      <v-icon size="1rem" v-if="index < items.length - 1" :key="index + 'icon'">
        {{ delimiter }}
      </v-icon>
    </template>
  </v-row>
</template>

<script>
export default {
  name: "BreadCrumbs",
 
  methods: {
    process(items) {
      const itemArray = [];
      items.forEach((crumb, index) => {
        let delimiter = {
          icon: this.delimiter,
        };

        if (index < items.length - 1) itemArray.push(crumb, delimiter);
        else itemArray.push(crumb);
      });
      return itemArray;
    },
  },
  props: {
    items: {
      type: Array,
    },
    delimiter: {
      type: String,
    },
  },
};
</script>

<style></style>
