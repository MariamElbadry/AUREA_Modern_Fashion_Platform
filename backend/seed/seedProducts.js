require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/product.model'); // adjust path if different

const products = [
  // Dresses
  { Id: 1, name: 'Silk Charmeuse Slip Dress', price: 420, catId: 1, imageUrl: 'https://i.pinimg.com/736x/77/bc/45/77bc455501d3dc0ef735e82c50157f33.jpg', quantity: 15, designer: 'Elena Rossi', isRent: true, isNew: true },
  { Id: 2, name: 'Emerald Silk Cocktail Dress', price: 480, catId: 1, imageUrl: 'https://i.pinimg.com/736x/2b/2b/d9/2b2bd9fb74f64d7d9f60e6a9ec7b0d11.jpg', quantity: 0, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 3, name: 'Embroidered Tulle Midi Dress', price: 395, catId: 1, imageUrl: 'https://i.pinimg.com/736x/d6/c5/50/d6c550ff3e0ccb25f8ae2c220f16c8d2.jpg', quantity: 17, designer: 'Maria Chen', isRent: true, isNew: true },
  { Id: 4, name: 'Draped Satin Evening Gown', price: 650, catId: 1, imageUrl: 'https://lorenaboutique.com/cdn/shop/files/f12926d2579d46b8a4d43333cdf91508_1800x1800.jpg?v=1766565878', quantity: 7, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 5, name: 'Ruched Bodycon Midi Dress', price: 340, catId: 1, imageUrl: 'https://i.pinimg.com/1200x/b5/c2/88/b5c2886b4a8b6aaf6662227f942688a1.jpg', quantity: 20, designer: 'Amara Osei', isRent: true, isNew: false },
  { Id: 6, name: 'Off-Shoulder Chiffon Maxi Dress', price: 510, catId: 1, imageUrl: 'https://i.pinimg.com/736x/5e/79/ec/5e79ec866dc2ec679529ac4d357983ed.jpg', quantity: 0, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 7, name: 'Beaded Sheath Evening Dress', price: 590, catId: 1, imageUrl: 'https://i.pinimg.com/736x/f9/78/ae/f978aee4397136fc68ee22cbcfd0b24f.jpg', quantity: 25, designer: 'Sofia Laurent', isRent: true, isNew: true },
  { Id: 8, name: 'Wrap Front Jersey Dress', price: 285, catId: 1, imageUrl: 'https://i.pinimg.com/736x/ce/d3/27/ced32723c8cfc52bc9f60e09f47d6579.jpg', quantity: 25, designer: 'Maria Chen', isRent: true, isNew: true },
  { Id: 9, name: 'Polka Dot Silk Maxi Dress', price: 375, catId: 1, imageUrl: 'https://i.pinimg.com/736x/14/67/84/1467841c39d5ebfa9cc1179ef88f0109.jpg', quantity: 16, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 10, name: 'Floral Lace Applique Maxi Dress', price: 460, catId: 1, imageUrl: 'https://i.pinimg.com/736x/68/91/40/689140af89f50a93d8770aa081d13c9f.jpg', quantity: 11, designer: 'Amara Osei', isRent: true, isNew: false },

  // Wedding
  { Id: 11, name: 'Lihi Hod Inspired Bridal Gown', price: 2800, catId: 2, imageUrl: 'https://i.pinimg.com/originals/d3/f5/18/d3f5184f65c5db719559bbda4c7f42b6.jpg', quantity: 5, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 12, name: 'Scoop Neck Low-Back Wedding Gown', price: 3200, catId: 2, imageUrl: 'https://i.pinimg.com/originals/93/3c/67/933c6770a0ad0ba82a434be191530cc4.jpg', quantity: 4, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 13, name: 'Boutique Trunk Show Bridal Gown', price: 2400, catId: 2, imageUrl: 'https://i0.wp.com/greenweddingshoes.com/wp-content/uploads/2023/06/luxurious-scoop-neck-elegant-wedding-dresses-with-low-back.jpeg?fit=1024,9999', quantity: 6, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 14, name: 'Classic Ball Gown Silhouette', price: 1950, catId: 2, imageUrl: 'https://media.gettyimages.com/id/1711839971/photo/beautiful-woman-trying-on-bridal-gown-in-boutique.jpg?s=612x612&w=0&k=20&c=7iBF5SEk3RWadn-Iy4Ne0imIMazoLQtt1_EG3czdybA=', quantity: 3, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 15, name: 'Cathedral Lace Wedding Veil', price: 320, catId: 2, imageUrl: 'https://m.media-amazon.com/images/I/61AfkvrVxnL.jpg', quantity: 14, designer: 'Amara Osei', isRent: true, isNew: false },
  { Id: 16, name: 'Face-Framing Blusher Veil', price: 280, catId: 2, imageUrl: 'https://limeliaaccessories.com/cdn/shop/files/DSCF6350-min_400x.jpg?v=1703939263', quantity: 18, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 17, name: 'Triple-Tier French Lace Veil', price: 480, catId: 2, imageUrl: 'https://www.twigsandhoney.com/cdn/shop/files/2646-triple-tier-french-lace-bridal-train-veil-pearl-comb-twigsandhoney-c.jpg?v=1767130297&width=1500', quantity: 10, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 18, name: 'Pearl Comb Tulle Veil', price: 395, catId: 2, imageUrl: 'https://m.media-amazon.com/images/I/71otBy3nZLL.jpg', quantity: 12, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 19, name: 'Cascading Cathedral Veil', price: 520, catId: 2, imageUrl: 'https://weddingveil.com/cdn/shop/products/DSC_7954_9e5c1309-f3b6-41dd-b9e1-c8df3760a635_1024x1024.jpg?v=1658933247', quantity: 9, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 20, name: 'Two-Tier Satin Trim Veil', price: 340, catId: 2, imageUrl: 'https://www.twigsandhoney.com/cdn/shop/files/2646-triple-tier-french-lace-bridal-train-veil-pearl-comb-twigsandhoney-b.jpg?v=1767130297&width=1500', quantity: 15, designer: 'Amara Osei', isRent: true, isNew: false },

  // Engagement
  { Id: 21, name: 'Cartier-Style Diamond Cut Ring', price: 3200, catId: 3, imageUrl: 'https://i.pinimg.com/originals/93/92/4b/93924b199c203a18368bda683163c3af.jpg', quantity: 6, designer: 'Elena Rossi', isRent: false, isNew: false },
  { Id: 22, name: 'Classic Solitaire Diamond Ring', price: 2600, catId: 3, imageUrl: 'https://media.istockphoto.com/id/980432112/photo/luxury-engagement-diamond-ring-in-jewelry-gift-box.jpg?s=612x612&w=0&k=20&c=F12Rf2bu2FZkEJCzkNEWk-VPkEUEEET4VzKDLr_lm4c=', quantity: 8, designer: 'Sofia Laurent', isRent: false, isNew: false },
  { Id: 23, name: 'Vintage Halo Diamond Ring', price: 3800, catId: 3, imageUrl: 'https://t3.ftcdn.net/jpg/02/23/01/42/360_F_223014299_ACzgtHOuZfJw2wQxguYERJ12q1CTirnj.jpg', quantity: 4, designer: 'Maria Chen', isRent: false, isNew: false },
  { Id: 24, name: 'Pear Cut Yellow Diamond Ring', price: 2200, catId: 3, imageUrl: 'https://i.etsystatic.com/35326688/c/1086/1086/487/487/il/7d7fc6/7452364008/il_300x300.7452364008_aomd.jpg', quantity: 1, designer: 'Isabella Moreau', isRent: false, isNew: false },
  { Id: 25, name: 'Champagne Diamond Ring', price: 2950, catId: 3, imageUrl: 'https://www.krikawa.com/pages/images/unique-rings/luxury-champagne-diamond-engagement-ring.jpg?w=500', quantity: 7, designer: 'Amara Osei', isRent: false, isNew: false },
  { Id: 26, name: 'Oval Cut Diamond Ring', price: 3400, catId: 3, imageUrl: 'https://images.custommade.com/Dh1WhnsGa2c-_PsXTZdXQyzJ2Pw=/600x600/custommade-attachments/ce15791b96983f9_gemstone_3.jpg', quantity: 0, designer: 'Elena Rossi', isRent: false, isNew: false },
  { Id: 27, name: 'Art-Deco Emerald Halo Ring', price: 4200, catId: 3, imageUrl: 'https://www.brides.com/thmb/iipCkR_BCfHnnF0cALnMCbrrhq8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__brides__public__brides-services__production__2016__12__01__583f728a2375953b4a560c21_39-71b1b9614b2c4c7fa030cfa94e63c75e.jpg', quantity: 3, designer: 'Sofia Laurent', isRent: false, isNew: false },
  { Id: 28, name: 'Aquamarine Diamond Halo Ring', price: 3600, catId: 3, imageUrl: 'https://www.brides.com/thmb/fFco5L8N-rHpPk4d3sadBremz4E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__brides__public__brides-services__production__2016__12__01__583f72885f12914d4e7851e7_35-7597ee8c73ca4661a3627e0fa17e6ac8.jpg', quantity: 6, designer: 'Maria Chen', isRent: false, isNew: false },
  { Id: 29, name: 'Pear-Shaped Diamond Cluster Ring', price: 4800, catId: 3, imageUrl: 'https://www.brides.com/thmb/Uj_IAPJOlRRT48ilVvnUEuw3l-w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__brides__public__brides-services__production__2016__12__01__583f72897d06eae4546edf01_37-22fcd88a99b84ddb972da1c063b37356.jpg', quantity: 9, designer: 'Isabella Moreau', isRent: false, isNew: false },
  { Id: 30, name: 'Flower-Shaped Rose Gold Ring', price: 2900, catId: 3, imageUrl: 'https://www.brides.com/thmb/dFuSRrKEamg09EfcYnLqOXeEXpo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__brides__public__brides-services__production__2016__12__01__583f727192fcb23343e30bb2_26-dce1087196a746daa0b471f05895300e.jpg', quantity: 5, designer: 'Amara Osei', isRent: false, isNew: false },

  // Blouses
  { Id: 31, name: 'Draped Silk Blouse', price: 265, catId: 4, imageUrl: 'https://i.pinimg.com/1200x/99/12/22/991222ca391c945718feab5ffa47f359.jpg', quantity: 22, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 32, name: 'Ivory Silk Tie-Neck Blouse', price: 235, catId: 4, imageUrl: 'https://i.pinimg.com/736x/db/d1/b1/dbd1b1a9f73381c76f39ad81d3c1845c.jpg', quantity: 18, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 33, name: 'Chocolate Silk Camisole Set', price: 310, catId: 4, imageUrl: 'https://i.pinimg.com/736x/ed/29/f6/ed29f6744823f3d1e4607547786abece.jpg', quantity: 1, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 34, name: 'Champagne Shine Silk Blouse', price: 290, catId: 4, imageUrl: 'https://i.pinimg.com/736x/29/81/d0/2981d0779fa6e71639d444dc7ea170f5.jpg', quantity: 16, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 35, name: 'French Silk Blouse', price: 255, catId: 4, imageUrl: 'https://i.pinimg.com/736x/7b/bd/53/7bbd538f37332c17f174f94c20cab7b3.jpg', quantity: 20, designer: 'Amara Osei', isRent: true, isNew: false },
  { Id: 36, name: 'Silk Tie-Front Blouse', price: 225, catId: 4, imageUrl: 'https://cdn.mos.cms.futurecdn.net/whowhatwear/posts/229415/styling-a-silk-blouse-229415-1499880798334-main.jpg', quantity: 0, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 37, name: 'Brocade Nehru Collar Top', price: 340, catId: 4, imageUrl: 'https://ullajohnson.com/cdn/shop/files/ULLAJOHNSON_AlouetteSSCottonTop_PF260207_PRISTINE_04.jpg?v=1778168281&width=960', quantity: 14, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 38, name: 'Cotton Eyelet Scallop Top', price: 195, catId: 4, imageUrl: 'https://ullajohnson.com/cdn/shop/files/ULLAJOHNSON_AlouetteSSCottonTop_PF260207_WISTERIA_04.jpg?v=1778166740&width=960', quantity: 28, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 39, name: 'Long-Sleeve High Plains Blouse', price: 275, catId: 4, imageUrl: 'https://us.akris.com/cdn/shop/files/img_2071e795-de08-4a04-acfb-cb80c7218e82.png?v=1781165099&width=1946', quantity: 19, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 40, name: 'Delfino Grey Silk Blouse', price: 245, catId: 4, imageUrl: 'https://cdn.shopify.com/s/files/1/2589/2230/files/FlorenceSilkBlouse-DelfinoGrey--3_1024x1024.jpg?v=1705181237', quantity: 21, designer: 'Amara Osei', isRent: true, isNew: false },

  // Pants
  { Id: 41, name: 'Coraline Button-Front Wide Leg Trousers', price: 340, catId: 5, imageUrl: 'https://i.pinimg.com/736x/5c/e5/90/5ce5905e0129907cd4dac6eb5261a1bd.jpg', quantity: 20, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 42, name: 'Barrel Leg Sweatpants', price: 195, catId: 5, imageUrl: 'https://i.pinimg.com/1200x/ee/c0/85/eec085b2a4e5370efa18f1da53b9aac2.jpg', quantity: 26, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 43, name: 'High-Waisted Pleated Trousers', price: 265, catId: 5, imageUrl: 'https://i.pinimg.com/736x/4e/b1/26/4eb126b7265e43320a09f49a0e181aac.jpg', quantity: 18, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 44, name: 'Silk Wide Leg Side-Zip Trousers', price: 310, catId: 5, imageUrl: 'https://i.pinimg.com/736x/db/4f/2c/db4f2c65552c6fd086dbaab717eda1e1.jpg', quantity: 1, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 45, name: 'Silk Wide Leg Lined Slacks', price: 285, catId: 5, imageUrl: 'https://i.pinimg.com/736x/f4/75/6d/f4756d5e0a6c5dce77cde6398cc3bc53.jpg', quantity: 1, designer: 'Amara Osei', isRent: true, isNew: false },
  { Id: 46, name: 'Commuter High-Waist Wide-Leg Pants', price: 225, catId: 5, imageUrl: 'https://i.pinimg.com/1200x/33/4e/c9/334ec99ed3c04120b9839764678addf5.jpg', quantity: 0, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 47, name: 'Fellia Silk Georgette Trousers (Beige)', price: 355, catId: 5, imageUrl: 'https://i.pinimg.com/736x/2f/f9/1f/2ff91ff1a5963fba2323ad91003b20ea.jpg', quantity: 14, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 48, name: 'Fellia Silk Georgette Trousers (Black)', price: 360, catId: 5, imageUrl: 'https://i.pinimg.com/1200x/69/a8/f5/69a8f582dbf169a7f620188b81ac6587.jpg', quantity: 13, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 49, name: 'Tailored Cigarette Trousers', price: 240, catId: 5, imageUrl: 'https://i.pinimg.com/736x/aa/5f/6d/aa5f6d46e188baaa170450f4e7f051f1.jpg', quantity: 24, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 50, name: 'Flowing Palazzo Trousers', price: 215, catId: 5, imageUrl: 'https://i.pinimg.com/736x/0c/fe/84/0cfe84619db5b5d9107b6441288d19cb.jpg', quantity: 19, designer: 'Amara Osei', isRent: true, isNew: false },

  // Shoes
  { Id: 51, name: 'Satin Bow Evening Heels', price: 365, catId: 6, imageUrl: 'https://i.pinimg.com/736x/73/30/88/733088784a3ec90f458ca5bb804297ab.jpg', quantity: 16, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 52, name: 'Gala Crystal Embellished Heels', price: 420, catId: 6, imageUrl: 'https://i.pinimg.com/736x/34/4a/a3/344aa38e688eb29e982f2088c6a89f23.jpg', quantity: 14, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 53, name: 'Grey Satin Crystal Pumps', price: 395, catId: 6, imageUrl: 'https://i.pinimg.com/736x/79/b0/4e/79b04e95ce55d62f2de313619cd59072.jpg', quantity: 18, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 54, name: 'Black Satin Crystal Buckle Pumps', price: 440, catId: 6, imageUrl: 'https://i.pinimg.com/736x/aa/5a/e1/aa5ae107fef547dce1c14fe5123d63cd.jpg', quantity: 12, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 55, name: 'Nappa Leather Slingback Pumps', price: 310, catId: 6, imageUrl: 'https://i.pinimg.com/736x/6b/2a/2c/6b2a2cbc73658de9eecd93fc18658052.jpg', quantity: 20, designer: 'Amara Osei', isRent: true, isNew: false },
  { Id: 56, name: 'Black Satin Buckle Pumps', price: 375, catId: 6, imageUrl: 'https://i.pinimg.com/736x/48/2b/96/482b96495a3653970d93d5b8a142c6e3.jpg', quantity: 15, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 57, name: 'Toe-Post Evening Sandals', price: 285, catId: 6, imageUrl: 'https://i.pinimg.com/736x/35/c3/5c/35c35c646dffe4481d4f453ab5ec8e6c.jpg', quantity: 22, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 58, name: 'Toe Loop Metallic Sandals', price: 265, catId: 6, imageUrl: 'https://i.pinimg.com/736x/2b/96/9d/2b969d63fe9f4fc4a32ba3d7fe278ca2.jpg', quantity: 19, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 59, name: 'Open Toe Ring Sandals', price: 235, catId: 6, imageUrl: 'https://i.pinimg.com/1200x/5a/e3/4a/5ae34adadf03e329843a5ece3ae16746.jpg', quantity: 17, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 60, name: 'Classic Black Stiletto Heels', price: 320, catId: 6, imageUrl: 'https://i.pinimg.com/736x/3e/97/f3/3e97f3bfb507ca4eae9081521a9ad167.jpg', quantity: 21, designer: 'Amara Osei', isRent: true, isNew: false },

  // Bags
  { Id: 61, name: 'Structured Leather Top-Handle Bag', price: 480, catId: 7, imageUrl: 'https://i.pinimg.com/1200x/60/03/a6/6003a6071f5e9d5ca30f63a14959acde.jpg', quantity: 10, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 62, name: 'Pink Pebbled Leather Handbag', price: 340, catId: 7, imageUrl: 'https://i.pinimg.com/736x/81/78/c7/8178c745a91ca382a5f1f5478a82e781.jpg', quantity: 14, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 63, name: 'Vintage Leather Shoulder Bag', price: 290, catId: 7, imageUrl: 'https://i.pinimg.com/736x/79/b0/4e/79b04e95ce55d62f2de313619cd59072.jpg', quantity: 16, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 64, name: 'Tan Leather Slouch Handbag', price: 255, catId: 7, imageUrl: 'https://i.pinimg.com/736x/aa/5a/e1/aa5ae107fef547dce1c14fe5123d63cd.jpg', quantity: 12, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 65, name: 'Woven Leather Tote', price: 395, catId: 7, imageUrl: 'https://i.pinimg.com/736x/d1/a9/f6/d1a9f680baac776005e9d78c701e8d9b.jpg', quantity: 9, designer: 'Amara Osei', isRent: true, isNew: false },
  { Id: 66, name: 'Quilted Chain Shoulder Bag', price: 360, catId: 7, imageUrl: 'https://i.pinimg.com/736x/4f/11/68/4f1168a658d26bc2e5556e2341684ba1.jpg', quantity: 11, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 67, name: 'Satin Evening Clutch', price: 220, catId: 7, imageUrl: 'https://i.pinimg.com/736x/3f/e5/c3/3fe5c3f10034f82cf0946fcea15005b8.jpg', quantity: 18, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 68, name: 'Orange Leather Top-Handle Bag', price: 310, catId: 7, imageUrl: 'https://i.pinimg.com/736x/8f/26/86/8f2686adc68a1ef7efd4abd9f3b57661.jpg', quantity: 13, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 69, name: 'Pink Satin Clutch', price: 195, catId: 7, imageUrl: 'https://i.pinimg.com/736x/46/2d/b5/462db59a01b328a195770f2ca6fc1f86.jpg', quantity: 20, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 70, name: 'White Structured Clutch', price: 240, catId: 7, imageUrl: 'https://i.pinimg.com/736x/e6/c3/0a/e6c30a49a52e1c0b3f727f713206d52b.jpg', quantity: 15, designer: 'Amara Osei', isRent: true, isNew: false },

  // Jewellery
  { Id: 71, name: 'Gold Tilla Bridal Necklace', price: 420, catId: 8, imageUrl: 'https://i.pinimg.com/originals/82/a6/c4/82a6c4c6bfd8a356d9365250e43bfb7a.jpg', quantity: 22, designer: 'Elena Rossi', isRent: false, isNew: false },
  { Id: 72, name: 'Gold Vintage-Inspired Hoop Earrings', price: 285, catId: 8, imageUrl: 'https://m.media-amazon.com/images/I/61HMqxW8t4L.jpg', quantity: 26, designer: 'Sofia Laurent', isRent: false, isNew: false },
  { Id: 73, name: 'Gold Pave Drop Earrings', price: 315, catId: 8, imageUrl: 'https://img4.dhresource.com/webp/m/100x100/f3/albu/bw/h/20/a798961f-673a-4bb8-b442-987c30c1cdd5.jpg', quantity: 19, designer: 'Maria Chen', isRent: false, isNew: false },
  { Id: 74, name: 'Gold Statement Studs', price: 265, catId: 8, imageUrl: 'https://img4.dhresource.com/webp/m/100x100/f3/albu/bw/h/20/b9f2768d-d58d-43f1-9639-e76181deebd4.jpg', quantity: 24, designer: 'Isabella Moreau', isRent: false, isNew: false },
  { Id: 75, name: 'Classic Gold Hoop Earrings', price: 240, catId: 8, imageUrl: 'https://img4.dhresource.com/webp/m/100x100/f3/albu/ys/m/30/cc0245f1-b677-45fb-9d79-0d361e59367c.jpg', quantity: 30, designer: 'Amara Osei', isRent: false, isNew: false },
  { Id: 76, name: 'Cartier-Style Bangle Bracelet', price: 395, catId: 8, imageUrl: 'https://img4.dhresource.com/webp/m/100x100/f3/albu/bw/h/20/24b84007-eaa6-4d64-ae52-3f68daa613b4.jpg', quantity: 8, designer: 'Elena Rossi', isRent: false, isNew: false },
  { Id: 77, name: 'Roberto Coin Style Bracelet', price: 350, catId: 8, imageUrl: 'https://editorialist.com/wp-content/uploads/2022/02/Editorialist2023_cartier-love-bracelets_-Square-700x700.jpg', quantity: 7, designer: 'Sofia Laurent', isRent: false, isNew: false },
  { Id: 78, name: 'Graff-Inspired Diamond Pendant', price: 460, catId: 8, imageUrl: 'https://editorialist.com/wp-content/uploads/2024/10/Editorialist2024_roberto-coin_-Square-700x700.jpg', quantity: 6, designer: 'Maria Chen', isRent: false, isNew: false },
  { Id: 79, name: 'Net-A-Porter Style Gold Necklace', price: 330, catId: 8, imageUrl: 'https://editorialist.com/wp-content/uploads/2024/05/Editorialist2024-Graff-investment-jewelry_Square2-700x700.jpg', quantity: 17, designer: 'Isabella Moreau', isRent: false, isNew: false },
  { Id: 80, name: 'Layered Gold Chain Necklace', price: 290, catId: 8, imageUrl: 'https://editorialist.com/wp-content/uploads/2023/11/Editorialist23_Net-A-Porter_Gift-Guide-Jewelry-Gift-Ideas-Shell-Love-_Holding_-Square-1-700x700.jpg', quantity: 20, designer: 'Amara Osei', isRent: false, isNew: false },

  // Headscarf
  { Id: 81, name: 'Abstract Print Silk Scarf', price: 175, catId: 9, imageUrl: 'https://i.pinimg.com/originals/de/9d/32/de9d320f41e27547b152549b62a790ab.jpg', quantity: 30, designer: 'Elena Rossi', isRent: false, isNew: false },
  { Id: 82, name: 'Painterly Silk Square Scarf', price: 150, catId: 9, imageUrl: 'https://editorialist.com/wp-content/uploads/2025/03/Editorialist2025_scarf-Dresses_Square-700x700.jpg', quantity: 26, designer: 'Sofia Laurent', isRent: false, isNew: false },
  { Id: 83, name: 'Editorial Silk Scarf', price: 140, catId: 9, imageUrl: 'https://i.pinimg.com/originals/d1/aa/95/d1aa959dfcd9e0ea75020e486178993e.jpg', quantity: 24, designer: 'Maria Chen', isRent: false, isNew: false },
  { Id: 84, name: 'Everyday Elegance Silk Scarf', price: 160, catId: 9, imageUrl: 'https://editorialist.com/wp-content/uploads/2025/08/Editorialist25_silk_scarf_outfits.jpg', quantity: 28, designer: 'Isabella Moreau', isRent: false, isNew: false },
  { Id: 85, name: 'Vintage Equestrian Print Scarf', price: 185, catId: 9, imageUrl: 'https://i.pinimg.com/originals/02/7d/3a/027d3afba5bf21ef5e236af7c5dea62d.jpg', quantity: 20, designer: 'Amara Osei', isRent: false, isNew: false },
  { Id: 86, name: 'Abstract Pucci-Style Scarf', price: 145, catId: 9, imageUrl: 'https://i.pinimg.com/originals/87/cf/f2/87cff2c2f560d37424969c00efa652db.jpg', quantity: 22, designer: 'Elena Rossi', isRent: false, isNew: false },
  { Id: 87, name: 'Black Floral Silk Headscarf', price: 195, catId: 9, imageUrl: 'https://thelittletichellady.com/cdn/shop/files/IMG-2098_110x110@2x.jpg?v=1756721080', quantity: 18, designer: 'Sofia Laurent', isRent: false, isNew: false },
  { Id: 88, name: 'Vintage Gaucho Print Scarf', price: 210, catId: 9, imageUrl: 'https://thelittletichellady.com/cdn/shop/files/FA6856B3-39B2-489A-B565-1C78EB6240F5_345x345@2x.jpg?v=1780740760', quantity: 16, designer: 'Maria Chen', isRent: false, isNew: false },
  { Id: 89, name: 'Starburst Print Headscarf', price: 165, catId: 9, imageUrl: 'https://thelittletichellady.com/cdn/shop/files/4CADF9D3-2E2D-402C-95BD-467E824068A4_345x345@2x.jpg?v=1780819786', quantity: 25, designer: 'Isabella Moreau', isRent: false, isNew: false },
  { Id: 90, name: 'Floral Panel Silk Scarf', price: 155, catId: 9, imageUrl: 'https://thelittletichellady.com/cdn/shop/files/IMG-8311_58316d7c-f774-4da9-a685-bc02e8455048_345x345@2x.jpg?v=1775038430', quantity: 23, designer: 'Amara Osei', isRent: false, isNew: false },

  // Skirts
  { Id: 91, name: 'Beige Pleated Midi Skirt', price: 210, catId: 10, imageUrl: 'https://images.hellomagazine.com/horizon/landscape/81671990957b-paris-str-s25-2117.jpg?tx=c_limit,w_640', quantity: 22, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 92, name: 'Denim Box Pleat Midi Skirt', price: 185, catId: 10, imageUrl: 'https://images.hellomagazine.com/horizon/original_aspect_ratio/a7dd6ecc4b96-05201601407-o1.jpg', quantity: 19, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 93, name: 'Elowena Black Midi Skirt', price: 240, catId: 10, imageUrl: 'https://images.hellomagazine.com/horizon/original_aspect_ratio/a8092e741deb-w2000q60-3.jpg', quantity: 16, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 94, name: 'Pink Leather Midi Skirt', price: 265, catId: 10, imageUrl: 'https://images.hellomagazine.com/horizon/original_aspect_ratio/8ddca1726cc9-28bc717ef7a9-paris-str-f25-2751jpg.jpg', quantity: 25, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 95, name: 'A-Line Purple Midi Skirt', price: 220, catId: 10, imageUrl: 'https://images.hellomagazine.com/horizon/original_aspect_ratio/e4360bde2d34-8e39f7078029ac1ddf7f6e0887904235c74c3965xxl-1.jpg', quantity: 18, designer: 'Amara Osei', isRent: true, isNew: false },
  { Id: 96, name: 'Blue Trumpet Midi Skirt', price: 195, catId: 10, imageUrl: 'https://i.pinimg.com/originals/2c/ec/c5/2cecc55712e32ec727bf851d7d427283.jpg', quantity: 20, designer: 'Elena Rossi', isRent: true, isNew: false },
  { Id: 97, name: 'Faux Leather A-Line Mini Skirt', price: 165, catId: 10, imageUrl: 'https://m.media-amazon.com/images/I/71FlvjxuNJL.jpg', quantity: 28, designer: 'Sofia Laurent', isRent: true, isNew: false },
  { Id: 98, name: 'Silk Pencil Skirt with Pockets', price: 285, catId: 10, imageUrl: 'https://i.pinimg.com/originals/d7/ae/4e/d7ae4e964c2b5b5b1d6bae2c440642a9.jpg', quantity: 15, designer: 'Maria Chen', isRent: true, isNew: false },
  { Id: 99, name: 'White Pleated Midi Skirt', price: 225, catId: 10, imageUrl: 'https://i.pinimg.com/originals/56/66/8e/56668e2103bbdd6e8c574db39b210ca2.jpg', quantity: 17, designer: 'Isabella Moreau', isRent: true, isNew: false },
  { Id: 100, name: 'Accordion Pleat Maxi Skirt', price: 255, catId: 10, imageUrl: 'https://i.pinimg.com/originals/13/b8/0a/13b80a930666c4a2407ea3f379b20acd.jpg', quantity: 21, designer: 'Amara Osei', isRent: true, isNew: false },
];

const seedProducts = async () => {
  try {
    await connectDB();

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    console.log('Seeding products...');
    await Product.insertMany(products);

    console.log(`✓ ${products.length} products seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
};

seedProducts();
