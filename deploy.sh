#!/bin/bash

app_name=zen-leetcode-ds-bot

# Delete current pm2 process
pm2 delete $app_name

# Load environment variable from `.env` file
source .env

# Declare variables for binary names
bot_bin_name=leetcode-bot
cronjob_bin_name=update-problem-index

# Create folder dedicated to bot
# Folders paths comes from `.env` variables
mkdir $BINARIES_FOLDER
mkdir $DATA_FOLDER

# Compiles bot binary
bun build ./src/index.ts --compile --outfile $BINARIES_FOLDER/$bot_bin_name  
bun build ./src/cronjob.ts --compile --outfile $BINARIES_FOLDER/$cronjob_bin_name

cp ./.env $DATA_FOLDER/.env
cp ./$PROBLEMS_FILE $DATA_FOLDER/$PROBLEMS_FILE
cp ./$INDEX_FILE $DATA_FOLDER/$INDEX_FILE

# Run bot as daemon through `pm2` utility
pm2 start --name "$app_name" $BINARIES_FOLDER/$bot_bin_name 