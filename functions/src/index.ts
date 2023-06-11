require('module-alias/register');
import * as functions from 'firebase-functions';
import { auth } from '@/plugins/firebase';
import { statusCode } from '@/types/statusCode';

exports.user = require('@/controllers/user');
exports.info = require('@/controllers/infos');
exports.blog = require('@/controllers/blog');
exports.nds = require('@/controllers/nds');
exports.api = require('@/controllers/api');
exports.ai = require('@/controllers/ai');
