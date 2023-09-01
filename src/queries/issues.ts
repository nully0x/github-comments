//Define query for comments on issues by the user

export const query: string = `
    query ($username: String!){
        user(login: $username) {
            issues (last:100){
                edges{
                  node{
                    body
                    number
                    url
                    bodyUrl
                    comments(last:100){
                      edges{
                        node{
                          body
                          url
                        }
                      }
                    }
                  }
                }
            }
        }
    }`;
