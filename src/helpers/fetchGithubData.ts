import axios from "axios";

export async function fetchGitHubData(username: string, query: string) {
    try {
      const response = await axios.post(
        "https://api.github.com/graphql",
        {
          query,
          variables: { username },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );
  
      if (response.data.errors) {
        throw new Error("GraphQL error");
      }
  
      return response.data.data.user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error("Error fetching user data from GitHub");
    }
  }