import { checkOAuthData } from './../middleware/checkOAuthData';
import {
	oAuthGithubController,
	oAuthGithubLinkController,
} from './../controllers/oauth/github';
import {
	oAuth42Controller,
	oAuth42LinkController,
} from './../controllers/oauth/42';
import { Router } from 'express';

const oAuthRouter = Router();

oAuthRouter.get('/42-link', oAuth42LinkController);
oAuthRouter.get('/github-link', oAuthGithubLinkController);

oAuthRouter.get('/42', checkOAuthData, oAuth42Controller);
oAuthRouter.get('/github', checkOAuthData, oAuthGithubController);

export default oAuthRouter;
