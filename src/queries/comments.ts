// Define the GraphQL query to fetch the user's last 100 comments
export const query: string = `
    query ($username: String!){
      user(login: $username) {
        login
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
        }
        issueComments(last: 100) {
          nodes {
            body
            issue {
              author {
                login
              }
            }
          }
        }
        pullRequests(last: 100) {
          nodes {
            body
            author {
              login
            }
            merged
            state
            createdAt
          }
        }
      }
    }`;
