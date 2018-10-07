---
title: 处理边界情况
type: guide
order: 106
---

> 本页面会假定你已经阅读过 [组件基础](components.html)。如果你还不熟悉组件，请先阅读组件基础后再阅读本页面。

<p class="tip">本页面记录了一些边界情况的处理方案，也就是说，在遇到一些特殊情况时，需要对 Vue 的规则做出小的调整。不过还请注意，这些方案都有其缺点，或者会造成危害。我们会在每个示例中注明出来，因此在决定使用每个方案时请记住这点。</p>

## 访问元素 & 访问组件

在多数场景中，避免直接触及其他组件实例，或手动操作 DOM 元素，是比较推荐的做法。下面是一些需要触及的示例，最好在合适的场景才选择这种方案。

### 访问根实例

在由 `new Vue` 创建出的实例下的每个子组件中，可以通过 `$root` 属性访问根实例。举例来说，在根实例中：

```js
// Vue 根实例
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```

所有子组件中，都可以访问到此根实例，把它看作是一个全局存放的变量：

```js
// 获取根实例的数据
this.$root.foo

// 设置根实例的数据
this.$root.foo = 2

// 访问根实例的 computed 属性
this.$root.bar

// 调用根实例的方法
this.$root.baz()
```

<p class="tip">对于 demo 示例或着只有少量组件的小型应用程序来说非常方便。但是，这种模式无法很好地扩展应用到中型或大型应用程序，因此我们强烈建议，在大多数情况下使用 <a href="https://github.com/vuejs/vuex">Vuex</a> 来管理状态。</p>

### 访问父组件实例

和 `$root` 类似，`$parent` 属性可以用于在子组件中访问父组件实例。这种方式可能会让你沉溺于直接触及父组件实例数据的偷懒方式，而不再使用通过 prop 传递数据。

<p class="tip">在大多数情况下，触及父组件会使你的应用程序更难以调试和理解，特别是如果你在父组件中改变数据。稍后查看该组件时，会难以确定这些状态变化的来源。</p>

然而，还是有一些场景（具体来说，例如需要共享的组件库），_可能_会比较适合直接访问父组件实例。例如，在一些抽象组件中，会直接与 JavaScript API 交互，而不是直接渲染 HTML，比如这些假想的 Google Maps 组件一样：

```html
<google-map>
  <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
</google-map>
```

`<google-map>` 组件可能定义了所有子组件都需要访问的 `map` 属性。在这种情况下，`<google-map-markers>` 可能需要使用类似 `this.$parent.getMap` 方式来获取 map 属性，以便为其添加一组标记点(marker)。[这里](https://jsfiddle.net/chrisvfritz/ttzutdxh/) 你可以查看这种方式的实际情况。

但是请注意，以这种方式创建出来的组件，具有固有的脆弱性。例如，假想我们在这两个组件之间，添加了一个新的 `<google-map-region>` 组件，而 `<google-map-markers>` 放置于最内，这样就只会去渲染那个区域内的标记点：

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

然后，在 `<google-map-markers>` 内部，你可能需要做一次 hack，这样去触及到 map 属性：

```js
var map = this.$parent.map || this.$parent.$parent.map
```

很快代码就会一片混乱。这就是为什么要为任意深度的后代组件提供上下文信息，所以我们推荐 [依赖注入](#Dependency-Injection) 方式。

### 访问子组件实例或子元素

尽管存在 props 和事件，但有时你可能仍然需要在 JavaScript 中直接访问一个子组件。想要实现这个目的，可以使用 `ref` 属性，来为子组件分配一个引用 ID。例如：

```html
<base-input ref="usernameInput"></base-input>
```

现在，在这个定义过 `ref` 的组件中，你可以调用：

```js
this.$refs.usernameInput
```

来访问 `<base-input>` 实例。这种访问方式可能会很有帮助，例如，在父组件中，通过可编程方式获取子组件文本框的焦点。在这种场景中，同样的方式，在 `<base-input>` 组件内部也使用 `ref` 属性，来提供对于特定元素的引用，例如：

```html
<input ref="input">
```

然后，在子组件中定义方法，以供父组件中调用：

```js
methods: {
  // Used to focus the input from the parent
  focus: function () {
    this.$refs.input.focus()
  }
}
```

这样，就可以在父组件中，获取到 `<base-input>` 组件内部文本框的焦点：

```js
this.$refs.usernameInput.focus()
```

当 `ref` 和 `v-for` 一起使用的时候，ref 获取到的是一个包含对应数据源的子组件构成的数组。

<p class="tip"><code>$refs</code> 只会在组件渲染完成之后填充，并且它们不是响应式的。这意味着，它只是一个子组件封装的应急出口 - 你应该避免在模板或计算属性中访问 <code>$refs</code>。</p>

### 依赖注入

前面，我们在介绍 [访问父组件实例](#访问父组件实例) 时，展示过一个这样的示例：

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

在这个组件中，所有后代 `<google-map>` 需要访问一个 `getMap` 方法，以便获取到要交互的 map 对象。不幸的是，在深层嵌套的组件中，使用 `$parent` 无法很好进行扩展。这时候我们就需要用到依赖注入(dependency injection)，其中会使用两个实例选项：`provide` and `inject`。

`provide` 选项允许我们指定，我们想要提供给后代组件的数据(data)/方法(methods)。在这个示例中，我们需要提供给后代组件的是 `<google-map>` 组件内部的 `getMap` 方法。

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

然后，在所有后代组件中，我们可以使用 `inject` 选项，来接收那些我们需要添加到当前实例中的特定属性：

```js
inject: ['getMap']
```

你可以在 [这里查看完整示例](https://jsfiddle.net/chrisvfritz/tdv8dt3s/)。相比直接引用 `$parent` 的优势在于，我们可以在_任何_一个后代组件中，直接访问 `getMap` 方法，无须暴露整个 `<google-map>` 实例。这可以使我们更加安全地继续开发该组件，而不必担心可能会修改或移除子组件所依赖的祖先组件中的内容。这些组件之间的接口保持着清晰的定义，就像是 `props` 一样。

事实上，你可以把依赖注入看作一组 "扩大范围的 props"，以下情况使用依赖注入：

* 祖先组件不需要知道哪些后代组件使用它提供的属性
* 后代组件不需要知道被注入的属性来自何处

<p class="tip">然而，依赖注入还是有缺陷的。它将子组件与你应用程序当前组织方式耦合起来，使得重构变得更加困难。提供的属性也不是响应式的。这是出于设计考虑，因为使用它们来创建一个中心化数据仓库，和 <a href="#访问根实例">使用 <code>$root</code></a> 本质相同，都会难以维护。如果想要共享的属性，不是普通属性，而是应用程序级别的特定属性，或者希望想要祖先组件内部修改提供的数据，而后代组件响应式的更新，那么，你就需要使用一个真正的状态管理解决方案，就像 <a href="https://github.com/vuejs/vuex">Vuex</a> 这样的状态管理库。</p>

在 [API 参考文档](https://vuejs.org/v2/api/#provide-inject) 中，了解更多关于依赖注入的知识。

## 可编程的事件监听器

到目前为止，你已经学会使用 `$emit`，并且知道使用 `v-on` 监听它触发的事件，但是 Vue 实例还在其事件接口中提供了其他方法。我们可以：

- 使用 `$on(eventName, eventHandler)` 监听一个事件
- 使用 `$once(eventName, eventHandler)` 一次性地监听一个事件
- 使用 `$off(eventName, eventHandler)` 停止监听一个事件

通常不需要用到这些可编程的事件监听器，但是它们可用于这种情况，就是当你需要手动监听组件实例上的事件时。还可以用作代码组织工具。例如，你可能经常会看到这种集成第三方库的用法：

```js
// 在挂载到 DOM 时，将日期选择器插件
// 应用到一个文本框上
mounted: function () {
  // Pikaday 是一个第三方日期选择器插件库
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// 在组件被销毁之前，
// 也销毁日期选择器。
beforeDestroy: function () {
  this.picker.destroy()
}
```

这里会有两个潜在的问题：

- 需要在组件实例中保存此 `picker` 实例，然而，只有生命周期钩子才可能需要访问它。这并不算严重的问题，只是多余出一个 picker 实例属性。
- 我们的安装代码与清理代码彼此分离，这会使以编程方式清理我们设置的任何内容时，变得更加困难。

你应该通过一个可编程的事件监听器，来解决这两个问题：

```js
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

使用这种策略，我们甚至可以将 Pikaday 应用到多个输入框元素，每个新的实例都会在钩子触发后自动清理自身：

```js
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```

请在 [fiddle](https://jsfiddle.net/chrisvfritz/1Leb7up8/) 中查看完整示例代码。注意，即使我们提供了这种策略，如果你发现自己必须在单个组件中完成大量安装和清理工作，最佳解决方案通常还是创建出更加模块化的组件。在这种情况下，我们建议你将这些代码抽离，创建出一个可复用的 `<input-datepicker>` 组件。

想要了解更多可编程事件监听器的内容，请查看 [实例方法 / 事件](https://vue.docschina.org/v2/api/#实例方法-事件) 相关的 API。

<p class="tip">注意，Vue 事件系统与浏览器中的 <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget API</a> 不同。尽管它们之间运行机制类似，但是 <code>$emit</code>, <code>$on</code> 和 <code>$off</code> <strong>并不是</strong> <code>dispatchEvent</code>, <code>addEventListener</code> 和 <code>removeEventListener</code>。</p>

## 循环引用

### 递归组件

组件可以在它本身的模板中，递归地调用自身。但是，只有具有 `name` 选项时，才能这么做：

``` js
name: 'unique-name-of-my-component'
```

在使用 `Vue.component` 全局注册一个组件时, 组件的全局 ID 会被自动设置为其 `name` 选项。

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

如果你不够小心谨慎, 递归组件可能会导致无限循环:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

类似如上所示的组件，会导致一个 "max stack size exceeded(超出最大调用栈大小)" 错误，因此，确保递归调用具有终止条件（例如，使用最终会得到 `false` 的 `v-if`）。

### 组件之间的循环引用

假设你正在创建一个文件目录树，就像是 Mac 下的 Finder 或是 Windows 下的文件资源管理器。你可能有一个使用如下模板的 `tree-folder` 组件：

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

然后，有一个使用如下模板的 `tree-folder-contents` 组件：

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

仔细观察后，你就会发现：在渲染树中，这些组件实际上都是彼此的_后代_和_祖先_，这是矛盾且相悖的！在使用 `Vue.component` 全局注册组件时，这个问题会自动解决。如果以上已经解决你的问题，你可以在这里停止阅读。

然而，如果你使用了__模块系统__（例如通过 webpack 或 Browserify 等打包工具），并通过 require/import 导入组件的话，你就会看到一个错误：

```
Failed to mount component: template or render function not defined.
```

为了解释这是如何产生的，我们可以将组件称为 A 和 B。模块系统看到它需要导入 A，但是首先 A 需要导入 B，但是 B 又需要导入 A，A 又需要导入 B，等等，如此形成了一个死循环，模块系统并不知道如何在先不解析一个组件的情况下，完全解析另外一个组件。为了修复这个问题，我们需要给模块系统一个切入点，我们可以告诉它，A 需要导入 B，但是没有必要先解析 B。

在这种场景中，将 `tree-folder` 组件做为切入点。我们知道制造矛盾的是 `tree-folder-contents` 子组件，所以，我们需要在 `tree-folder` 组件的 `beforeCreate` 这一生命周期钩子函数中，去注册 `tree-folder-contents` 组件：

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

或者，还可以在局部注册组件时，使用 webpack 提供的异步 `import`，

``` js
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

这样问题就解决了！

## 模板定义的其他替代方式

### 内联模板

当子组件具有 `inline-template` 特性时，这个组件会把它内部的内容当作它的模板，而不是把这些内部内容当作分发内容。这会使模板编写更加灵活。

``` html
<my-component inline-template>
  <div>
    <p>这些内容会被编译为组件自身的模板。</p>
    <p>而不是父组件输送的分发内容。</p>
  </div>
</my-component>
```

<p class="tip">但是，<code>inline-template</code> 会使模板的作用域变得难以推测。所以最佳实践还是在组件内部使用 <code>template</code> 选项来定义模板，或者在 <code>.vue</code> 文件中，定义一个 <code>&lt;template&gt;</code> 元素。</p>

### X-Templates

另一种定义模板的方式是，使用一个 type 为 `text/x-template` 的 script 元素，然后通过一个 id 来引用这个模板。例如：

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

这种方式适用于具有较多模板内容的演示示例，或者用于小型应用程序，但是在其他情况下应该避免使用，因为这会把模板从组件定义的其他选项中脱离出来。

## Controlling Updates

Thanks to Vue's Reactivity system, it always knows when to update (if you use it correctly). There are edge cases, however, when you might want to force an update, despite the fact that no reactive data has changed. Then there are other cases when you might want to prevent unnecessary updates.

### Forcing an Update

<p class="tip">If you find yourself needing to force an update in Vue, in 99.99% of cases, you've made a mistake somewhere.</p>

You may not have accounted for change detection caveats [with arrays](https://vuejs.org/v2/guide/list.html#Caveats) or [objects](https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats), or you may be relying on state that isn't tracked by Vue's reactivity system, e.g. with `data`.

However, if you've ruled out the above and find yourself in this extremely rare situation of having to manually force an update, you can do so with [`$forceUpdate`](../api/#vm-forceUpdate).

### Cheap Static Components with `v-once`
### 使用 `v-once` 创建低开销的静态组件

Rendering plain HTML elements is very fast in Vue, but sometimes you might have a component that contains **a lot** of static content. In these cases, you can ensure that it's only evaluated once and then cached by adding the `v-once` directive to the root element, like this:
尽管在 Vue 中渲染 HTML 很快，不过当组件中包含**大量**静态内容时，可以考虑使用 `v-once` 将渲染结果缓存起来，就像这样：

``` js
Vue.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Terms of Service</h1>
      ... a lot of static content ...
    </div>
  `
})
```

<p class="tip">Once again, try not to overuse this pattern. While convenient in those rare cases when you have to render a lot of static content, it's simply not necessary unless you actually notice slow rendering -- plus, it could cause a lot of confusion later. For example, imagine another developer who's not familiar with <code>v-once</code> or simply misses it in the template. They might spend hours trying to figure out why the template isn't updating correctly.</p>

