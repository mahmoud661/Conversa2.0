import { execSync } from "child_process";
import chalk from "chalk";

const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

const validPatterns = [
  /^main$/,
  /^feature\/[a-z0-9\-]+$/,
  /^bugfix\/[a-z0-9\-]+$/,
  /^hotfix\/[a-z0-9\-]+$/,
];

const isValid = validPatterns.some((pattern) => pattern.test(branch));

if (!isValid) {
  console.error(`
${chalk.red.bold("❌ Invalid branch name:")} "${chalk.yellow(branch)}"

${chalk.green.bold("✅ Use one of the following formats:")}
   ${chalk.cyan("•")} ${chalk.bold("feature/")}${chalk.blue(
    "your-feature-name"
  )}
   ${chalk.cyan("•")} ${chalk.bold("bugfix/")}${chalk.blue("your-bugfix-name")}
   ${chalk.cyan("•")} ${chalk.bold("hotfix/")}${chalk.blue("your-hotfix-name")}

${chalk.magenta.bold("ℹ Example:")} feature/add-user-authentication

${chalk.bgRed.white.bold(" ERROR ")} ${chalk.red(
    "Your branch name does not follow the naming convention!"
  )}
`);
  process.exit(1);
}

// Add a fancy box around the success message
const boxTop = chalk.green("┌" + "─".repeat(50) + "┐");
const boxBottom = chalk.green("└" + "─".repeat(50) + "┘");

console.log(`
${boxTop}
${chalk.green("│")}  ${chalk.green.bold(
  "✅ Branch name validation passed!"
)}${" ".repeat(20)}${chalk.green("│")}
${chalk.green("│")}  ${chalk.cyan("•")} Current branch: ${chalk.yellow(
  branch
)}${" ".repeat(Math.max(0, 29 - branch.length))}${chalk.green("│")}
${chalk.green("│")}  ${chalk.cyan("•")} Status: ${chalk.green(
  "Valid"
)}${" ".repeat(38)}${chalk.green("│")}
${boxBottom}
`);
