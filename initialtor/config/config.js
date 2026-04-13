module.exports = {
  packages: [
    {
      name: "Visual Studio Code",
      check: "code --version",
      cmd: "winget install -e --id Microsoft.VisualStudioCode",
    },
    {
      name: "Docker Desktop",
      check: "docker --version",
      cmd: "winget install -e --id Docker.DockerDesktop",
    },
    {
      name: "LibreOffice",
      check: "soffice --version",
      cmd: "winget install -e --id TheDocumentFoundation.LibreOffice",
    },
    {
      name: "Git",
      check: "git --version",
      cmd: "winget install -e --id Git.Git",
    },
    {
      name: "Firefox",
      check: "firefox --version",
      cmd: "winget install -e --id Mozilla.Firefox",
    },
    {
      name: "Node.js",
      check: "node -v",
      cmd: "winget install -e --id OpenJS.NodeJS",
    },
    {
      name: "Python",
      check: "python --version",
      cmd: "winget install -e --id Python.Python.3",
    },

    // Package managers
    {
      name: "Chocolatey",
      check: "choco -v",
      cmd: 'powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; iwr https://community.chocolatey.org/install.ps1 | iex"',
    },
    {
      name: "curl",
      check: "curl --version",
      cmd: "winget install -e --id cURL.cURL",
    },
  ],

  npmGlobals: ["opencode-ai", "yarn", "pnpm", "typescript", "nodemon"],

  projectRepo: {
    url: "https://github.com/your/repo.git", // ← add repo later
    folderName: "repo", // ← repo folder name (important)
  },

  projectCommands: [
    "npm install",
    "npx skills add JuliusBrussee/caveman",
    "npx antigravity-awesome-skills --path .agents/skills",
  ],

  downloadUrls: [],

  cleanup: {
    temp: true,
    dns: true,
    network: false,
    docker: true,
    startup: false,
  },
};
