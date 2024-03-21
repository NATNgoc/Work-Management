#!/bin/bash

name=$1
npm run typeorm -- -d ./typeOrm.config.ts migration:create ./src/migrations/$name
