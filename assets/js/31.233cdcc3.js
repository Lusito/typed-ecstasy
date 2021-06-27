(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{407:function(t,e,s){"use strict";s.r(e);var r=s(44),a=Object(r.a)({},(function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"class-sortediteratingsystem"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#class-sortediteratingsystem"}},[t._v("#")]),t._v(" Class: SortedIteratingSystem")]),t._v(" "),s("p",[t._v("Like "),s("RouterLink",{attrs:{to:"/api/classes/iteratingsystem.html"}},[t._v("IteratingSystem")]),t._v(", but sorted using a comparator.\nIt processes each Entity of a given "),s("RouterLink",{attrs:{to:"/api/classes/family.html"}},[t._v("Family")]),t._v(" in the order specified by a comparator and\ncalls "),s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#processentity"}},[t._v("processEntity")]),t._v(" for each Entity every time the EntitySystem is updated. This is really just a convenience\nclass as rendering systems tend to iterate over a list of entities in a sorted manner. Adding entities will cause\nthe entity list to be resorted. Call "),s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#forcesort"}},[t._v("forceSort")]),t._v(" if you changed your sorting criteria.")],1),t._v(" "),s("h2",{attrs:{id:"hierarchy"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hierarchy"}},[t._v("#")]),t._v(" Hierarchy")]),t._v(" "),s("ul",[s("li",[s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[s("code",[t._v("EntitySystem")])])],1),t._v(" "),s("p",[t._v("↳ "),s("strong",[s("code",[t._v("SortedIteratingSystem")])])]),t._v(" "),s("p",[t._v("↳↳ "),s("RouterLink",{attrs:{to:"/api/classes/sortedsubiteratingsystem.html"}},[s("code",[t._v("SortedSubIteratingSystem")])])],1)])]),t._v(" "),s("h2",{attrs:{id:"table-of-contents"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#table-of-contents"}},[t._v("#")]),t._v(" Table of contents")]),t._v(" "),s("h3",{attrs:{id:"constructors"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#constructors"}},[t._v("#")]),t._v(" Constructors")]),t._v(" "),s("ul",[s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#constructor"}},[t._v("constructor")])],1)]),t._v(" "),s("h3",{attrs:{id:"properties"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#properties"}},[t._v("#")]),t._v(" Properties")]),t._v(" "),s("ul",[s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#engine"}},[t._v("engine")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#family"}},[t._v("family")])],1)]),t._v(" "),s("h3",{attrs:{id:"methods"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#methods"}},[t._v("#")]),t._v(" Methods")]),t._v(" "),s("ul",[s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#forcesort"}},[t._v("forceSort")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#getentities"}},[t._v("getEntities")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#getpriority"}},[t._v("getPriority")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#isenabled"}},[t._v("isEnabled")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#ondisable"}},[t._v("onDisable")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#onenable"}},[t._v("onEnable")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#processentity"}},[t._v("processEntity")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#setcomparator"}},[t._v("setComparator")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#setenabled"}},[t._v("setEnabled")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#setpriority"}},[t._v("setPriority")])],1),t._v(" "),s("li",[s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#update"}},[t._v("update")])],1)]),t._v(" "),s("h2",{attrs:{id:"constructors-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#constructors-2"}},[t._v("#")]),t._v(" Constructors")]),t._v(" "),s("h3",{attrs:{id:"constructor"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#constructor"}},[t._v("#")]),t._v(" constructor")]),t._v(" "),s("p",[t._v("• "),s("strong",[t._v("new SortedIteratingSystem")]),t._v("("),s("code",[t._v("family")]),t._v(", "),s("code",[t._v("comparator")]),t._v(")")]),t._v(" "),s("h4",{attrs:{id:"parameters"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#parameters"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",{staticStyle:{"text-align":"left"}},[t._v("Name")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Type")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("family")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[s("RouterLink",{attrs:{to:"/api/classes/family.html"}},[s("code",[t._v("Family")])])],1),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[t._v("The family of entities iterated over in this system.")])]),t._v(" "),s("tr",[s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("comparator")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[s("RouterLink",{attrs:{to:"/api/modules.html#entitycomparator"}},[s("code",[t._v("EntityComparator")])])],1),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[t._v("The comparator to sort the entities.")])])])]),t._v(" "),s("h4",{attrs:{id:"overrides"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#overrides"}},[t._v("#")]),t._v(" Overrides")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[t._v("EntitySystem")]),t._v("."),s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html#constructor"}},[t._v("constructor")])],1),t._v(" "),s("h4",{attrs:{id:"defined-in"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/systems/SortedIteratingSystem.ts#L31",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/systems/SortedIteratingSystem.ts:31"),s("OutboundLink")],1)]),t._v(" "),s("h2",{attrs:{id:"properties-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#properties-2"}},[t._v("#")]),t._v(" Properties")]),t._v(" "),s("h3",{attrs:{id:"engine"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#engine"}},[t._v("#")]),t._v(" engine")]),t._v(" "),s("p",[t._v("• "),s("code",[t._v("Readonly")]),t._v(" "),s("strong",[t._v("engine")]),t._v(": "),s("RouterLink",{attrs:{to:"/api/classes/engine.html"}},[s("code",[t._v("Engine")])])],1),t._v(" "),s("p",[t._v("The engine of this system.")]),t._v(" "),s("h4",{attrs:{id:"inherited-from"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#inherited-from"}},[t._v("#")]),t._v(" Inherited from")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[t._v("EntitySystem")]),t._v("."),s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html#engine"}},[t._v("engine")])],1),t._v(" "),s("h4",{attrs:{id:"defined-in-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-2"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/core/AbstractSystem.ts#L14",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/core/AbstractSystem.ts:14"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"family"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#family"}},[t._v("#")]),t._v(" family")]),t._v(" "),s("p",[t._v("• "),s("code",[t._v("Readonly")]),t._v(" "),s("strong",[t._v("family")]),t._v(": "),s("RouterLink",{attrs:{to:"/api/classes/family.html"}},[s("code",[t._v("Family")])])],1),t._v(" "),s("p",[t._v("The Family used when the system was created.")]),t._v(" "),s("h4",{attrs:{id:"defined-in-3"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-3"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/systems/SortedIteratingSystem.ts#L23",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/systems/SortedIteratingSystem.ts:23"),s("OutboundLink")],1)]),t._v(" "),s("h2",{attrs:{id:"methods-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#methods-2"}},[t._v("#")]),t._v(" Methods")]),t._v(" "),s("h3",{attrs:{id:"forcesort"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#forcesort"}},[t._v("#")]),t._v(" forceSort")]),t._v(" "),s("p",[t._v("▸ "),s("strong",[t._v("forceSort")]),t._v("(): "),s("code",[t._v("void")])]),t._v(" "),s("p",[t._v("Call this if the sorting criteria have changed.\nThe actual sorting will be delayed until the entities are processed.")]),t._v(" "),s("h4",{attrs:{id:"returns"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("void")])]),t._v(" "),s("h4",{attrs:{id:"defined-in-4"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-4"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/systems/SortedIteratingSystem.ts#L57",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/systems/SortedIteratingSystem.ts:57"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"getentities"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#getentities"}},[t._v("#")]),t._v(" getEntities")]),t._v(" "),s("p",[t._v("▸ "),s("strong",[t._v("getEntities")]),t._v("(): "),s("RouterLink",{attrs:{to:"/api/classes/entity.html"}},[s("code",[t._v("Entity")])]),t._v("[]")],1),t._v(" "),s("h4",{attrs:{id:"returns-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-2"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entity.html"}},[s("code",[t._v("Entity")])]),t._v("[]")],1),t._v(" "),s("p",[t._v("The set of entities processed by the system.")]),t._v(" "),s("h4",{attrs:{id:"defined-in-5"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-5"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/systems/SortedIteratingSystem.ts#L104",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/systems/SortedIteratingSystem.ts:104"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"getpriority"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#getpriority"}},[t._v("#")]),t._v(" getPriority")]),t._v(" "),s("p",[t._v("▸ "),s("strong",[t._v("getPriority")]),t._v("(): "),s("code",[t._v("number")])]),t._v(" "),s("h4",{attrs:{id:"returns-3"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-3"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("number")])]),t._v(" "),s("p",[t._v("The priority of the system. Do not override this!")]),t._v(" "),s("h4",{attrs:{id:"inherited-from-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#inherited-from-2"}},[t._v("#")]),t._v(" Inherited from")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[t._v("EntitySystem")]),t._v("."),s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html#getpriority"}},[t._v("getPriority")])],1),t._v(" "),s("h4",{attrs:{id:"defined-in-6"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-6"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/core/AbstractSystem.ts#L64",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/core/AbstractSystem.ts:64"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"isenabled"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#isenabled"}},[t._v("#")]),t._v(" isEnabled")]),t._v(" "),s("p",[t._v("▸ "),s("strong",[t._v("isEnabled")]),t._v("(): "),s("code",[t._v("boolean")])]),t._v(" "),s("h4",{attrs:{id:"returns-4"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-4"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("boolean")])]),t._v(" "),s("p",[t._v("True if the system is enabled.")]),t._v(" "),s("h4",{attrs:{id:"inherited-from-3"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#inherited-from-3"}},[t._v("#")]),t._v(" Inherited from")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[t._v("EntitySystem")]),t._v("."),s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html#isenabled"}},[t._v("isEnabled")])],1),t._v(" "),s("h4",{attrs:{id:"defined-in-7"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-7"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/core/AbstractSystem.ts#L46",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/core/AbstractSystem.ts:46"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"ondisable"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ondisable"}},[t._v("#")]),t._v(" onDisable")]),t._v(" "),s("p",[t._v("▸ "),s("code",[t._v("Protected")]),t._v(" "),s("strong",[t._v("onDisable")]),t._v("(): "),s("code",[t._v("void")])]),t._v(" "),s("p",[t._v("Called when this system is removed from the manager or being disabled.")]),t._v(" "),s("h4",{attrs:{id:"returns-5"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-5"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("void")])]),t._v(" "),s("h4",{attrs:{id:"overrides-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#overrides-2"}},[t._v("#")]),t._v(" Overrides")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[t._v("EntitySystem")]),t._v("."),s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html#ondisable"}},[t._v("onDisable")])],1),t._v(" "),s("h4",{attrs:{id:"defined-in-8"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-8"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/systems/SortedIteratingSystem.ts#L88",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/systems/SortedIteratingSystem.ts:88"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"onenable"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#onenable"}},[t._v("#")]),t._v(" onEnable")]),t._v(" "),s("p",[t._v("▸ "),s("code",[t._v("Protected")]),t._v(" "),s("strong",[t._v("onEnable")]),t._v("(): "),s("code",[t._v("void")])]),t._v(" "),s("p",[t._v("Called when this system is added to the manager or re-enabled after being disabled.")]),t._v(" "),s("h4",{attrs:{id:"returns-6"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-6"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("void")])]),t._v(" "),s("h4",{attrs:{id:"overrides-3"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#overrides-3"}},[t._v("#")]),t._v(" Overrides")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[t._v("EntitySystem")]),t._v("."),s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html#onenable"}},[t._v("onEnable")])],1),t._v(" "),s("h4",{attrs:{id:"defined-in-9"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-9"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/systems/SortedIteratingSystem.ts#L82",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/systems/SortedIteratingSystem.ts:82"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"processentity"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#processentity"}},[t._v("#")]),t._v(" processEntity")]),t._v(" "),s("p",[t._v("▸ "),s("code",[t._v("Protected")]),t._v(" "),s("code",[t._v("Abstract")]),t._v(" "),s("strong",[t._v("processEntity")]),t._v("("),s("code",[t._v("entity")]),t._v(", "),s("code",[t._v("deltaTime")]),t._v("): "),s("code",[t._v("void")])]),t._v(" "),s("p",[t._v("This method is called on every entity on every update call of the EntitySystem.\nOverride this to implement your system's specific processing.")]),t._v(" "),s("h4",{attrs:{id:"parameters-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#parameters-2"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",{staticStyle:{"text-align":"left"}},[t._v("Name")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Type")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("entity")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[s("RouterLink",{attrs:{to:"/api/classes/entity.html"}},[s("code",[t._v("Entity")])])],1),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[t._v("The current Entity being processed.")])]),t._v(" "),s("tr",[s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("deltaTime")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("number")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[t._v("The delta time between the last and current frame.")])])])]),t._v(" "),s("h4",{attrs:{id:"returns-7"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-7"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("void")])]),t._v(" "),s("h4",{attrs:{id:"defined-in-10"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-10"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/systems/SortedIteratingSystem.ts#L116",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/systems/SortedIteratingSystem.ts:116"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"setcomparator"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#setcomparator"}},[t._v("#")]),t._v(" setComparator")]),t._v(" "),s("p",[t._v("▸ "),s("strong",[t._v("setComparator")]),t._v("("),s("code",[t._v("comparator")]),t._v("): "),s("code",[t._v("void")])]),t._v(" "),s("p",[t._v("Update the comparator to sort the entities. Implicitly calls "),s("RouterLink",{attrs:{to:"/api/classes/sortediteratingsystem.html#forcesort"}},[t._v("forceSort")]),t._v(".")],1),t._v(" "),s("h4",{attrs:{id:"parameters-3"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#parameters-3"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",{staticStyle:{"text-align":"left"}},[t._v("Name")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Type")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("comparator")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[s("RouterLink",{attrs:{to:"/api/modules.html#entitycomparator"}},[s("code",[t._v("EntityComparator")])])],1),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[t._v("The comparator to sort the entities.")])])])]),t._v(" "),s("h4",{attrs:{id:"returns-8"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-8"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("void")])]),t._v(" "),s("h4",{attrs:{id:"defined-in-11"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-11"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/systems/SortedIteratingSystem.ts#L48",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/systems/SortedIteratingSystem.ts:48"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"setenabled"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#setenabled"}},[t._v("#")]),t._v(" setEnabled")]),t._v(" "),s("p",[t._v("▸ "),s("strong",[t._v("setEnabled")]),t._v("("),s("code",[t._v("enabled")]),t._v("): "),s("code",[t._v("void")])]),t._v(" "),s("p",[t._v("Enable or disable the system. A disabled system will not be processed during an update.")]),t._v(" "),s("h4",{attrs:{id:"parameters-4"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#parameters-4"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",{staticStyle:{"text-align":"left"}},[t._v("Name")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Type")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("enabled")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("boolean")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[t._v("The new state.")])])])]),t._v(" "),s("h4",{attrs:{id:"returns-9"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-9"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("void")])]),t._v(" "),s("h4",{attrs:{id:"inherited-from-4"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#inherited-from-4"}},[t._v("#")]),t._v(" Inherited from")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[t._v("EntitySystem")]),t._v("."),s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html#setenabled"}},[t._v("setEnabled")])],1),t._v(" "),s("h4",{attrs:{id:"defined-in-12"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-12"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/core/AbstractSystem.ts#L39",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/core/AbstractSystem.ts:39"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"setpriority"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#setpriority"}},[t._v("#")]),t._v(" setPriority")]),t._v(" "),s("p",[t._v("▸ "),s("strong",[t._v("setPriority")]),t._v("("),s("code",[t._v("priority")]),t._v("): "),s("code",[t._v("void")])]),t._v(" "),s("p",[t._v("Set the system priority. You can set the priority with when adding the system as well.")]),t._v(" "),s("h4",{attrs:{id:"parameters-5"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#parameters-5"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",{staticStyle:{"text-align":"left"}},[t._v("Name")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Type")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Description")])])]),t._v(" "),s("tbody",[s("tr",[s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("priority")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("number")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[t._v("The priority to execute this system with (lower means higher priority).")])])])]),t._v(" "),s("h4",{attrs:{id:"returns-10"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-10"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("void")])]),t._v(" "),s("h4",{attrs:{id:"inherited-from-5"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#inherited-from-5"}},[t._v("#")]),t._v(" Inherited from")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[t._v("EntitySystem")]),t._v("."),s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html#setpriority"}},[t._v("setPriority")])],1),t._v(" "),s("h4",{attrs:{id:"defined-in-13"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-13"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/core/AbstractSystem.ts#L55",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/core/AbstractSystem.ts:55"),s("OutboundLink")],1)]),t._v(" "),s("hr"),t._v(" "),s("h3",{attrs:{id:"update"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#update"}},[t._v("#")]),t._v(" update")]),t._v(" "),s("p",[t._v("▸ "),s("strong",[t._v("update")]),t._v("("),s("code",[t._v("deltaTime")]),t._v("): "),s("code",[t._v("void")])]),t._v(" "),s("p",[t._v("The update method called every tick.")]),t._v(" "),s("h4",{attrs:{id:"parameters-6"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#parameters-6"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",{staticStyle:{"text-align":"left"}},[t._v("Name")]),t._v(" "),s("th",{staticStyle:{"text-align":"left"}},[t._v("Type")])])]),t._v(" "),s("tbody",[s("tr",[s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("deltaTime")])]),t._v(" "),s("td",{staticStyle:{"text-align":"left"}},[s("code",[t._v("number")])])])])]),t._v(" "),s("h4",{attrs:{id:"returns-11"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#returns-11"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),s("p",[s("code",[t._v("void")])]),t._v(" "),s("h4",{attrs:{id:"overrides-4"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#overrides-4"}},[t._v("#")]),t._v(" Overrides")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html"}},[t._v("EntitySystem")]),t._v("."),s("RouterLink",{attrs:{to:"/api/classes/entitysystem.html#update"}},[t._v("update")])],1),t._v(" "),s("h4",{attrs:{id:"defined-in-14"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#defined-in-14"}},[t._v("#")]),t._v(" Defined in")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://github.com/Lusito/typed-ecstasy/blob/master/src/systems/SortedIteratingSystem.ts#L94",target:"_blank",rel:"noopener noreferrer"}},[t._v("src/systems/SortedIteratingSystem.ts:94"),s("OutboundLink")],1)])])}),[],!1,null,null,null);e.default=a.exports}}]);