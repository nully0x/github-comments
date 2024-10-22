// Define the GraphQL query to fetch the user's last 100 comments
export const query: string = `
query($username: String!, $from: DateTime, $to: DateTime, $cursor: String) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      pullRequestContributions(first: 100, after: $cursor) {
        edges {
          cursor
          node {
            pullRequest {
              title
              repository {
                url
              }
              totalCommentsCount
              merged
              mergedAt
              closed
              url
              closedAt
              createdAt
              mergedBy {
                login
              }
            }
          }
        }
      }
    }
  }
}`;
