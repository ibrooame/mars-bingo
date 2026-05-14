module.exports = {
  apps: [
    {
      name: 'mars-bingo-live',
      script: 'server/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '250M',
      autorestart: true,
      exp_backoff_restart_delay: 1000,
      env: { NODE_ENV: 'production' },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      time: true
    }
  ]
};
