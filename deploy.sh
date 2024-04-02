#!/bin/bash

# Load environmen variable from `.env` file
source .env

# Compiles bot binary
bun build ./src/index.ts --compile --outfile leetcode-bot  
bun build ./src/cronjob.ts --compile --outfile update-problem-index

# Run bot as daemon through `pm2` utility
pm2 start --name "zen-leetcode-ds-bot" leetcode-bot
pm2 start --name "update-leetcode-problem-index" update-problem-index --cron "*/1 * * * *"