<script lang="ts">
import Vue from 'vue';
import VueListboxMultiselect from '@banneredge/vue-listbox-multiselect';
import dataSet from './usCities';

export default Vue.extend({
  name: 'Groups',
  components: {
    VueListboxMultiselect,
  },
  data() {
    return {
      selectedList: [] as any[],
    };
  },
  methods: {
    async search(query: string): Promise<any[]> {
      const ids = this.selectedList.map((x) => x.id);
      let subset = dataSet.filter((x) => !ids.includes(`${x.state}-${x.city}`));

      if (!query) {
        subset = subset.slice(0, 100);
      } else {
        const q = query.toLowerCase();
        subset = subset.filter((x) => x.city.toLowerCase().includes(q)
          || x.state.toLowerCase().includes(q));
        subset = subset.slice(0, 100);
      }

      return subset.map((x: any) => ({
        id: `${x.state}-${x.city}`,
        value: x.city,
        group: x.state,
      }));
    },
  },
});
</script>

<template>
  <div>
    <h2 id="groups">With Groups</h2>
    <ul>
      <li>Two-levels</li>
      <li>Medium Size</li>
      <li><a href="https://github.com/banner-edge-media/vue-listbox-multiselect/blob/master/demo/src/components/Groups.vue"
             target="_blank">View Code</a></li>
    </ul>
    <br/>
  <vue-listbox-multiselect
    v-model="selectedList"
    :search-function="search"
    placeholder="Search Cities"
    size="medium"
  />
  </div>
</template>
