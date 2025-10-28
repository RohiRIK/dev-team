# Docker Volume Backup Strategies

This document outlines strategies for backing up Docker volumes to ensure data persistence and portability for your home lab. This is a critical practice to solve the challenges of having a non-portable lab (**Pr13**) and needing a clear backup strategy (**C16**).

---

## 1. What to Back Up

A complete backup strategy involves more than just the data. You must back up two key components:

1.  **Configuration (The "How"):** These are your `docker-compose.yml` files, environment variables, and any other configuration that defines your stacks. 
2.  **Data (The "What"):** This is the persistent data stored in your Docker named volumes (e.g., your n8n database, your Ghost blog's content).

**Connection to TELOS:**
- Your strategy **S10** explicitly states the goal: "back everything up to my personal GitHub repository." The **Configuration** files are perfect for Git, as they are text-based and benefit from version control. The **Data** (volume backups) can be stored as artifacts in GitHub Releases or managed separately.

---

## 2. Backup Methods

### Method 1: The Manual `tar` Command (for Quick Backups)

This method uses a temporary container to create a `.tar` archive of a volume.

**Best Practice:** This is good for quick, one-off backups. To run it, first identify the name of the volume with `docker volume ls`.

**Command:**
```bash
# This command backs up 'my_volume' into a file named 'my_volume_backup.tar' in the current directory.
docker run --rm -v my_volume:/data -v $(pwd):/backup busybox tar cvf /backup/my_volume_backup.tar /data
```

**Connection to TELOS:**
- While simple, this manual process doesn't align with your goal to automate repetitive tasks (**N23**). It should be used for emergencies or testing, not as a primary strategy.

### Method 2: Dedicated Backup Container (The Automated Approach)

This is the recommended approach for a serious home lab. It involves running a dedicated container whose job is to perform backups automatically on a schedule.

**Best Practice:** Use a well-maintained backup image like `offen/docker-volume-backup`. This tool can be configured with environment variables to back up specified volumes, run on a cron schedule, and even encrypt the backups and send them to offsite storage.

**Connection to TELOS:**
- This method aligns perfectly with your goal to be an AI Automations Engineer (**G1**, **SdJ1**). Setting up an automated, reliable backup system is a professional-grade solution.
- It helps you build the resilient, "Swiss Army knife" home lab you envision (**N28**) because backups happen automatically without your intervention.

---

## 3. Best Practices for a Resilient Home Lab

1.  **Automate Everything:** Your primary backup strategy should be fully automated. Manual backups are easily forgotten. This is a core principle of automation (**N23**).

2.  **Store Config in Git:** All your `docker-compose.yml` files should be in a GitHub repository. This is the most important step to making your lab portable (**S10**). If your server fails, you can check out the repository on a new machine, and all your stack definitions are there.

3.  **Separate Config and Data:** Your Git repository should contain your compose files (the **Configuration**), but not the large `.tar` backup files of your volumes (the **Data**). The data backups should be stored separately (e.g., on a NAS, a separate disk, or in cloud storage).

4.  **Test Your Restores:** A backup strategy is useless if you've never tested a restore. Periodically, you should practice spinning up a service on a test machine using only your backups. This ensures your strategy works and gives you peace of mind.
