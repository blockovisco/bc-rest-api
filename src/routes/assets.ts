import express from 'express';
import controller from '../controllers/assets';
import controllerOffers from '../controllers/offers';
const router = express.Router();

router.get('/init', controller.initLedger);
router.get('/all', controller.getAllAssets);
router.get('/create/energy/:amount', controller.createAsset);
router.get('/create/ecoin/:amount', controller.createEcoin);
router.get('/create/offer/:amount/:price', controllerOffers.createOffer);
router.get('/offers', controllerOffers.getAllOffers);
router.get('/exist/:id', controllerOffers.assetExists);
router.get('/ecoins/:user', controllerOffers.getEcoinsOf);

export = router;