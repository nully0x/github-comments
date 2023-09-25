import { Router, Request, Response } from "express";
import { query } from "../queries/pullRequest";
import { fetchGitHubData } from "../helpers/fetchGithubData";
import { DAYS_TO_INACTIVE, CURRENT_DAY, ONE_DAY } from "../helpers/constants"

const router = Router();

router.get("/pulls", async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username || "") {
    res.status(400).json({ error: "Missing username" });
  }

  try {
    const prData = await fetchGitHubData(username, query);

    //Open & active (total comments on PR, days since opening)
    const openPRs = prData.pullRequests.edges.filter(
      (pr: any) => pr.node.closed === false
    );

    const openPRsData = openPRs.map((pr: any) => ({
      totalComments: pr.node.totalCommentsCount,
      daysSinceOpening: Math.floor(
        (CURRENT_DAY - new Date(pr.node.createdAt).getTime()) /
          (ONE_DAY)
      ),
      url: pr.node.url,
      repoUrl: pr.node.repository.url,
      prTitle: pr.node.title
    }));

    // Open & inactive -- idle for 30 days (total comments on PR, days since opening)
    const openInactivePRs = openPRs.filter(
      (pr: any) =>
        Math.floor(
          (CURRENT_DAY - new Date(pr.node.createdAt).getTime()) /
            ONE_DAY
        ) > DAYS_TO_INACTIVE
    );

    const openInactivePRsData = openInactivePRs.map((pr: any) => ({
      totalComments: pr.node.totalCommentsCount,
      daysSinceOpening: Math.floor(
        (CURRENT_DAY - new Date(pr.node.createdAt).getTime()) /
          (ONE_DAY)
      ),
      prUrl: pr.node.url,
      repoUrl: pr.node.repository.url,
      prTitle: pr.node.title
    }));

    // Closed by author (total comments on PR, days open to close)
    const closedPRs = prData.pullRequests.edges.filter(
      (pr: any) => pr.node.closed === true && pr.node.merged === false
    );

    const closedPRsData = closedPRs.map((pr: any) => ({
      totalComments: pr.node.totalCommentsCount,
      daysOpenToClose: Math.floor(
        (new Date(pr.node.closedAt).getTime() -
          new Date(pr.node.createdAt).getTime()) /
          (ONE_DAY)
      ),
      prUrl: pr.node.url,
      repoUrl: pr.node.repository.url,
      prTitle: pr.node.title
    }));

    // Closed by others (total comments on PR, days open to close)
    const closedPRsByOthers = prData.pullRequests.edges.filter(
      (pr: any) => pr.node.closed === true && pr.node.merged === true && pr.node.mergedBy.login !== username
    );

    const closedPRsByOthersData = closedPRsByOthers.map((pr: any) => ({
      totalComments: pr.node.totalCommentsCount,
      daysOpenToClose: Math.floor(
        (new Date(pr.node.closedAt).getTime() -
          new Date(pr.node.createdAt).getTime()) /
          (ONE_DAY)
      ),
      prUrl: pr.node.url,
      repoUrl: pr.node.repository.url,
      prTitle: pr.node.title
    }));

    // Merged (total comments on PR, days open to merge)
    const mergedPR = prData.pullRequests.edges.filter(
      (pr: any) => pr.node.merged === true
    );

    const mergedPRData = mergedPR.map((pr: any) => ({
      totalComments: pr.node.totalCommentsCount,
      daysOpenToMerge: Math.floor(
        (new Date(pr.node.mergedAt).getTime() -
          new Date(pr.node.createdAt).getTime()) /
          (ONE_DAY)
      ),
      prUrl: pr.node.url,
      repoUrl: pr.node.repository.url,
      prTitle: pr.node.title
    }));

    res.status(200).json({
      openPRs: openPRsData,
      openInactivePRs: openInactivePRsData,
      closedPRs: closedPRsData,
      closedPRsByOthers: closedPRsByOthersData,
      mergedPRData: mergedPRData,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user data from GitHub" });
    throw new Error(error);
  }
});

export default router;
