<script lang="ts">
import Vue from 'vue';
import VueListboxMultiselect from '@banneredge/vue-listbox-multiselect';
import dataSet from './states';

export default Vue.extend({
  name: 'Basic',
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
      let subset = dataSet.filter((x) => !ids.includes(x.abbreviation));

      if (query) {
        const q = query.toLowerCase();
        subset = subset.filter((x) => x.abbreviation.toLowerCase().includes(q)
          || x.name.toLowerCase().includes(q));
      }

      return subset.map((x: any) => ({
        id: x.abbreviation,
        value: x.name,
      }));
    },
  },
});
</script>

<template>
  <div>
    <h2 id="basic">Basic</h2>
    <ul>
      <li>Flat List</li>
      <li>Default Size</li>
      <li><a href="https://github.com/banner-edge-media/vue-listbox-multiselect/blob/master/demo/src/components/Basic.vue"
             target="_blank">View Code</a></li>
    </ul>
    <br/>
    <div class="model">Model: {{selectedList}}</div>
    <br/>
  <vue-listbox-multiselect
    v-model="selectedList"
    :search-function="search"
    placeholder="Search States"
  />
</div>
</template>
