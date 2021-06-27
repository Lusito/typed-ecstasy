(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[48],{

/***/ "./docs/guide/core/signal.md":
/*!***********************************!*\
  !*** ./docs/guide/core/signal.md ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _signal_md_vue_type_template_id_46b47650___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./signal.md?vue&type=template&id=46b47650& */ "./docs/guide/core/signal.md?vue&type=template&id=46b47650&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");

var script = {}


/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  script,
  _signal_md_vue_type_template_id_46b47650___WEBPACK_IMPORTED_MODULE_0__["render"],
  _signal_md_vue_type_template_id_46b47650___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./docs/guide/core/signal.md?vue&type=template&id=46b47650&":
/*!******************************************************************!*\
  !*** ./docs/guide/core/signal.md?vue&type=template&id=46b47650& ***!
  \******************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_vuepress_core_node_modules_cache_vuepress_cacheIdentifier_4b61893c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_ref_1_1_node_modules_vuepress_markdown_loader_index_js_ref_1_2_signal_md_vue_type_template_id_46b47650___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/@vuepress/core/node_modules/.cache/vuepress","cacheIdentifier":"4b61893c-vue-loader-template"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--1-0!../../../node_modules/vue-loader/lib??ref--1-1!../../../node_modules/@vuepress/markdown-loader??ref--1-2!./signal.md?vue&type=template&id=46b47650& */ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/@vuepress/core/node_modules/.cache/vuepress\",\"cacheIdentifier\":\"4b61893c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/@vuepress/markdown-loader/index.js?!./docs/guide/core/signal.md?vue&type=template&id=46b47650&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_vuepress_core_node_modules_cache_vuepress_cacheIdentifier_4b61893c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_ref_1_1_node_modules_vuepress_markdown_loader_index_js_ref_1_2_signal_md_vue_type_template_id_46b47650___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_vuepress_core_node_modules_cache_vuepress_cacheIdentifier_4b61893c_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_ref_1_1_node_modules_vuepress_markdown_loader_index_js_ref_1_2_signal_md_vue_type_template_id_46b47650___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/@vuepress/core/node_modules/.cache/vuepress\",\"cacheIdentifier\":\"4b61893c-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/@vuepress/markdown-loader/index.js?!./docs/guide/core/signal.md?vue&type=template&id=46b47650&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/@vuepress/core/node_modules/.cache/vuepress","cacheIdentifier":"4b61893c-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??ref--1-1!./node_modules/@vuepress/markdown-loader??ref--1-2!./docs/guide/core/signal.md?vue&type=template&id=46b47650& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ContentSlotsDistributor',{attrs:{"slot-key":_vm.$parent.slotKey}},[_c('h1',{attrs:{"id":"signal"}},[_c('a',{staticClass:"header-anchor",attrs:{"href":"#signal"}},[_vm._v("#")]),_vm._v(" Signal")]),_vm._v(" "),_c('p',[_vm._v("A signal is an easy way to emit events and listen for them. You can use signals in your game for example to tell listeners, that something exploded.")]),_vm._v(" "),_c('p',[_vm._v("A while back I came across this neat article about a good C++11 signal system:\n"),_c('a',{attrs:{"href":"https://testbit.eu/cpp11-signal-system-performance/","target":"_blank","rel":"noopener noreferrer"}},[_vm._v("Performance of a C++11 Signal System"),_c('OutboundLink')],1),_vm._v("\ntyped-ecstasy uses "),_c('a',{attrs:{"href":"https://github.com/Lusito/typed-signals","target":"_blank","rel":"noopener noreferrer"}},[_vm._v("typed-signals"),_c('OutboundLink')],1),_vm._v(", a TypeScript port of said article.")]),_vm._v(" "),_c('h2',{attrs:{"id":"built-in-signals"}},[_c('a',{staticClass:"header-anchor",attrs:{"href":"#built-in-signals"}},[_vm._v("#")]),_vm._v(" Built-In Signals")]),_vm._v(" "),_c('p',[_vm._v("typed-ecstasy uses signals in the "),_c('RouterLink',{attrs:{"to":"/api/classes/entitymanager.html"}},[_vm._v("EntityManager")]),_vm._v(", specifically:")],1),_vm._v(" "),_c('ul',[_c('li',[_c('RouterLink',{attrs:{"to":"/api/classes/entitymanager.html#onadd"}},[_vm._v("onAdd")])],1),_vm._v(" "),_c('li',[_c('RouterLink',{attrs:{"to":"/api/classes/entitymanager.html#onremove"}},[_vm._v("onRemove")])],1),_vm._v(" "),_c('li',[_c('RouterLink',{attrs:{"to":"/api/classes/entitymanager.html#onaddforfamily"}},[_vm._v("onAddForFamily")])],1),_vm._v(" "),_c('li',[_c('RouterLink',{attrs:{"to":"/api/classes/entitymanager.html#onremoveforfamily"}},[_vm._v("onRemoveForFamily")])],1)]),_vm._v(" "),_c('p',[_vm._v("These will be emitted when an entity gets added/removed to/from the engine or a specific family.")])])}
var staticRenderFns = []



/***/ })

}]);
//# sourceMappingURL=48.b71e6452.js.map