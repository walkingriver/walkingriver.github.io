---
layout: post
title: Custom Angular Checkbox with [(ngModel)] Support
date: '2019-08-22T15:15:00.002-04:00'
author: Michael Callaghan
tags: [angular,css,html]
layout: post
feature: assets/img/angular-logo.png
thumbnail: https://walkingriver.com/assets/img/angular-logo.png
cover_image: https://walkingriver.com/assets/img/angular-logo.png
canonical_url: https://walkingriver.com/custom-angular-checkbox/
published: true
---

Today I needed to add some custom styles to a checkbox in an Angular 8 app. I found a simple example of what I wanted to do, implemented entirely with CSS and HTML, and containing no imperative code. Delighted with this discovery, I copied the CSS into my page and got it working with a few tweaks. Then I wondered what it would take to turn it into a custom component I could reuse. As it turns out, it was harder than I thought, but not overwhelming. The solution is described here.

<!--more-->

# Custom-Styled Checkbox

The UI design I was trying to copy required a custom-styled checkbox. This one needed a fat white check mark inside a green box when checked, and an empty gray square when unchecked. Further, the design called for the checkbox control itself to be larger than normal, and had a specific requirement for the label's spacing. 

## CSS
I will start by showing the final CSS in case you want to follow along, but I will not be describing the styles. The point of this post is to show the Angular component. If you want a more complete explanation of the styling, this is where I got the HTML and CSS I used. [Link: W3School](https://www.w3schools.com/howto/howto_css_custom_checkbox.asp). I tweaked their CSS a bit, but not by much. 


```css

/* The container */
.cb-container {
  display: inline-block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height: 22px;
}

/* Hide the browser's default checkbox */
.cb-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #ffffff;
  border: 1px solid #00aa00;
  border-radius: 2px;
}

/* On mouse-over, add a grey background color */
.cb-container:hover input ~ .checkmark {
  background-color: #ffffff;
}

/* When the checkbox is checked, add a blue background */
.cb-container input:checked ~ .checkmark {
  background-color: #00aa00;
  border-color: #00aa00;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.cb-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.cb-container .checkmark:after {
  left: 6px;
  top:0px;
  width: 7px;
  height: 17px;
  border: solid white;
  border-width: 0 4px 4px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
```
<caption>checkbox.component.scss</caption>


## The Component
With the checkbox styled the way I wanted it, my next thought was that I should bundle it as an Angular component so that I could reuse it on other pages. Then I realized that the UX design required that the checkbox label should always be on the right, the same size, and the same distance from the box. At that point, it really sounds more and more like a custom component. And since I am now thinking of a custom component, I should see about making it work with `[(ngModel)]`.

Here is how I envisioned the custom checkbox component would be used.

```html
<app-checkbox 
  text="Remember Me" 
  [disabled]="!isLoggedIn" 
  [(ngModel)]="remember">
</app-checkbox>
```

This means I needed way to pass in a string to be used for the label, a boolean to set the `disabled` property, and 2-way binding for the value of the checkbox itself. The first two were pretty easy. The third required some custom Angular code.

### Create the component
The first order of business is to create the component, with the help of the Angular CLI. 

```sh
ng generate component --module shared --inline-template --spec false shared/checkbox 

CREATE src/app/shared/checkbox/checkbox.component.scss (0 bytes)
CREATE src/app/shared/checkbox/checkbox.component.ts (292 bytes)
UPDATE src/app/shared/shared.module.ts (1080 bytes)
```

I chose the `--inline-template` option, because the entire HTML template for the component is only three lines, as we will see shortly.

The component has no business logic to speak of, so I skipped tests. I may regret that later, but it will do for now. This command created the two files listed above, and added an import into my existing SharedModule. Any other pages or components that want to include my CheckboxComponent need to import this SharedModule in their own modules.

### Add the HTML Template
Next, I needed to add the modest HTML to the newly-created component. Here is the HTML:

```html
<label class="cb-container">{{text}}
<input type="checkbox" [checked]="isChecked" (change)="onChanged($event)" (blur)="onBlur($event)" [disabled]="disabled">
<span class="checkmark"></span></label>
})
```

As you can see, there is a `<label>` tag wrapping a normal HTML `<input type="checkbox">` tag. The label has a one-way binding from the component's `text` field. Even though the label text appears first, the CSS ensures that the checkbox itself is pulled to the left of the label.

Next, the input's `checked` attribute it one-way bound from the component's `isChecked` field. This 

The input's `change` event is wired up to the component's `onChange()` function, passing the DOM event as a parameter. Likewise, its `blur` event is wired up to the component's `onBlur()` function.

Finally, the input's `disabled` attribute is one-way bound to the component's `disabled` field. Unsurprisingly, if set to a "truthy" value, this will cause the checkbox to be disabled.

### Component Fields
With the HTML template complete, the next step is to create the fields and functions referred to. I added the two fields at the top of the component's class, and the event handler after the constructor.

```javascript
// Bindable properties
@Input() text: string;
@Input() disabled = false;

. . . 

onChanged($event) {
  this.isChecked = $event && $event.target && $event.target.checked;
}
```

Both of the fields are annotated with Angular's `@Input` decorator, which is what enables their values to be specified from the parent component, using standard HTML syntax. 

```html
<app-checkbox text="Remember me" disabled="false"></app-checkbox>
```

The `onChanged` function is called whenever the `<input>` changed (in other words, the checkbox is checked or cleared). The `$event` parameter is a standard [HTML DOM Event object](https://www.w3schools.com/jsref/dom_obj_event.asp). It is in this function where I manually set the `isChecked` field to either `true` or `false`, based on the actual state of the checkbox. I am being overly paranoid by ensuring that both `$event` and `$event.target` have truthy values before retrieving the `checked` attribute. It may be paranoid, but it works.

### No Value Accessor
At this point, there is a custom checkbox that can be dropped inside any other component. It will work, except for two things: 

1. The host container will not be able to get the state of the checkbox at runtime.
1. The `[(ngModel)]` attribute cannot be used. If it is, you will get a nasty error at runtime that there is "No Value Accessor" on the component. 

Fortunately, these two problems share a common solution. The custom component needs to implement Angular's `ControlValueAccessor` interface.

### ControlValueAccessor
If you look up this interface, you will find that it consists of four functions, each of which will need to be implemented on the component. We will look at those functions one by one.

#### writeValue()
This function is called by Angular whenever a value change is being made from the parent, or hosting component. All you need to do is handle the value being passed in. Here, I am simply storing it, which incidentally changes the checkbox state, due to its internal data binding.

```javascript
writeValue(obj: boolean): void {
  this.isChecked = obj;
}
```

### registerOnChange() 
This function is called by Angular to provide a callback function that the component needs call whenever change has occurred. 

```javascript
onChange = (_) => {}; // No-op

registerOnChange(fn: any): void {
  // Replace internal function with the one provided
  this.onChange = fn;
}
```

The pattern I am following here is to create a default `onChange` function on the component, which does absolutely nothing. Then when Angular calls `registerOnChange`, the component's onChange function is replaced with the callback function provided.

However, that is only half of the story. The custom component needs to call it, which happens in the `onChanged` function that is bound to the checkbox. To this, the component simply calls the internal `onChange` function, which should be the callback registered by Angular. If no callback has been registered, the default no-op function is called. This prevents the need for an "is null guard."

```javascript
onChanged($event) {
  this.isChecked = $event && $event.target && $event.target.checked;

  // Call the parent's registered OnChange function, if any.
  // This lets it know the internal component value has changed.
  this.onChange(this.isChecked);
}
```

#### registerOnTouched()
This one is a little more obscure, and it doesn't seem to be necessary for a checkbox control. According to the [official documentation](https://angular.io/api/forms/ControlValueAccessor#registerOnTouched):

> When implementing registerOnTouched in your own value accessor, save the given function so your class calls it when the control should be considered blurred or "touched"."

This should not be confused with a mobile device's concept of "touched." Instead, it refers to a form having been touched or blurred. In this custom component, I have wired up the checkbox's blur event. The pattern is the same as with `registerOnChange()`.

```javascript
onBlur = (_) => {}; // No-op

registerOnTouched(fn: any): void {
  // Call the parent's registered onTouched function, if any.
  // This lets it know that the checkbox lost focus.
  this.onBlur = fn;
}
```

#### setDisabledState()
This function does what you might think: It is called by the forms API when the custom component should be disabled. In this case, I am setting an internal `isDisabled` field to whatever boolean value is provided. This value is then reflected on the component through data binding, and the checkbox is enabled or disabled appropriately. 

```javascript
setDisabledState?(isDisabled: boolean): void {
  this.disabled = isDisabled;
}
```

In the case of a checkbox, it is all pretty straightforward. You could also imagine a more complex control, which might consist of multiple input elements that can each be disabled. Angular Forms sees the custom component as a single control. When it disables that control, individual internal elements might need to be disabled according to different rules. Exactly how you handle that in your own controls is up to you.

### Registering the Provider
There is one last piece to getting everything to work happily together. The code inside the custom component is complete, but Angular still knows nothing about it. The solution has changed since Angular was released, and I found multiple solutions that no longer work. This example was tested on Angular 8.

The final step to register the custom component is to have the component provide the `NG_VALUE_ACCESSOR` inside the `providers` array inside its `@Component` decorator, as shown here:

```javascript
providers: [{
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
}]
```

This code indicates to Angular that the component provides its own `NG_VALUE_ACCESSOR`, using an existing component. The catch-22 here is that the component has not yet been defined. Angular allows this through the use of the `forwardRef` function. Basically, it tells the dependency injection system that the component provided is yet to be defined, but will be available at runtime. The parameter to the `forwardRef` function is a fat arrow function that returns the custom component's class.

The last property, `multi: true` indicates that there may be more than one `NG_VALUE_ACCESSOR`s being provided to the application, potentially from multiple places. It is enough to remember to set it to `true`.

## Wrapping up
At this point, the custom checkbox component is ready to be dropped onto any other page or component in the application. Because it was defined in a custom module, any other component wanting to use it would need to import that module into its own module (or the app's module). 

As shown above, here is a complete example of using this custom component inside of another component. 

```html
<app-checkbox 
  text="Remember Me" 
  [disabled]="!isLoggedIn" 
  [(ngModel)]="remember">
</app-checkbox>
```

As you can see, it took a little bit of effort, but the result is that `[(ngModel)]` now simply "just works," which was the goal.

Finally, because the component is recognized by Angular as a form control, it can be added to a Reactive Form, complete with custom validation rules, should you so desire. 

# The Complete Component
As a convenience, here is the complete component:

```javascript
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  template: `
  <label class="cb-container">{{text}}
  <input type="checkbox" [checked]="isChecked" (change)="onChanged($event)" (blur)="onBlur($event)" [disabled]="disabled">
  <span class="checkmark"></span></label>`,
  styleUrls: ['./checkbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
  }]
})
export class CheckboxComponent implements ControlValueAccessor {
  // Bindable properties
  @Input() text: string;
  @Input() disabled = false;

  // Internal properties
  isChecked = false;
  onChange = (_ => { });
  onBlur = (_ => { });

  writeValue(obj: boolean): void {
    this.isChecked = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onBlur = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChanged($event) {
    this.isChecked = $event && $event.target && $event.target.checked;
    this.onChange(this.isChecked);
  }
}
```

# For More Information
- [Angular Docs for the ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor)
- [W3School Custom Checkbox](https://www.w3schools.com/howto/howto_css_custom_checkbox.asp)
- [HTML DOM Event object](https://www.w3schools.com/jsref/dom_obj_event.asp)

