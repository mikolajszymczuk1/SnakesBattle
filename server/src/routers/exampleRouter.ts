import express, { type Router } from 'express';
import { pingAction } from '@/controllers/exampleController';

const exampleRouter: Router = express.Router();

exampleRouter.get('/ping', pingAction);

export default exampleRouter;
