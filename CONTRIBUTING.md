# Guide to Contributing

#### Team Value
We respect each other's time. If a team member says that they will complete a task by a certain day, it is important that it gets done that day. If the team member is unable to complete the task, they must voice this concern before the deadline.

Team members should ask for help when stuck. Nobody should be struggling alone for more than 1 day without reaching out on Discord.

Team members give honest but kind feedback on each other's code. No ego, no taking it personally.

Team members don't blame each other when things break. The team should fix the problem first, then discuss how to prevent it next time.

#### Conflict Resolution:
- If 2 people disagree on a technical decision (like how to build the filter system for Discover Interns), we discuss it as a team and go with majority vote. If there is a tie, the Product Owner makes the final call,
- If someone misses a deadline or doesn't deliver their task, we talk to them directly first --- maybe they're overwhelmed, or something came up. One missed deadline is human. If the same person makes no progress for 2 standups in a row, the Scrum Master reports it to the professor

#### Daily Standups
We hold standups twice a week. Each standup is 30 minutes max. Everyone answers three things: what they did, what they are doing next and if anything is blocking them.

Everyone shows up. If a member can not make it to standup, they must post their update in the Discord channel before the standup starts. We don't cover for members who skip standups without saying anything.

#### Coding Standards
We all use VS Code with ESLint and Prettier so our code looks consistent no matter who wrote it.

We don't over-engineer. Get things working end to end first, then improve. A single working version of a feature is better than a half-built complex one.

Every piece of code must be peer-reviewed through a Pull Request and pass any tests before it gets merged into main. No exceptions

Always push working code. If you break the build, you are responsible for fixing it before moving on to anything else.

Keep commits small and focused --- one commit per feature or bug fix. Write meaningful commit messages that actually describe what you did. For example, "Add city filter to discover page" is an acceptable commit message. "Update stuff" is not.

Write code that explains itself. Use clear variable and function names. For example, filterByCity instead of fbc. If someone reads your code for the first time, they should be able to understand it without asking you.

Don't leave dead code behind. If there's commented-out code sitting in a file and nobody needs it, delete it.

Write automated tests for critical functionality nce we learn how to do that.
