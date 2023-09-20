import express from 'express';
import controllerAssets from '../controllers/assets';
import controllerOffers from '../controllers/offers';
const router = express.Router();

// gets
router.get('/all', controllerAssets.getAllAssets);
router.get('/offers', controllerOffers.getAllOffers);
router.get('/peerContracts', controllerOffers.getPeerContract);
router.get('/ecoins/:user', controllerOffers.getEcoinsOf);

// posts

router.post('/producer/create/:lat/:lon', controllerAssets.createProducerAsset);
router.post('/producer/update/:prod', controllerAssets.updateProducerAsset);
router.post('/ecoin/create/:amount', controllerAssets.createEcoin);
router.post('/offer/create/:maxAmount/:price/:effectiveDate', controllerOffers.createOffer);
router.post('/ecoin/unify', controllerAssets.unifyEcoinAsset);
router.post('/consumer/create/:lat/:lon', controllerAssets.createConsumerAsset);
router.post('/contracts/create/:offerId', controllerOffers.createContract);
router.post('/peerContracts/create', controllerOffers.createPeerContract);
router.post('/peerContracts/addContract/:contractId', controllerOffers.addPeerContract);

// patches
router.patch('/consumer/update/:recv', controllerAssets.updateConsumerAsset);

router.get('/exist/:id', controllerOffers.assetExists);


// router.get('/energy/create/:amount', controllerAssets.createAsset);

export = router;