require('module-alias/register');
import * as functions from 'firebase-functions';
import { auth } from '@/plugins/firebase';
import { statusCode } from '@/types/statusCode';

import express from 'express';

require('express-async-errors');

exports.info = require('@/controllers/infos');
exports.blog = require('@/controllers/blog');
exports.nds = require('@/controllers/nds');
exports.api = require('@/controllers/api');
exports.user = require('@/controllers/user');
