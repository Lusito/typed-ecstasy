(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{388:function(t,s,e){"use strict";e.r(s);var n=e(44),a=Object(n.a)({},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"dependency-injection"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#dependency-injection"}},[t._v("#")]),t._v(" Dependency Injection")]),t._v(" "),e("p",[t._v("typed-ecstasy uses "),e("a",{attrs:{href:"https://docs.typestack.community/typedi/v/develop/01-getting-started",target:"_blank",rel:"noopener noreferrer"}},[t._v("typedi"),e("OutboundLink")],1),t._v(" for dependency injection.")]),t._v(" "),e("p",[t._v("If you know typedi, you can already know most of this. It might be a good idea to quickly look over this though.")]),t._v(" "),e("p",[t._v("Imports are obviously coming from typedi:")]),t._v(" "),e("div",{staticClass:"language-typescript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-typescript"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Service"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Inject "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"typedi"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h2",{attrs:{id:"what-is-dependency-injection"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#what-is-dependency-injection"}},[t._v("#")]),t._v(" What is Dependency Injection?")]),t._v(" "),e("p",[t._v("In short:")]),t._v(" "),e("ul",[e("li",[t._v("Without dependency injection, you might need to pass dependencies (a shared service, a configuration object, etc.) manually to each system using its constructor or setters. This requires the code, which creates an instance of the system to know what the system needs.")]),t._v(" "),e("li",[t._v("With dependency injection, you can simply define what the system needs in its constructor or via annotation and the dependency injection container will take care of creating the instance and supplying these dependencies.")])]),t._v(" "),e("p",[e("strong",[t._v("Notice:")]),t._v(" Since the container takes care of creating instances, you no longer have the ability to manually specify arguments to the constructor of a system/service. You'll either have to pass these using setters or supply them as dependencies.")]),t._v(" "),e("h2",{attrs:{id:"service-annotation"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#service-annotation"}},[t._v("#")]),t._v(" @Service Annotation")]),t._v(" "),e("p",[t._v("All services (for example EntitySystem implementations) must be annotated with "),e("code",[t._v("@Service()")]),t._v(":")]),t._v(" "),e("div",{staticClass:"language-typescript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-typescript"}},[e("code",[t._v("@"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("Service")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("MovementSystem")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("EntitySystem")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h2",{attrs:{id:"constructor-injection"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#constructor-injection"}},[t._v("#")]),t._v(" Constructor Injection")]),t._v(" "),e("p",[t._v("If you need an instance of another service in a system, you can simply put it into the constructor:")]),t._v(" "),e("div",{staticClass:"language-typescript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-typescript"}},[e("code",[t._v("@"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("Service")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AssetService")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n@"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("Service")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RenderSystem")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("EntitySystem")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("constructor")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("assetService"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" AssetService"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//...")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h2",{attrs:{id:"property-injection"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#property-injection"}},[t._v("#")]),t._v(" Property Injection")]),t._v(" "),e("p",[t._v("Alternatively, you can also specify the dependency with an "),e("code",[t._v("@Inject()")]),t._v(" annotation:")]),t._v(" "),e("div",{staticClass:"language-typescript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-typescript"}},[e("code",[t._v("@"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("Service")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RenderSystem")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("EntitySystem")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    @"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("Inject")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("readonly")]),t._v(" assetService"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" AssetService"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// notice the ! above, so typescript won't complain about the missing initialization")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("Keep in mind though, that you won't be able to access this property in the constructor, since it will be set after instantiation!\nIf you need to use it after instantiation, you can do this by overriding the "),e("RouterLink",{attrs:{to:"/api/classes/abstractsystem.html#onenable"}},[t._v("onEnable")]),t._v(" method:")],1),t._v(" "),e("div",{staticClass:"language-typescript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-typescript"}},[e("code",[t._v("@"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("Service")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RenderSystem")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("EntitySystem")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    @"),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("Inject")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("readonly")]),t._v(" assetService"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" AssetService"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// notice the ! above, so typescript won't complain about the missing initialization")]),t._v("\n\n    "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("protected")]),t._v(" override "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("onEnable")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" foo "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("assetService"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("get")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"foo"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h2",{attrs:{id:"container-instance"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#container-instance"}},[t._v("#")]),t._v(" Container Instance")]),t._v(" "),e("p",[t._v("You can use "),e("RouterLink",{attrs:{to:"/api/classes/engine.html#getcontainer"}},[t._v("engine.getContainer()")]),t._v(" to get the instance of the dependency injection container for an engine.\nAlternatively, it's also possible to let it be injected in your service. Use "),e("code",[t._v("ContainerInstance")]),t._v(" from typedi as type.")],1),t._v(" "),e("p",[t._v("Using the container is not needed for creating/adding systems, this is done automatically for you. Use the container instance if you need more control.")]),t._v(" "),e("h2",{attrs:{id:"what-is-injectable"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#what-is-injectable"}},[t._v("#")]),t._v(" What is Injectable?")]),t._v(" "),e("p",[t._v("By default, you can inject everything that is marked with the "),e("code",[t._v("@Service")]),t._v(" annotation. In addition, the Engine constructor adds a couple of extra classes, which can be injected:")]),t._v(" "),e("ul",[e("li",[e("RouterLink",{attrs:{to:"/guide/core/engine.html"}},[t._v("Engine")]),t._v(" The engine instance")],1),t._v(" "),e("li",[e("RouterLink",{attrs:{to:"/api/classes/allocator.html"}},[t._v("Allocator")]),t._v(" (either a plain or a "),e("RouterLink",{attrs:{to:"/guide/core/pooling.html"}},[t._v("pooled")]),t._v(" allocator)")],1),t._v(" "),e("li",[t._v("The typedi "),e("code",[t._v("ContainerInstance")]),t._v(" itself.")])]),t._v(" "),e("p",[t._v("If you want to inject something, that is not marked with "),e("code",[t._v("@Service")]),t._v(", you must set it on the container manually:")]),t._v(" "),e("div",{staticClass:"language-typescript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-typescript"}},[e("code",[t._v("engine"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("getContainer")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("EntityFactory"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" myEntityFactory"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])}),[],!1,null,null,null);s.default=a.exports}}]);