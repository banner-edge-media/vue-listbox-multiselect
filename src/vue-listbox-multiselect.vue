<template>
  <div>
    <v-menu offset-y
            :close-on-content-click="false"
            style="max-width: unset !important;"
            :content-class="contentClass"
    >
      <template v-slot:activator="{ on, attrs }">
        <div
                v-bind="attrs"
                v-on="on"
                class="listBox-multi-select-input"
        >
          <div v-if="loading">
            <v-progress-circular
                    :size="20"
                    color="primary"
                    indeterminate
            ></v-progress-circular>
          </div>
          <div v-if="!loading" v-bind:class="{caret: true, active: attrs['aria-expanded'] === 'true'}"></div>
          <div v-if="!loading" :class="{'dropdown-text': true, 'placeholder': !selected.length}">{{dropDownText}}</div>
        </div>
      </template>
      <v-text-field
              label="Search"
              append-icon="fas fa-search"
              class="search"
              v-model="query"
              hide-details
              value=""
              v-if="!hideSearch"
      ></v-text-field>
      <div class="d-flex justify-start container">
        <div>
          <div class="label">Available</div>
          <v-list class="panel">
            <v-list-item
                    v-for="item in list"
                    :key="item.id"
                    :disabled="item.isGroup"
                    v-bind:class="{ active: item.selected, group: item.isGroup, subItem: item.isSubItem}"
                    @click="clickedUnselected(item.id, $event)"
            >
              <v-list-item-title>{{item.value}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
        <div class="flex-column d-flex justify-center">
          <div class="ma-1"><v-icon @click="moveToSelected()">mdi mdi-chevron-right</v-icon></div>
          <div class="ma-1"><v-icon @click="moveToUnSelected()">mdi mdi-chevron-left</v-icon></div>
          <div class="ma-1"><v-icon @click="moveToSelectedAll()">mdi mdi-chevron-double-right</v-icon></div>
          <div class="ma-1"><v-icon @click="moveToUnSelectedAll()">mdi mdi-chevron-double-left</v-icon></div>
        </div>
        <div>
          <div class="label">Selected</div>
          <v-list class="panel">
            <v-list-item
                    v-for="item in selected"
                    :key="item.id"
                    :disabled="item.isGroup"
                    v-bind:class="{ active: item.selected, group: item.isGroup, subItem: item.isSubItem}"
                    @click="clickedSelected(item.id, $event)"
            >
              <v-list-item-title>{{item.value}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { VBtn, VIcon, VList, VListItem, VListItemTitle, VMenu, VProgressCircular, VTextField } from 'vuetify/lib';

  const Component = Vue.extend({
    name: 'Dashboard',
    props: ['value', 'searchFunction', 'placeholder', 'size', 'hideSearch'],
    components: { VBtn, VList, VMenu, VListItem, VListItemTitle, VTextField, VProgressCircular, VIcon },
    data() {
      return {
        list: [] as any[],
        selected: [] as any[],
        clickedHandler: 0,
        loading: false,
        query: '',
        searchHandle: 0,
      }
    },
    mounted() {
      this.clear();
    },
    watch: {
      async query() {
        if (this.searchHandle) {
          clearTimeout(this.searchHandle);
        }

        this.searchHandle = window.setTimeout(async () => {
          await this.search(this.query);
        }, this.query ? 400 : 0);
      },
    },
    methods: {
      async search(query: string) {
        this.loading = true;
        const items = await this.searchFunction(query);
        this.list = [];
        items.forEach((x: any) => {
          this.list.push({
            id: x.id, value: x.value, group: x.group, selected: false,
          });
        });
        this.list = this.sort(this.list);
        this.loading = false;
      },
      async clear() {
        await this.search('');

        this.selected = [];
        if (this.value) {
          this.value.forEach((x: any) => {
            this.selected.push({
              id: x.id, value: x.value, group: x.group, selected: false,
            });
          });
        }

        this.list = this.sort(this.list);
        this.selected = this.sort(this.selected);
      },
      sort(list: any[]) {
        const groupBy = list.reduce((acc: any, curr: any) => {
          if (!curr.isGroup) {
            if (!acc[curr.group]) {
              acc[curr.group] = [];
            }
            acc[curr.group].push(curr);
          }
          return acc;
        }, {});

        let tempList: any[] = [];

        if (Object.keys(groupBy).length === 1 && Object.keys(groupBy)[0] === 'undefined') {
          tempList = tempList.concat(groupBy.undefined);
          tempList = tempList.sort((a: any, b: any) => {
            if (a.value.toLowerCase() < b.value.toLowerCase()) {
              return -1;
            }

            return 1;
          });
        } else {
          let sortedKeys = Object.keys(groupBy);

          sortedKeys = sortedKeys.sort((a, b) => {
            if (a.toLowerCase() < b.toLowerCase()) {
              return -1;
            }

            return 1;
          });

          sortedKeys.forEach((g: string) => {
            const label = g === 'undefined' ? 'None' : g;
            tempList.push({ id: label, value: label, isGroup: true });
            groupBy[g].forEach((x: any) => {
              x.isSubItem = true;
            });

            groupBy[g] = groupBy[g].sort((a: any, b: any) => {
              if (a.value.toLowerCase() < b.value.toLowerCase()) {
                return -1;
              }

              return 1;
            });
            tempList = tempList.concat(groupBy[g]);
          });
        }

        return tempList;
      },
      moveToUnSelected() {
        const selected = this.selected.filter((x) => x.selected);

        if (selected.length) {
          const notSelected = this.selected.filter((x) => !x.selected);
          this.list = this.sort(this.list.concat(selected));
          this.selected = this.sort(notSelected);

          const response = this.selected.filter((x: any) => !x.isGroup).map((x: any) => ({
            id: x.id,
            value: x.value,
            group: x.group,
          }));

          this.$emit('input', response);
        }
      },
      moveToSelected() {
        const selected = this.list.filter((x) => x.selected);

        if (selected.length) {
          const notSelected = this.list.filter((x) => !x.selected);
          this.selected = this.sort(this.selected.concat(selected));
          this.list = this.sort(notSelected);

          const response = this.selected.filter((x: any) => !x.isGroup).map((x: any) => ({
            id: x.id,
            value: x.value,
            group: x.group,
          }));

          this.$emit('input', response);

          if (!this.list.length) {
            this.search(this.query);
          }
        }
      },
      moveToSelectedAll() {
        this.selected.forEach((x: any) => {
          x.selected = false;
        });

        this.list.forEach((x: any) => {
          x.selected = true;
        });

        this.moveToSelected();
      },

      moveToUnSelectedAll() {
        this.list.forEach((x: any) => {
          x.selected = false;
        });

        this.selected.forEach((x: any) => {
          x.selected = true;
        });

        this.moveToUnSelected();
      },
      clickedUnselected(id: any, event: MouseEvent) {
        this.selected.forEach((x: any) => {
          x.selected = false;
        });

        this.list.forEach((x: any) => {
          if (event.ctrlKey) {
            if (x.id === id) {
              x.selected = !x.selected;
            }
          } else {
            x.selected = x.id === id;
          }
        });

        if (event.ctrlKey) {
          return;
        }

        if (!this.clickedHandler) {
          this.clickedHandler = window.setTimeout(() => {
            this.clickedHandler = 0;
          }, 300);
        } else {
          clearTimeout(this.clickedHandler);
          this.clickedHandler = 0;
          this.moveToSelected();
        }
      },
      clickedSelected(id: any, event: MouseEvent) {
        this.list.forEach((x: any) => {
          x.selected = false;
        });

        this.selected.forEach((x: any) => {
          if (event.ctrlKey) {
            if (x.id === id) {
              x.selected = !x.selected;
            }
          } else {
            x.selected = x.id === id;
          }
        });

        if (event.ctrlKey) {
          return;
        }

        if (!this.clickedHandler) {
          this.clickedHandler = window.setTimeout(() => {
            this.clickedHandler = 0;
          }, 300);
        } else {
          clearTimeout(this.clickedHandler);
          this.clickedHandler = 0;
          this.moveToUnSelected();
        }
      },
    },
    computed: {
      contentClass() {
        let contentClass = 'listBox-multi-select-menu';
        switch(this.size) {
          case 'medium':
            contentClass += ' medium';
            break;
          case 'large':
            contentClass += ' large';
            break;
          case 'x-large':
            contentClass += ' x-large';
            break;
        }

        return contentClass;
      },
      dropDownText() {
        const a = this.selected as any[];
        if (a.length === 1) {
          return a[0].value;
        }

        if (a.length > 1) {
          return `${a.filter((x) => !x.isGroup).length} selected`;
        }

        return this.placeholder || 'None';
      },
    },
  });

  export default Component;
</script>

<style>
  .listBox-multi-select-menu {
    max-width: 366px !important;
    min-width: 366px !important;
    background-color: white !important;
  }

  .listBox-multi-select-menu.container {
    background-color: white;
  }

  .listBox-multi-select-menu .label {
    font-size:13px;
  }
  .listBox-multi-select-menu .panel {
    border: 1px solid #ccc !important;
    border-radius: 4px;
    width: 155px !important;
    max-width: unset !important;
    height: 200px;
    overflow-y: scroll;
    overflow-x: scroll;
  }

  .listBox-multi-select-menu .panel::-webkit-scrollbar {
    width: 5px;
  }
  .listBox-multi-select-menu .panel::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }

  .listBox-multi-select-menu .panel .v-list-item {
    min-height:25px;
    padding: 0 5px;
    float: left;
    min-width: 100%;
  }

  .listBox-multi-select-menu .panel .v-list-item__title {
    overflow: unset;
    font-size:13px;
  }

  .listBox-multi-select-menu .panel .v-list-item.group {
    font-weight:bold;
  }

  .listBox-multi-select-menu .panel .v-list-item.subItem {
    padding-left: 10px;
  }

  .listBox-multi-select-menu .panel .v-list-item.active {
    background-color: #1976d2 !important;
    color: white !important;
  }
  .listBox-multi-select-menu .panel .v-list-item.active .v-list-item__title {
    color: white !important;
  }

  .listBox-multi-select-input {
    border: 1px solid rgba(0,0,0,.42);
    padding: 10px;
    min-height: 40px;
    border-radius: 4px;
    position: relative;
  }
  .listBox-multi-select-input:hover, .listBox-multi-select-input:focus {
    border-color: rgba(0,0,0,1);
  }

  .listBox-multi-select-input .caret {
    position: absolute;
    width: 40px;
    height: 38px;
    right: 1px;
    top: 1px;
    padding: 4px 4px;
    text-align: center;
    transition: transform .2s ease;
  }

  .listBox-multi-select-input .caret.active {
    transform: rotate(180deg);
  }

  .listBox-multi-select-input .caret:before {
    position: relative;
    right: 0;
    top: 65%;
    color: #999;
    margin-top: 4px;
    border-color: #999 transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    content: "";
  }

  .listBox-multi-select-input .dropdown-text {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: calc(100% - 25px);
  }

  .listBox-multi-select-input .dropdown-text.placeholder {
    color: #9e9e9e !important;
    font-weight: normal;
    font-size:14px;
  }

  .listBox-multi-select-menu .search {
    background-color: white;
    padding-top: 8px;
    padding-left: 12px;
    padding-right: 8px;
    font-size:13px
  }

  .listBox-multi-select-menu .search .v-icon {
    font-size: 13px;
  }

  .listBox-multi-select-menu .search .v-label {
    font-size: 13px;
  }

  @media screen and (min-width: 500px) {
    .listBox-multi-select-menu.medium,
    .listBox-multi-select-menu.large,
    .listBox-multi-select-menu.x-large {
      max-width: 486px !important;
      min-width: 486px !important;
    }

    .listBox-multi-select-menu.medium .panel,
    .listBox-multi-select-menu.large .panel,
    .listBox-multi-select-menu.x-large .panel {
      width: 215px !important;
    }
  }

  @media screen and (min-width: 700px) {
    .listBox-multi-select-menu.large,
    .listBox-multi-select-menu.x-large {
      max-width: 666px !important;
      min-width: 666px !important;
    }

    .listBox-multi-select-menu.large .panel,
    .listBox-multi-select-menu.x-large .panel {
      width: 305px !important;
    }
  }

  @media screen and (min-width: 900px) {
    .listBox-multi-select-menu.x-large {
      max-width: 816px !important;
      min-width: 816px !important;
    }

    .listBox-multi-select-menu.x-large .panel {
      width: 380px !important;
    }
  }
</style>
