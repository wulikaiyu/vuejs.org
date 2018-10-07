/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["2014/03/22/vuejs-010-release/index.html","488dac36f984bf34f481078a42ed7aae"],["2014/07/29/vue-next/index.html","0c90d6be23b7cb76276a8f7f763de525"],["2014/11/09/vue-011-release/index.html","13aee73478004ae20cd2542e324a8d18"],["2014/12/08/011-component/index.html","88064da25953aa141f625edf6b61801f"],["2015/06/11/012-release/index.html","db144f458dffdacc97ba23a7b41e9228"],["2015/10/26/1.0.0-release/index.html","01c3e2b2c9e262d0e2f8a0f4695c17cb"],["2015/10/28/why-no-template-url/index.html","b9823991599c315e058e2d6a17c6437f"],["2015/12/28/vue-cli/index.html","3910051cb797d00bed567836298b1c12"],["2016/02/06/common-gotchas/index.html","0a0752a6d129ba607905700207e717fa"],["2016/03/14/march-update/index.html","041f973f31aa44e5d731ead9f416b21b"],["2016/04/27/announcing-2.0/index.html","09a9182ee73e40ec029256638cda9da9"],["about/index.html","efc5f84b867cb3adb9ee14264cba159d"],["api/index.html","176a72f4aaa42c3b6a404d370e87fbb8"],["archives/2014/03/index.html","418b0aa4e57d74042d9c9528a4436fd2"],["archives/2014/07/index.html","cabf3a7ec8b796a1bca9a796958d78b4"],["archives/2014/11/index.html","5051f456528fd793cc9708702e238871"],["archives/2014/12/index.html","99e6927b816789ecb993c5f857d43df7"],["archives/2014/index.html","7f15a1f145d89e1ef6c4640401a03d86"],["archives/2015/06/index.html","94c1f7469c1492b1c68d26b78953d03d"],["archives/2015/10/index.html","49f6e81de5735d94c3b8bdaa7fcc4d8c"],["archives/2015/12/index.html","85a2fde48b6d6f229d54b978cdb7d4d5"],["archives/2015/index.html","721e439b8389dbcb3ea2445c0fcf618f"],["archives/2016/02/index.html","0e4ae0ba1b826bd795437599b86bc2e0"],["archives/2016/03/index.html","8351653c5c13ac2d5c554db3a9ca7052"],["archives/2016/04/index.html","1310dc10278ae370f0a6c7eafeb6d661"],["archives/2016/index.html","5ad577b30e34e776f6c7c84565f73809"],["archives/index.html","56b6364b728b55c3d50f9e930291a968"],["archives/page/2/index.html","1034649cc50b5509fbe8b31892eac840"],["css/benchmark.css","b083e0006589a5ba88a250eb8ee12cc5"],["css/index.css","a12f976695e8a626615be6f819a6fa5d"],["css/page.css","2a17c5659c7af21064c13a6409e3ceb7"],["css/search.css","e4e6c1e2a49dfe73bd8f10ca3409c040"],["examples/commits.html","3cd3b2db40187e7f2d236473bae9ce59"],["examples/elastic-header.html","198f4c19911bf30785905adb996ef899"],["examples/firebase.html","266080b80e262a2b93289d466d1337b5"],["examples/grid-component.html","3119ba25bb6b9dcc2f40d3f60e2136df"],["examples/hackernews.html","f793aeb8d340c60945b0a58f3afa25c9"],["examples/index.html","dc91b34e726c12318c4d083a3090c156"],["examples/modal.html","88b6a98ec8a44cd783eaf0d71fcf46a7"],["examples/select2.html","b812ad3b215af513c979c0d9759fe5c9"],["examples/svg.html","0a1876c72d22212d243ed8c2d5b0404e"],["examples/todomvc.html","a048618225f78a66ff322bb1dde98a37"],["examples/tree-view.html","4815e09c4b3af4132da0e95dc1fbc945"],["fonts/Dosis/Dosis-Medium.ttf","1a7809b30cc0cb7fc96feb3cad2eefb7"],["fonts/Roboto_Mono/RobotoMono-Regular.ttf","a48ac41620cd818c5020d0f4302489ff"],["fonts/Source_Sans_Pro/SourceSansPro-Light.ttf","b2e90cc01cdd1e2e6f214d5cb2ae5c26"],["fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf","ba6cad25afe01d394e830f548a7f94df"],["fonts/Source_Sans_Pro/SourceSansPro-Semibold.ttf","52984b3a4e09652a6feee711d5c169fd"],["guide/class-and-style.html","a3174f2083dd58fbd1aa965dcc98133f"],["guide/comparison.html","7c06634379b01b8e7ef0dfc90b9b8517"],["guide/components.html","d98663b0d45a91f0a40541c1efe2bbfc"],["guide/computed.html","3fcf408c7cdfd856ea75b6a5562ba8aa"],["guide/conditional.html","896e19e7955f2616eb31ab4d8c65178c"],["guide/custom-directive.html","697987fdd04783febdbff2aa2932c41d"],["guide/deployment.html","be96515c673712671d042337366ddf63"],["guide/events.html","0ebaec88003f2e1ab59ff868764d961a"],["guide/forms.html","09ead2d35e42cdd09d848b27ec357491"],["guide/index.html","e3171c7c94b236d5caa91894d8fdd581"],["guide/installation.html","8acd1ab4fbaa082958259bf3a22d7b22"],["guide/instance.html","61021765831307e8278d034c23502dd6"],["guide/join.html","f2287c54050c9b576ed05af7baf6af73"],["guide/list.html","772e05d65b4587501785906a4b681efd"],["guide/migration-vue-router.html","e0d8a3e2dc09e2bda939c23c1e967765"],["guide/migration-vuex.html","9b8659c8a4506acd24f2c0e3bee160f3"],["guide/migration.html","af37d4bfb217e88a7f02eb92c446497f"],["guide/mixins.html","270f751a44e1d1e18b9a31406a34fe8b"],["guide/plugins.html","40467c9724e4917ae32582ac543db41b"],["guide/reactivity.html","5b1e83c4a12b5f3e687e89e0a0b1ef05"],["guide/render-function.html","4139dd80783f9eecb92d57dcf23dc54d"],["guide/routing.html","f7f89a93550ee84e925ed84d6912a650"],["guide/single-file-components.html","095eb3d7152439579d7a56227fe273f4"],["guide/ssr.html","9143accd02c56349a3ec40d79eeefb4d"],["guide/state-management.html","81ea6d4aee3ef538b507e4a5a0c3e3a0"],["guide/syntax.html","611a256a910e0d1adfd5b418535e0ac1"],["guide/transitioning-state.html","3f36248a3d9f6f21f10725f15775c5d6"],["guide/transitions.html","4513c62165ee217697830a40e1795365"],["guide/unit-testing.html","0f69c6b7a8d743af6384b8a2208b9a33"],["images/100offer.png","8029274e3fa53cd1f5195d4cf02d5234"],["images/2mhost.png","cf1c6b16ae197cc8fece227593cf3cd8"],["images/aaha.png","77bfeb59f772f37444c9cefe00785cf2"],["images/actualize.png","2a07999eb1d845af6d9f7fe7b2eb0253"],["images/anymod.png","234cf9604fd55de7ce924f520d6c5610"],["images/bit-wide.png","9638a3f44bf471876effb80ea0659f73"],["images/bit.png","db6a4b731ecc06de8bd36d64112c768b"],["images/bmqb.png","25e28c3c20f8f32618a732fe055d6321"],["images/breakpoint_hit.png","114924925a4ec0f23236012bc3dc8422"],["images/breakpoint_set.png","6439856732303cfeb3806d52dd681191"],["images/chaitin.png","549e43997790dc624c477424acbfe228"],["images/check.png","c634675b753a1a03b587c43d8b535600"],["images/codepilot.png","123c45958229de783198d2d893a4044c"],["images/coin-bch.png","ddfab54149483e02f3cd540a47e2782b"],["images/coin-btc.png","d90559bb202766dd6ddabf71dd1680be"],["images/coin-eth.png","70ae70292937880fe9e77c2c7dc38f86"],["images/coin-ltc.png","9e756bd611ac7355515153cecbc20d36"],["images/components.png","b5c08269dfc26ae6d7db3801e9efd296"],["images/conf.png","0d1e4840e924b232e605779b5040c879"],["images/config_add.png","353cd8b2a1bdf9fc4c74a80c5f38090a"],["images/coreui.png","c5c30a912312f8babf5d54fca23f9ed6"],["images/data.png","5de7af21d4c2de951720c006f84b98fc"],["images/datacamp.png","251ad9e67095233b3fcede7b03eaca9c"],["images/devtools-storage-chrome.png","ac1f3b275b87e2fec9c4df951347be81"],["images/devtools-storage-edge.png","3e92a3bea017b8398e71db0a2419a191"],["images/devtools-storage.png","e742c3b1d526bee7be77c050f4bffc92"],["images/devtools-timetravel.gif","fca84f3fb8a8d10274eb2fc7ed9b65f9"],["images/dom-tree.png","f70b86bfbbfe1962dc5d6125105f1122"],["images/dopamine.png","17222090b66cfca59f1ccf8b9843f595"],["images/down.png","2f948222df409af3121254d5fe0ed377"],["images/famebroker.png","9a879f5f83d3583145c756ba381ca482"],["images/feed.png","a9bbd11a96e1cbcc49bf8fa857a0d70f"],["images/frontend-love.png","b514babc53a0f3ddc854b0b14a54a489"],["images/frontend-meetups.png","d9b76c14d7eaf24c6b030ac3352d1e58"],["images/hackr-io.png","2a0d1f9625ec5b529656fe6028f66c4f"],["images/hn-architecture.png","b42f49a4e265649f870685b171e4b170"],["images/hn.png","99176cdebac521e823be519aef514bb3"],["images/htmlburger.png","c7ce1344d001e7a236a89694ed59d988"],["images/icons.png","ad6ee8c400066e15712cdef4342023da"],["images/icons/android-icon-144x144.png","e67b8d54852c2fbf40be2a8eb0590f5b"],["images/icons/android-icon-192x192.png","5d10eaab941eb596ee59ffc53652d035"],["images/icons/android-icon-36x36.png","bb757d234def1a6b53d793dbf4879578"],["images/icons/android-icon-48x48.png","0d33c4fc51e2bb020bf8dd7cd05db875"],["images/icons/android-icon-72x72.png","702c4fafca31d670f9bd8b2d185ced39"],["images/icons/android-icon-96x96.png","0ebff702851985ea6ba891cf6e6e7ddd"],["images/icons/apple-icon-114x114.png","f4fd30f3a26b932843b8c5cef9f2186e"],["images/icons/apple-icon-120x120.png","b6a574d63d52ef9c89189b67bcac5cbd"],["images/icons/apple-icon-144x144.png","e67b8d54852c2fbf40be2a8eb0590f5b"],["images/icons/apple-icon-152x152.png","f53787bf41febf2b044931a305ccaf2a"],["images/icons/apple-icon-180x180.png","9f6b1e3b92b2c5bd5b7d79501bb6e612"],["images/icons/apple-icon-57x57.png","83f622ba0994866abc56ace068b6551c"],["images/icons/apple-icon-60x60.png","643f761bc39f86c70f17cd1fed3b8e08"],["images/icons/apple-icon-72x72.png","702c4fafca31d670f9bd8b2d185ced39"],["images/icons/apple-icon-76x76.png","94d9af047b86d99657b5efb88a0d1c7b"],["images/icons/apple-icon-precomposed.png","707758f591323153a4f1cb3a8d9641fa"],["images/icons/apple-icon.png","707758f591323153a4f1cb3a8d9641fa"],["images/icons/favicon-16x16.png","a5a9da66870189b0539223c38c8a7749"],["images/icons/favicon-32x32.png","3d60db0d77303b2414ddd50cf2472bf7"],["images/icons/favicon-96x96.png","0ebff702851985ea6ba891cf6e6e7ddd"],["images/icons/ms-icon-144x144.png","e67b8d54852c2fbf40be2a8eb0590f5b"],["images/icons/ms-icon-150x150.png","e8cdf492981122a2548bc247c7b4067d"],["images/icons/ms-icon-310x310.png","1721f8303ec2349002b5980a01f27cef"],["images/icons/ms-icon-70x70.png","a110cf0132b00b23a8605ca72a8874ba"],["images/icons8.png","ffcdd01817ecdb32b92bd2f1e4d75e84"],["images/infinitynewtab.png","446b9c9b5b7c251e3cf3b67ac5ed4acb"],["images/itunescn.png","dffb5409b975a5590aab9be99fb53ca8"],["images/jsfiddle.png","9f92527b7bce17471203e83f948292c5"],["images/jsguru.png","31c4e9e56df283700fd81a44d46099c7"],["images/juejin.png","46d2970cf094e50a218e1a8cd242b536"],["images/laravel.png","9a2fba3eca41e26743dc731e3a4469b6"],["images/lifecycle.png","6f2c97f045ba988851b02056c01c8d62"],["images/logged-proxied-data.png","716e3c41aacf453cfaedd61c2795f0ec"],["images/logo.png","cf23526f451784ff137f161b8fe18d5a"],["images/memory-leak-example.png","c2fae8bd6d8fa50632f9cde80be8b3f6"],["images/menu.png","0b414c367f5e7c0eb1b40f1076216b08"],["images/monterail.png","3a441c52ccf03e6d09defa528cd2d632"],["images/mvvm.png","4fbd3c1bc80d47038f3e66cf1478a1a3"],["images/nativescript.png","05c94493b428db55bb441faaca4b02d8"],["images/neds.png","8936cd0dd2ea2dedb127a330448d45e8"],["images/nsoft.png","a4b60a037e1870b022a6c5f40880dc56"],["images/onsen-ui.png","e41569bcb10fbca3f361d818b29ed7fd"],["images/patreon.png","99eb0cdcab5f46697e07bec273607903"],["images/paypal.png","067bd556ce9e4c76538a8057adb6d596"],["images/piio.png","7e72b199c06e14bec80e771d701e6f64"],["images/props-events.png","8996ef20503fbf264a0bfdeafccca74a"],["images/pubnub.png","c8adaae8b1a592516f7791ad82ab25c3"],["images/search-by-algolia.png","3f22d84b817bb896bd5bef0705ff8fc7"],["images/search.png","3a38056b0f3ec4fcac63c4d1c3841cab"],["images/someline.png","d6908ea0b99280afa9655c564d385833"],["images/special-sponsor-spot.png","860ea231e9bd1b3ff35e627eb83bb936"],["images/state.png","6a05b01942c7d2cff4ea0033ded59ebb"],["images/stdlib.png","2ec485cb1b307821c82a850f440fab3f"],["images/strikingly.png","ef615f471302167fbc882f4a5f783dd1"],["images/tde.png","8b43557cde5163b9c7a11cc541cc9b97"],["images/teamextension.png","29f354472d73a5568552f9475d48d5a4"],["images/tidelift.png","831935bd53d7d2d4eea9427c5f874816"],["images/tmvuejs2.png","3ee9bd2b594a166ccc14995630c81cbe"],["images/tooltwist.png","b81bfd5ae608e965d03aaa5a4164373e"],["images/transition.png","5990c1dff7dc7a8fb3b34b4462bd0105"],["images/typescript-type-error.png","1665e7350370c091d397383a7355d3a6"],["images/umoon.png","844f09da5ca82b56a1824b68591cff16"],["images/upyun-large.png","cd66170a5022b5c9444119e3fa5cb83a"],["images/upyun-main-2.jpg","f388a2ba0e0b004e15a7684485fff486"],["images/upyun-main-3.jpg","e618981c7f191cd1fd84905e03538f47"],["images/upyun-main.jpg","1c36d062540e5d97a2ca993776fb7016"],["images/upyun-small.png","7a42625327e1495cec13cbe25c7a200d"],["images/valuecoders.png","1bccdd1583af0609cada15218d98a2f4"],["images/vehikl.png","3bd1b88aa9d242d308e838f2342d7660"],["images/vue-component-with-preprocessors.png","a5cb959052c9cda793e23a6e3a6a122c"],["images/vue-component.png","6a7040cfd4330a536d980c69e2e8dd18"],["images/vuejobs.png","77ed618e17571d1a2d77ad7bc53e8fc4"],["images/vuejobs.svg","c31e68ce1f2663afbe9655c368c6dd35"],["images/vuejsadmin.png","e517dc0c38a982cfca2b123ce33dc261"],["images/vuemastery.png","6f09ce143467fba22039bde3f2070c19"],["images/vueschool.png","cc8c47d63a2c5dc2e073357372e12048"],["images/vuetify.png","c7cfff77abb10162cb0b7c2ed3b6ac51"],["images/xfive.png","2fd3304fe6a1b44d2bfd19876e454d0c"],["index.html","07fc0fc905db722b59e395316db2e11f"],["js/common.js","e601a3f62eed4e057e7e6a3f4d5c7a1f"],["js/css.escape.js","fe4db48c9e3f272a6d12cf1312de889e"],["js/smooth-scroll.min.js","53a7fcc785e987d5ed08302f36de6653"],["js/vue.js","f72e90dab59c9328013bfcd95f1910fa"],["js/vue.min.js","be4c25a10b8ae99067f58011f992adba"],["menu/index.html","382ecb716d2a520dc7b409165eecf02f"],["page/2/index.html","ca8a1ada9029d2be3e61468440cb1d87"],["perf/index.html","045b8e50e5c8ba6fcb2c777d2720d461"],["support-vuejs/index.html","05c64d4d605f8d7341d1637351d7ae77"],["v2/api/index.html","e6a6536c0f08c7ad7a0b6e7e5d189278"],["v2/cookbook/adding-instance-properties.html","65cb52f43a19a686c77c4e64e31565e5"],["v2/cookbook/avoiding-memory-leaks.html","284e1fc5fc466b3bfaeedaa9d948d7d8"],["v2/cookbook/client-side-storage.html","2d659beb7c7e78ce7cbd628b73e0c2e0"],["v2/cookbook/creating-custom-scroll-directives.html","283feeb5d5c84cbd70f5d9cba5de05df"],["v2/cookbook/debugging-in-vscode.html","325ca1367a03561ccffcc87237422f83"],["v2/cookbook/dockerize-vuejs-app.html","a2b0e8a229a8abd01774d85136d00036"],["v2/cookbook/editable-svg-icons.html","8284c8b7388ef7dcb37b47a44c436d03"],["v2/cookbook/form-validation.html","07cfa9a376b9d873e60ca76d408f0195"],["v2/cookbook/index.html","44c469dedfb602b1804f2561889441a8"],["v2/cookbook/packaging-sfc-for-npm.html","22291801d29da590a2f81e3ddbb5d774"],["v2/cookbook/serverless-blog.html","c774ccf6406bfbc0debe3ddd90f51d0d"],["v2/cookbook/unit-testing-vue-components.html","15892a7a6d7cb0e5ec599e0523edbdf5"],["v2/cookbook/using-axios-to-consume-apis.html","c847d43e21b97bcb960d2a71ac24ac6e"],["v2/examples/commits.html","84d534865f839b9db6462fc6bce6a9ed"],["v2/examples/deepstream.html","ad04f7954a72ac302bec9a1413ca294f"],["v2/examples/elastic-header.html","00c243b9a3f37cbe6f573c0e5fc8fa99"],["v2/examples/firebase.html","da6ef5ff08b131a84609ac148a08adff"],["v2/examples/grid-component.html","aaa5046526ee1c1da3d153cd3a59d7ad"],["v2/examples/hackernews.html","e05eb8f8b1e1e508bbf0082c146f4c20"],["v2/examples/index.html","c6cbae91fe054524a0ebef5e61ba668e"],["v2/examples/modal.html","66472e1366451d18fc5c4fed9c0560e9"],["v2/examples/select2.html","567904e5c06883d8c5d98c80749631e0"],["v2/examples/svg.html","c5ea8979df7e8f601c0c6ee5d7a84d12"],["v2/examples/todomvc.html","04014f6fafab0c45a0725d725569bd93"],["v2/examples/tree-view.html","6209a3a60bf8e70461721debc54d716f"],["v2/guide/class-and-style.html","d7bb0b4ede647143b2b46f93e31ed3d8"],["v2/guide/comparison.html","2e3fe57bfed3ade4f427b2582db0cc6d"],["v2/guide/components-custom-events.html","a24543160f935e05b79f7b94e5e14d7e"],["v2/guide/components-dynamic-async.html","77298987998b4c463f0bac4446f69b4f"],["v2/guide/components-edge-cases.html","6bb9803db450c872f8c0f2a8b627081c"],["v2/guide/components-props.html","7406d252cef1491eb58b87959a5bfd49"],["v2/guide/components-registration.html","1544846d40929d303cbdadcc83ea2f05"],["v2/guide/components-slots.html","df6b4cf8c42cecc07f14d16c15e97953"],["v2/guide/components.html","e57f39034f554f23b6331beab536336e"],["v2/guide/computed.html","920d3f358fc8f62a89e38e81c91fa8cc"],["v2/guide/conditional.html","8e8bb8090acaff8e5f4cdd19a831c009"],["v2/guide/custom-directive.html","976f6cb0a1b8cfda8040f3d9cd56071d"],["v2/guide/deployment.html","fb952a286fc44c06d8a011544c304bfc"],["v2/guide/events.html","2ec582a567a2e498370451e977cbbe5a"],["v2/guide/filters.html","8baf86e3dd9a4b1d31d49c1fc0f14b50"],["v2/guide/forms.html","1615efa6bc6f199cabb45e3b475b3b68"],["v2/guide/index.html","9c693e9410dd9ea53ccc3b7f813348b6"],["v2/guide/installation.html","a26a552a862bd944e3fd350d16e559b1"],["v2/guide/instance.html","11e35f47073debaf6411b82a64cc9c64"],["v2/guide/join.html","851dfced423d30231b527eca0a03c335"],["v2/guide/list.html","3f70b304b26f86f94fab78752029094f"],["v2/guide/migration-vue-router.html","8c1e07304f3d83c344e266fe77858341"],["v2/guide/migration-vuex.html","018d54288ad42ada9312dd58bbc4033b"],["v2/guide/migration.html","e0dc63a5df21296bd807bd2fd10a4bc3"],["v2/guide/mixins.html","68e7cf1f28b46fd186e5b6a3be50100e"],["v2/guide/plugins.html","83e8fdde684e643105f176b29e93f56a"],["v2/guide/reactivity.html","e45d2c5774ea108782d48219fd57b181"],["v2/guide/render-function.html","247d481cade4cfe4454acdb98df5bc6b"],["v2/guide/routing.html","1a84c39ef02ed3920949677242f69f8d"],["v2/guide/single-file-components.html","8fcf6fd5ee0188747d6299a3f735a405"],["v2/guide/ssr.html","f5bd850579814670396811a25bd00f6a"],["v2/guide/state-management.html","53b735297e30626f6780cbab4cc0931e"],["v2/guide/syntax.html","3fc9aef9134c38cfaac7e3461155f873"],["v2/guide/team.html","81223261bcfe811694a903fe796333e4"],["v2/guide/transitioning-state.html","612206e79a2f7305cb49dac7c5f64758"],["v2/guide/transitions.html","fe6ecb9d8e2943b3377eeae54f729703"],["v2/guide/typescript.html","29629c93501e3009977a215e6875e9b0"],["v2/guide/unit-testing.html","d62a6eb770477f042f9d1b9badf6f893"],["v2/search/index.html","2615f1b4a4d59a33989dff2d88b2a5be"],["v2/style-guide/index.html","254521a7e74a31810b37a1b472f8ee6c"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







