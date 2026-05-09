module.exports = {
  apps: [
    {
      name: "backend",
      script: "index.js",
      cwd: "/var/www/ahm-fragrance/backend",
      instances: 1,
      exec_mode: "fork",
      autorestart: true
    }
  ]
};
