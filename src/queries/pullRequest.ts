// Define the GraphQL query to fetch the user's last 100 comments
export const query: string = `
    query ($username: String!){
      user(login: $username) {
        pullRequests(last:100) {
          edges {
            node {
              url
              permalink
              bodyText
              author {
                login
              }
              mergedAt
              closedAt
              number
              comments (last:100) {
                edges {
                  node {
                    author {
                      login
                    }
                    url
                    body
                  }
                }
              }
            }
          }
        }
      }
    }`;
