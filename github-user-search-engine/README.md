# GitHub User Search
## What is this?

A project built with Vue 3 and other tools to search for users and view their profiles on Github. By entering the username, we get tables with all repositories (star statistics, pull requests, commits, etc.)

## Project setup
```
Clone the repository
$ npm install
$ npm run serve
```
## API limit
The Github API has a strict limit (that's why I'm putting instructions on how to get an access token with the appropriate permissions). By running the app locally, you can export a personal access token that will be sent along with any API calls

- Login to Github
- Go to Setting -> Developer setting -> Personal access token
- Click generate new token
<img width="557" alt="Screenshot 2022-05-19 at 18 32 25" src="https://user-images.githubusercontent.com/46524169/169352513-5b17ec5e-e1c3-489f-b908-8e723394ea65.png">

- Enter name token, check the boxes and click Generate token
<img width="664" alt="Screenshot 2022-05-19 at 18 33 31" src="https://user-images.githubusercontent.com/46524169/169352566-f0ffeaff-0a14-4edd-bdd7-9563000d2b88.png">

- Now you should see a token copy it.
- In file .env you can change VUE_APP_API_GITHUB_KEY

```
VUE_APP_API_GITHUB_KEY=<your token>
```
