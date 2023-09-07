// Define the GraphQL query to fetch the user's last 100 comments
export const query: string = `
    query ($username: String!){
      user(login: $username) {
        pullRequests(last:100){
          edges{
            node{
              totalCommentsCount
              merged
              mergedAt
              closed
              url
              closedAt
              createdAt
              mergedBy{
                login
              }
            }
          }
        }
      }
    }`;
