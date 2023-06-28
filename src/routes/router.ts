import express from 'express';
import controllerAssets from '../controllers/assets';
import controllerOffers from '../controllers/offers';
const router = express.Router();

router.get('/init', controllerAssets.initLedger);
router.get('/all', controllerAssets.getAllAssets);
router.get('/producer/create/:lat/:lon', controllerAssets.createProducerAsset);
router.get('/producer/update/:prod', controllerAssets.updateProducerAsset);
router.get('/consumer/create/:lat/:lon', controllerAssets.createConsumerAsset);
router.get('/consumer/update/:recv', controllerAssets.updateConsumerAsset);
router.get('/energy/create/:amount', controllerAssets.createAsset);
router.get('/ecoin/create/:amount', controllerAssets.createEcoin);
router.get('/offer/create/:maxAmount/:price/:effectiveDate', controllerOffers.createOffer);
router.get('/offers', controllerOffers.getAllOffers);
router.get('/contracts/create/:offerId', controllerOffers.createContract);
router.get('/peerContracts/create', controllerOffers.createPeerContract);
router.get('/peerContracts', controllerOffers.getPeerContract);
router.get('/peerContracts/addContract/:contractId', controllerOffers.addPeerContract);
router.get('/exist/:id', controllerOffers.assetExists);
router.get('/ecoins/:user', controllerOffers.getEcoinsOf);
router.get('/ecoin/unify', controllerAssets.unifyEcoinAsset);

export = router;