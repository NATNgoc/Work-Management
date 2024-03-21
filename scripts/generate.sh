#!/bin/bash

name=$1
npm run typeorm -- -d ./typeOrm.config.ts migration:generate ./src/migrations/$name
