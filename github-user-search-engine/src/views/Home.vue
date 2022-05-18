<template>
  <div class="home">
    <div>
      <div>
        <h1>GtHub user search</h1>
      </div>
      <SearchUser @user="getUserRepo" />
    </div>
    <br />
    <div v-if="showTable">
      <div class="row">
        <div class="d-flex justify-content-center">
          <div>
            <h3>{{ loginUser }}</h3>
            <figure class="image mb-6">
              <img class="avatar" v-bind:src="avatarUser" />
            </figure>
          </div>
        </div>
      </div>

      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Repository</th>
              <th scope="col">Total commits</th>
              <th scope="col">Open Pull Requests</th>
              <th scope="col">Stars</th>
              <th scope="col">Watching</th>
              <th scope="col">Forks</th>
              <th scope="col">Link to repository</th>
            </tr>
          </thead>
          <tbody v-for="item in paginatedItems" :key="item">
            <tr>
              <td>
                <strong>{{ item.name }}</strong>
              </td>
              <td>
                <p v-if="item.object != null">
                  {{ item.object.history.totalCount }}
                </p>
                <p v-else>-</p>
              </td>
              <td>
                {{ item.pullRequests.totalCount }}
              </td>
              <td>
                {{ item.stargazerCount }}
              </td>
              <td>
                {{ item.watchers.totalCount }}
              </td>
              <td>
                {{ item.forks.totalCount }}
              </td>
              <td>
                <a :href="item.url">Link to Repo</a>
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
      avatarUser: "",
      loginUser: "",
      showTable: false,
      errorMessage: "",
      perPage: 10,
      currentPage: 1,
      startPage: 0,
    };
  },
  mounted() {
    document.title = "GtHub user search";
  },
  methods: {
    getUserRepo(user) {
      this.errorMessage = "";
      this.showTable = false;
      this.currentPage = 1;
      let loader = this.$loading.show();
      const query = `
    query BIO_QUERY($username: String!){
  user(login: $username) {
    repositories(first: 100) {
      totalCount
      nodes {
        object(expression: "master") {
          ... on Commit {
            history {
              totalCount
            }
          }
        }
        watchers {
          totalCount
        }
        stargazerCount
        name
        url
        forks {
          totalCount
        }
        pullRequests (states: OPEN) {
          totalCount
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    avatarUrl
    login
  }
}
          `;
      const apiGithubGraphl = "https://api.github.com/graphql";
      axios
        .post(apiGithubGraphl, {
          query: query,
          variables: {
            username: user,
          },
        })
        .then((response) => {
          setTimeout(() => {
            loader.hide();
          }, 2000);
          if (response.data.data.user != null) {
            this.repoUser = response.data.data.user.repositories.nodes;
            this.avatarUser = response.data.data.user.avatarUrl;
            this.loginUser = user;
            this.showTable = true;
            this.errorMessage = "";
          } else {
            this.showTable = false;
            console.log(response.data);
            this.errorMessage = `${response.data.errors[0].message}`;
          }
        })
        .catch((error) => {
          setTimeout(() => {
            loader.hide();
          }, 2000);
          console.log(error);
        });
    },
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
};
</script>

<style scoped>
.avatar {
  width: 200px;
  height: 200px;
}
</style>
