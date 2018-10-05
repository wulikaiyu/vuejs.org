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

### Dependency Injection

Earlier, when we described [Accessing the Parent Component Instance](#Accessing-the-Parent-Component-Instance), we showed an example like this:

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

In this component, all descendants of `<google-map>` needed access to a `getMap` method, in order to know which map to interact with. Unfortunately, using the `$parent` property didn't scale well to more deeply nested components. That's where dependency injection can be useful, using two new instance options: `provide` and `inject`.

The `provide` options allows us to specify the data/methods we want to **provide** to descendent components. In this case, that's the `getMap` method inside `<google-map>`:

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

Then in any descendants, we can use the `inject` option to receive specific properties we'd like to add to that instance:

```js
inject: ['getMap']
```

You can see the [full example here](https://jsfiddle.net/chrisvfritz/tdv8dt3s/). The advantage over using `$parent` is that we can access `getMap` in _any_ descendant component, without exposing the entire instance of `<google-map>`. This allows us to more safely keep developing that component, without fear that we might change/remove something that a child component is relying on. The interface between these components remains clearly defined, just as with `props`.

In fact, you can think of dependency injection as sort of "long-range props", except:

* ancestor components don't need to know which descendants use the properties it provides
* descendant components don't need to know where injected properties are coming from

<p class="tip">However, there are downsides to dependency injection. It couples components in your application to the way they're currently organized, making refactoring more difficult. Provided properties are also not reactive. This is by design, because using them to create a central data store scales just as poorly as <a href="#Accessing-the-Root-Instance">using <code>$root</code></a> for the same purpose. If the properties you want to share are specific to your app, rather than generic, or if you ever want to update provided data inside ancestors, then that's a good sign that you probably need a real state management solution like <a href="https://github.com/vuejs/vuex">Vuex</a> instead.</p>

Learn more about dependency injection in [the API doc](https://vuejs.org/v2/api/#provide-inject).

## Programmatic Event Listeners

So far, you've seen uses of `$emit`, listened to with `v-on`, but Vue instances also offer other methods in its events interface. We can:

- Listen for an event with `$on(eventName, eventHandler)`
- Listen for an event only once with `$once(eventName, eventHandler)`
- Stop listening for an event with `$off(eventName, eventHandler)`

You normally won't have to use these, but they're available for cases when you need to manually listen for events on a component instance. They can also be useful as a code organization tool. For example, you may often see this pattern for integrating a 3rd-party library:

```js
// Attach the datepicker to an input once
// it's mounted to the DOM.
mounted: function () {
  // Pikaday is a 3rd-party datepicker library
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// Right before the component is destroyed,
// also destroy the datepicker.
beforeDestroy: function () {
  this.picker.destroy()
}
```

This has two potential issues:

- It requires saving the `picker` to the component instance, when it's possible that only lifecycle hooks need access to it. This isn't terrible, but it could be considered clutter.
- Our setup code is kept separate from our cleanup code, making it more difficult to programmatically clean up anything we set up.

You could resolve both issues with a programmatic listener:

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

Using this strategy, we could even use Pikaday with several input elements, with each new instance automatically cleaning up after itself:

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

See [this fiddle](https://jsfiddle.net/chrisvfritz/1Leb7up8/) for the full code. Note, however, that if you find yourself having to do a lot of setup and cleanup within a single component, the best solution will usually be to create more modular components. In this case, we'd recommend creating a reusable `<input-datepicker>` component.

To learn more about programmatic listeners, check out the API for [Events Instance Methods](https://vuejs.org/v2/api/#Instance-Methods-Events).

<p class="tip">Note that Vue's event system is different from the browser's <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget API</a>. Though they work similarly, <code>$emit</code>, <code>$on</code>, and <code>$off</code> are <strong>not</strong> aliases for <code>dispatchEvent</code>, <code>addEventListener</code>, and <code>removeEventListener</code>.</p>

## Circular References

### Recursive Components

Components can recursively invoke themselves in their own template. However, they can only do so with the `name` option:

``` js
name: 'unique-name-of-my-component'
```

When you register a component globally using `Vue.component`, the global ID is automatically set as the component's `name` option.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

If you're not careful, recursive components can also lead to infinite loops:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

A component like the above will result in a "max stack size exceeded" error, so make sure recursive invocation is conditional (i.e. uses a `v-if` that will eventually be `false`).

### Circular References Between Components

Let's say you're building a file directory tree, like in Finder or File Explorer. You might have a `tree-folder` component with this template:

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

Then a `tree-folder-contents` component with this template:

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

When you look closely, you'll see that these components will actually be each other's descendent _and_ ancestor in the render tree - a paradox! When registering components globally with `Vue.component`, this paradox is resolved for you automatically. If that's you, you can stop reading here.

However, if you're requiring/importing components using a __module system__, e.g. via Webpack or Browserify, you'll get an error:

```
Failed to mount component: template or render function not defined.
```

To explain what's happening, let's call our components A and B. The module system sees that it needs A, but first A needs B, but B needs A, but A needs B, etc. It's stuck in a loop, not knowing how to fully resolve either component without first resolving the other. To fix this, we need to give the module system a point at which it can say, "A needs B _eventually_, but there's no need to resolve B first."

In our case, let's make that point the `tree-folder` component. We know the child that creates the paradox is the `tree-folder-contents` component, so we'll wait until the `beforeCreate` lifecycle hook to register it:

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

Or alternatively, you could use Webpack's asynchronous `import` when you register the component locally:

``` js
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

Problem solved!

## Alternate Template Definitions

### Inline Templates

When the `inline-template` special attribute is present on a child component, the component will use its inner content as its template, rather than treating it as distributed content. This allows more flexible template-authoring.

``` html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```

<p class="tip">However, <code>inline-template</code> makes the scope of your templates harder to reason about. As a best practice, prefer defining templates inside the component using the <code>template</code> option or in a <code>&lt;template&gt;</code> element in a <code>.vue</code> file.</p>

### X-Templates

Another way to define templates is inside of a script element with the type `text/x-template`, then referencing the template by an id. For example:

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

<p class="tip">These can be useful for demos with large templates or in extremely small applications, but should otherwise be avoided, because they separate templates from the rest of the component definition.</p>

## Controlling Updates

Thanks to Vue's Reactivity system, it always knows when to update (if you use it correctly). There are edge cases, however, when you might want to force an update, despite the fact that no reactive data has changed. Then there are other cases when you might want to prevent unnecessary updates.

### Forcing an Update

<p class="tip">If you find yourself needing to force an update in Vue, in 99.99% of cases, you've made a mistake somewhere.</p>

You may not have accounted for change detection caveats [with arrays](https://vuejs.org/v2/guide/list.html#Caveats) or [objects](https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats), or you may be relying on state that isn't tracked by Vue's reactivity system, e.g. with `data`.

However, if you've ruled out the above and find yourself in this extremely rare situation of having to manually force an update, you can do so with [`$forceUpdate`](../api/#vm-forceUpdate).

### Cheap Static Components with `v-once`

Rendering plain HTML elements is very fast in Vue, but sometimes you might have a component that contains **a lot** of static content. In these cases, you can ensure that it's only evaluated once and then cached by adding the `v-once` directive to the root element, like this:

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

