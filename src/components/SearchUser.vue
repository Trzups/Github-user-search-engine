<template>
  <div>
    <form @submit.prevent="onSubmit()">
      <div class="search">
        <SimpleTypeahead
          ref="search"
          id="typeahead_id"
          :placeholder="options.placeholder"
          :minInputLength="options.minInputLength"
          :items="results"
          @selectItem="selectItem"
          @onInput="onInput"
          :itemProjection="
            (item) => {
              return item.login;
            }
          ">
          <template #list-item-text="slot">
            <span
              v-html="slot.boldMatchText(slot.itemProjection(slot.item))"></span
          ></template>
        </SimpleTypeahead>
        <br />
        <div>
          <button type="submite" class="search-button">Search</button>
        </div>
        <br />
        <div v-if="errorMessage">
          <strong class="alert alert-danger">{{ errorMessage }}</strong>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import SimpleTypeahead from "vue3-simple-typeahead";
import "vue3-simple-typeahead/dist/vue3-simple-typeahead.css";

export default {
  name: "SearchUser",
  components: {
    SimpleTypeahead,
  },
  data() {
    return {
      options: {
        placeholder: "Search a Github user",
        minInputLength: 1,
      },
      data: {
        selectUser: null,
      },
      results: [],
      errorMessage: "",
      debounce: null,
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.search.input == 0) {
        return (this.errorMessage = "Enter the user");
      }
      this.$emit("user", this.$refs.search.input);
      this.data.selectUser = null;
      this.results = [];
    },
    selectItem(item) {
      this.data.selectUser = item;
      this.data.input = item;
      this.onSubmit();
    },
    onInput(event) {
      this.errorMessage = "";
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.data.input = event.input;
        let userGit = `https://api.github.com/search/users?q=${this.data.input}in:user&per_page=100`;
        axios
          .get(userGit)
          .then((response) => {
            this.results = response.data.items;
          })
          .catch(() => {
            console.error("Invalid token");
          });
      }, 500);
    },
  },
};
</script>
<style>
input {
  background-color: #4c2885;
  border-radius: 10px;
  border: none;
  box-shadow: 0 5px 10px rgba(154, 160, 185, 0.05),
    0 15px 40px rgba(0, 0, 0, 0.1);
  color: white;
  font-size: 1rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

input::placeholder {
  color: #bbb;
}

input:focus {
  outline: none;
}
.search {
  display: flex;
}
.search-button {
  color: red;
  border-radius: 10px;
  border: none;
  padding: 1rem;
  margin-bottom: 2rem;
  font-family: inherit;
}
#typeahead_id {
  color: white;
  width: 400px;
  margin-right: 20px;
}
.simple-typeahead-list-item {
  color: black;
}

.simple-typeahead-list-item.simple-typeahead-list-item-active {
  background-color: red;
}
.simple-typeahead
  .simple-typeahead-list
  .simple-typeahead-list-item.simple-typeahead-list-item-active {
  background-color: aqua;
}
</style>
