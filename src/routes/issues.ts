import { Router, Request, Response } from "express";
import { fetchGitHubData } from "../helpers/fetchGithubData";
import { query } from "../queries/issues";

const router = Router();

router.get("/own", async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username || "") {
    res.status(400).json({ error: "Missing username" });
  }

  try {
    const issueComments = await fetchGitHubData(username, query);

    const ownComments = issueComments.issueComments.nodes.filter(
      (comment: any) => comment.issue.author.login === username
    );

    const processedComments = ownComments.map((comment: any) => ({
      body: comment.body,
      repo_url: comment.repository.url,
      url: comment.url,
      date: comment.createdAt,
    }));

    res.json(processedComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/others", async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username || "") {
    res.status(400).json({ error: "Missing username" });
  }

  try {
    const issueComments = await fetchGitHubData(username, query);

    const othersComments = issueComments.issueComments.nodes.filter(
      (comment: any) => comment.issue.author.login !== username
    );

    const processedComments = othersComments.map((comment: any) => ({
      body: comment.body,
      repo_url: comment.repository.url,
      url: comment.url,
      date: comment.createdAt,
      author: comment.issue.author.login,
    }));

    res.json(processedComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// long comments > than 500 characters
router.get("/long-comments", async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username || "") {
    res.status(400).json({ error: "Missing username" });
  }

  try {
    const longComment = await fetchGitHubData(username, query);

    const longComments = longComment.issueComments.nodes.filter(
      (comment: any) => comment.body.length > 500
    );
    
    const processedComments = longComments.map((comment: any) => ({
      body: comment.body,
      url: comment.url,
      date: comment.createdAt,
      repo_url: comment.repository.url,
      author: comment.issue.author.login
    }));

    res.json(processedComments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;