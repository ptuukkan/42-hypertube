import searchController from 'controllers/searchController';
import express from 'express';

const router = express.Router();
router.route('/').get(searchController.search);

export default router;
