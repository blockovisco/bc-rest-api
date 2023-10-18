import express from 'express';
import controllerAssets from '../controllers/assets';
import controllerOffers from '../controllers/offers';
import controllerConfig from '../controllers/config';
const router = express.Router();

// gets
router.get('/all', controllerAssets.getAllAssets);
router.get('/offers', controllerOffers.getAllOffers);
router.get('/peerContracts', controllerOffers.getPeerContract);
router.get('/ecoins/:user', controllerOffers.getEcoinsOf);
router.get('/ecoins', controllerOffers.getEcoinsOfThisUser);
router.get("/maxPrice", controllerConfig.getMaxPrice)
router.get("/minPrice", controllerConfig.getMinPrice)

// posts

router.post('/offer/:amount/:price', controllerOffers.createOffer);

router.post('/producer/create/:lat/:lon', controllerAssets.createProducerAsset);
router.post('/producer/update/:prod', controllerAssets.updateProducerAsset);
router.post('/ecoin/:amount', controllerAssets.addEcoins);
router.post('/consumer/create/:lat/:lon', controllerAssets.createConsumerAsset);
router.post('/contracts/create/:offerId', controllerOffers.createContract);
router.post('/peerContracts/create', controllerOffers.createPeerContract);
router.post('/peerContracts/addContract/:contractId', controllerOffers.addPeerContract);

router.post('/offer/:id', controllerOffers.executeOffer);
router.post('/maxPrice/:maxPrice', controllerConfig.saveMaxPrice)
router.post('/minPrice/:minPrice', controllerConfig.saveMinPrice)

// patches
router.patch('/consumer/update/:recv', controllerAssets.updateConsumerAsset);

router.get('/exist/:id', controllerOffers.assetExists);

export = router;