#!/bin/bash

name=$1
npm run typeorm -- -d ./typeorm.config.ts migration:generate ./src/migrations/$name 

