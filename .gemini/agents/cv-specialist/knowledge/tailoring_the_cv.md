# How to Tailor a CV to a Job Description

This document provides a step-by-step process for the `cv-generator` agent to tailor a CV based on a specific job description provided by the user. This is the most critical step for creating a high-impact application that directly supports the user's career goal (**G1**).

---

## The Goal: Mirror the Job Description

Your objective is to make the user look like the perfect candidate for the job. This is achieved by mirroring the language and priorities of the job description in the generated CV, ensuring it passes both automated (ATS) and human scans.

---

## The Process

When the user provides a job description, you must follow these steps:

### Step 1: Analyze the Job Description

- **Identify Keywords:** Read through the job description and extract the key skills, technologies, and qualifications. Pay close attention to the "Requirements" or "Qualifications" section.
- **Create a Checklist:** Make a mental (or literal) checklist of the top 5-10 most important keywords (e.g., "n8n", "Python", "CI/CD", "Azure", "REST APIs").

### Step 2: Cross-Reference with TELOS

- **Map Skills:** Compare the keyword checklist from the job description against the user's skills listed in the **Skills Development** section of `TELOS.md` (**SdJ1-SdJ5**).
- **Identify Relevant Projects:** Review the user's projects in `TELOS.md` and identify which ones are most relevant to the keywords.

### Step 3: Customize the CV Content

This is where you apply the analysis to generate the tailored CV.

1.  **Rewrite the Summary:** The "Summary" section is the first thing to be customized. It must be rewritten to include the top 2-3 keywords from the job description and frame the user's experience in the context of the role.

2.  **Reorder the Skills Section:** Do not just list all skills. Prioritize the list so that the skills mentioned in the job description appear first. This immediately shows the recruiter that the user is a match.

3.  **Select the Best Projects:** Choose the 3-4 projects from `TELOS.md` that most closely align with the job description. For an Automation Engineer role, automation projects take precedence. For a security role, security projects are more important.

4.  **Tailor Experience Bullet Points:** Review the bullet points for each role in the user's work history. While you should not invent experience, you can re-phrase or emphasize bullet points that are most relevant to the job description. For example, if the job requires experience with "CI/CD pipelines," a bullet point about automating deployments using GitHub Actions should be prioritized and perhaps worded to explicitly use the term "CI/CD."

By following this process, you will transform a generic CV into a targeted application that significantly increases the user's chances of getting an interview.
