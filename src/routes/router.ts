import express from 'express';
import controllerAssets from '../controllers/assets';
import controllerOffers from '../controllers/offers';
const router = express.Router();

router.get('/init', controllerAssets.initLedger);
router.get('/all', controllerAssets.getAllAssets);
router.get('/create/producer/:lat/:lon', controllerAssets.createProducerAsset);
router.get('/create/energy/:amount', controllerAssets.createAsset);
router.get('/create/ecoin/:amount', controllerAssets.createEcoin);
router.get('/create/offer/:amount/:price', controllerOffers.createOffer);
router.get('/update/producer/:prod', controllerAssets.updateProducerAsset);
router.get('/offers', controllerOffers.getAllOffers);
router.get('/exist/:id', controllerOffers.assetExists);
router.get('/ecoins/:user', controllerOffers.getEcoinsOf);

export = router;