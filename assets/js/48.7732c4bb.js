(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{425:function(t,s,a){"use strict";a.r(s);var n=a(44),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"family"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#family"}},[t._v("#")]),t._v(" Family")]),t._v(" "),a("p",[t._v("Entities with the same set of components can be grouped in "),a("RouterLink",{attrs:{to:"/api/classes/family.html"}},[t._v("Family")]),t._v(" objects.")],1),t._v(" "),a("p",[t._v("A "),a("RouterLink",{attrs:{to:"/api/classes/family.html"}},[t._v("Family")]),t._v(" is defined by:")],1),t._v(" "),a("ul",[a("li",[t._v("A set of components the entity must have.")]),t._v(" "),a("li",[t._v("A set of components of which the entity must have at least one.")]),t._v(" "),a("li",[t._v("A set of components the entity cannot have.")])]),t._v(" "),a("h2",{attrs:{id:"obtaining-a-family"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#obtaining-a-family"}},[t._v("#")]),t._v(" Obtaining a Family")]),t._v(" "),a("p",[t._v("You can obtain a "),a("RouterLink",{attrs:{to:"/api/classes/family.html"}},[t._v("Family")]),t._v(" by specifying the list of component classes the entities belonging to said family must (not) possess. This should satisfy most of your entity classification needs.")],1),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" family "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Family"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("all")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("PositionComponent"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" VelocityComponent"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("get")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("p",[t._v("Imagine we want to group all entities that should be rendered. It certainly must have a position and either a texture or a particle system. Additionally, we need to make sure it is not invisible. These constraints can easily be represented the following way.")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" family "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Family"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("all")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("PositionComponent"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("one")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("TextureComponent"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" ParticleComponent"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("exclude")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("InvisibleComponent"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("get")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("h2",{attrs:{id:"getting-a-list-of-entities-which-belong-to-a-family"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getting-a-list-of-entities-which-belong-to-a-family"}},[t._v("#")]),t._v(" Getting a List of Entities Which Belong to a Family")]),t._v(" "),a("p",[t._v("The "),a("RouterLink",{attrs:{to:"/api/classes/entitymanager.html"}},[t._v("EntityManager")]),t._v(" has the capability of providing the full collection of entities that match a specific family.")],1),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" entities "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" engine"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("entities"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("forFamily")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("family"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("p",[t._v("Usually you'd store the result in the attribute of an "),a("RouterLink",{attrs:{to:"/guide/core/entitysystem.html"}},[t._v("EntitySystem")]),t._v(" (the returned array will always be the same and as such up-to-date).")],1),t._v(" "),a("p",[t._v("You can iterate over them either with a "),a("em",[t._v("for of")]),t._v(" loop:")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" entity "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("of")]),t._v(" entities"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("But also using a classic loop:")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("let")]),t._v(" i "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" i "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v(" entities"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("++")]),t._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" entity "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" entities"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("i"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])])}),[],!1,null,null,null);s.default=e.exports}}]);