import { Router, Request, Response } from "express";
import axios from "axios";
import { query } from "../queries/issues";

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
      const issues = response.data.data.user.issues;
      res.send(issues)
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data from GitHub" });
  }
});

export default router;
