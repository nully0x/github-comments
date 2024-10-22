export const query: string = `
query ($username: String!, $since: DateTime!, $until: DateTime!) {
  user(login: $username) {
    issueComments(last: 100, since: $since, until: $until) {
      nodes {
        issue {
          author {
            login
          }
        }
        body
        repository {
          url
        }
        url
        createdAt
        author {
          login
        }
      }
    }
  }
}
`;
