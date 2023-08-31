import { Router, Request, Response } from "express";
import axios from "axios";
import { query } from "../queries/comments";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { username } = req.body;

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
      // Handle GraphQL errors
      console.error("GraphQL errors:", response.data.errors);
      res.status(500).json({ error: "GraphQL error" });
    } else {
      const user = response.data.data.user;

      // Process and categorize comments
      const commentsOnOwnIssuesPRs = [];
      const commentsOnOthersIssuesPRs = [];
      const longComments = [];

      user.issueComments.nodes.forEach((comment) => {
        if (comment.body.length >= 500) {
          longComments.push(comment);
        } else if (comment.issue && comment.issue.author.login === username) {
          commentsOnOwnIssuesPRs.push(comment);
        } else {
          commentsOnOthersIssuesPRs.push(comment);
        }
      });

      // Process and categorize pull requests
      const openActivePRs = [];
      const openInactivePRs = [];
      const closedByAuthorPRs = [];
      const closedByOthersPRs = [];
      const mergedPRs = [];

      user.pullRequests.nodes.forEach((pr) => {

        //categorize open PRs as active or inactive
        if (pr.state === "OPEN") {
          const createdAt = new Date(pr.createdAt).getTime();
          const currentTime = new Date().getTime();
          const daysOpen = Math.floor(
            (currentTime - createdAt) / (1000 * 60 * 60 * 24)
          );

          if (daysOpen < 30) {
            openActivePRs.push(pr);
          } else {
            openInactivePRs.push(pr);
          }
        }
      });

      // Return the categorized data
      res.json({
        commentsOnOwnIssuesPRs,
        commentsOnOthersIssuesPRs,
        longComments,
        openActivePRs,
        openInactivePRs,
        closedByAuthorPRs,
        closedByOthersPRs,
        mergedPRs,
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data from GitHub" });
  }
});

export default router;
