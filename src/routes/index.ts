import express from 'express';

const router = express.Router();

import ensureUserAuthenticated from '../middlewares/ensureAuthentication';

import handleErrors, { handleNotFound } from '../middlewares/handleErrors';

import { CreateProduct } from '../controllers/product/create';
import { DeleteProduct } from '../controllers/product/delete';
import { ListProducts } from '../controllers/product/list';
import { UpdateProduct } from '../controllers/product/update';
import { ReadProduct } from '../controllers/product/read';

import { SellEvent } from '../controllers/event/sell';
import { ListEvents } from '../controllers/event/list';
import { BuyEvent } from '../controllers/event/buy';

import { CreateUser } from '../controllers/user/create';
import { Signin } from '../controllers/auth/signin';

import { ResendSMS } from '../controllers/auth/resendSMS';
import { VerifyUser } from '../controllers/user/verify';

router.post('/users', CreateUser);
router.post('/auth/signin', Signin);
router.post('/auth/verify', VerifyUser);
router.post('/auth/resendSMS', ResendSMS);

router.use(ensureUserAuthenticated);

router.post('/product', CreateProduct);
router.delete('/product', DeleteProduct);
router.get('/products', ListProducts);
router.put('/product/:SKU', UpdateProduct);
router.get('/product/:SKU', ReadProduct);

router.post('/sell/:SKU', SellEvent);
router.post('/buy/:SKU', BuyEvent);
router.get('/events', ListEvents);

router.use(handleErrors);
router.use(handleNotFound);

export default router;
