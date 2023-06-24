import express from 'express';
import controllerAssets from '../controllers/assets';
import controllerOffers from '../controllers/offers';
const router = express.Router();

router.get('/init', controllerAssets.initLedger);
router.get('/all', controllerAssets.getAllAssets);
router.get('/create/producer/:lat/:lon', controllerAssets.createProducerAsset);
router.get('/create/consumer/:lat/:lon', controllerAssets.createConsumerAsset);
router.get('/create/energy/:amount', controllerAssets.createAsset);
router.get('/create/ecoin/:amount', controllerAssets.createEcoin);
router.get('/create/offer/:maxAmount/:price/:effectiveDate', controllerOffers.createOffer);
router.get('/update/producer/:prod', controllerAssets.updateProducerAsset);
router.get('/update/consumer/:recv', controllerAssets.updateConsumerAsset);
router.get('/offers', controllerOffers.getAllOffers);
router.get('/exist/:id', controllerOffers.assetExists);
router.get('/ecoins/:user', controllerOffers.getEcoinsOf);

export = router;