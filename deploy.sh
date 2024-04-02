#!/bin/bash

# Load environmen variable from `.env` file
source .env

# Compiles bot binary
bun build ./src/index.ts --compile --outfile leetcode-bot  

# Run bot as daemon through `pm2` utility
pm2 start --name "zen-leetcode-ds-bot" leetcode-bot