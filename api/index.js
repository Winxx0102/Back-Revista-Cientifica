const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const expressApp = express();
let isInitialized = false;

module.exports = async (req, res) => {
  if (!isInitialized) {
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    await nestApp.init();
    isInitialized = true;
  }
  return expressApp(req, res);
};