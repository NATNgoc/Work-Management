#!/bin/sh

name=$1
npm run typeorm -- migration:create ./src/migrations/$name
