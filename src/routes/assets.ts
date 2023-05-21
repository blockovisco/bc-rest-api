import express from 'express';
import controller from '../controllers/assets';
import controllerOffers from '../controllers/offers';
const router = express.Router();

router.get('/init', controller.initLedger);
router.get('/all', controller.getAllAssets);
router.get('/create/energy/:amount', controller.createAsset);
router.get('/offers', controllerOffers.getAllOffers);

export = router;