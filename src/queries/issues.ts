//Define query for comments on issues by the user
export const query: string = `
    query ($username: String!){
        user(login: $username) {
          issueComments(last: 100) {
            nodes {
              issue {
                author{
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
    }`;