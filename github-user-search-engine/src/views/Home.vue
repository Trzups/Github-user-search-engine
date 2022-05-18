<template>
  <div class="home">
    <div>
      <div>
        <h1>GtHub user search</h1>
      </div>
      <SearchUser @user="getUserRepo" />
    </div>
  </div>
  <br />
  <div v-if="showTable">
    <div class="row">
      <div class="d-flex justify-content-center">
        <div>
          <h3>{{ repoUser[0].owner.login }}</h3>
          <figure class="image mb-6">
            <img class="avatar" v-bind:src="repoUser[0].owner.avatar_url" />
          </figure>
        </div>
      </div>
    </div>

    <div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Name repository</th>
            <th scope="col">Stars</th>
          </tr>
        </thead>
        <tbody v-for="item in paginatedItems" :key="item">
          <tr>
            <td>
              <strong>{{ item.name }}</strong>
            </td>
            <td>
              {{ item.stargazers_count }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="overflow-auto">
        <b-pagination
          v-model="currentPage"
          class="d-flex justify-content-center"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
        <p class="mt-3">Current Page: {{ currentPage }}</p>
      </div>
    </div>
  </div>
  <div v-if="errorMessage">
    <strong class="alert alert-danger">{{ errorMessage }}</strong>
  </div>
</template>

<script>
import axios from "axios";
import SearchUser from "@/components/SearchUser.vue";

export default {
  name: "Home",
  components: { SearchUser },
  data() {
    return {
      repoUser: [],
      showTable: false,
      errorMessage: "",
      perPage: 10,
      currentPage: 1,
      startPage: 0,
    };
  },
  computed: {
    rows() {
      return this.repoUser.length;
    },
    paginatedItems() {
      if (this.currentPage == 1) {
        return this.repoUser.slice(this.startPage, this.perPage);
      } else {
        return this.repoUser.slice(
          (this.currentPage - 1) * this.perPage,
          this.currentPage * this.perPage
        );
      }
    },
  },
  methods: {
    getUserRepo(user) {
      this.currentPage = 1;
      let loader = this.$loading.show();
      let reposUser = `https://api.github.com/users/${user.login}/repos`;
      axios
        .get(reposUser)
        .then((response) => {
          setTimeout(() => {
            loader.hide();
          }, 2000);
          this.repoUser = response.data;
          this.showTable = true;
          this.errorMessage = "";
        })
        .catch((error) => {
          this.showTable = false;
          this.errorMessage = " Error repositories does not exist";
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 200px;
  height: 200px;
}
</style>
