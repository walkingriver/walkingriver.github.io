# Array Functions

TypeScript has several first-class array functions that are useful and convenient. 

## Find

```TypeScript
fruits = ['apple', 'orange', 'banana', 'grape', 'cherry', 'lemon'];
grape = this.fruits.find( f => f === 'grape');
console.log(this.grape);
```

## Filter

```typescript
fruits = ['apple', 'orange', 'banana', 'grape', 'cherry', 'lemon’];

eFruits = this.fruits.filter(f => f.indexOf('e') >=0 );
console.log(this.eFruits);
```

## Map

```typescript
fruits = ['apple', 'orange', 'banana', 'grape', 'cherry', 'lemon'];

fruitLetters = this.fruits.map(f => f.substr(0, 1));
console.log(this.fruitLetters);
```

## Every

```typescript
fruits = ['apple', 'orange', 'banana', 'grape', 'cherry', 'lemon'];

allSixLetterFruits = this.fruits
	.every(f => f.length === 6);

console.log(this.allSixLetterFruits); // false
```

## Some

```typescript
fruits = ['apple', 'orange', 'banana', 'grape', 'cherry', 'lemon'];

atLeastOneSixLetterFruit = this.fruits
	.some(f => f.length === 6);

console.log(this.atLeastOneSixLetterFruit); // true
```

## Sort

```typescript
fruits = ['apple', 'orange', 'banana', 'grape', 'cherry', 'lemon'];

sortedFruits = this.fruits.sort((a, b) => a > b ? 1 : 0);

console.log(this.sortedFruits);
```


# Introduction to Angular 
There are some patterns and syntax idioms I want to introduce early before you get into the code. I like to think of them as Angularisms (yes, I just made up that word).
To work through the example in this chapter, open a browser to https://stackblitz.com/fork/angular This will provide you with an immediate sandbox where you can follow along. As soon as you do, you should see the following code in the center panel, a file call app.component.ts.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
}
```

Let us start by talking about Angular’s concept of separation of concerns. In Angular, UI functionality is encapsulated in components. A component can represent anything from a piece of text, a button, a form, or even an entire page. Components can contain other components, and they can communicate with each other through well-defined interfaces.

You specify that a TypeScript class is a component using the @component decorator. Decorators provide additional information by annotating or modifying classes or class members. 

In this case, the component decorator provides additional metadata to Angular about how the class will behave.

The selector attribute tells angular to expose this component using the html tag <my-app>.

The templateUrl attribute indicates that the HTML markup can be found in the file specified, app.component.html. 

Likewise, with the styleUrls. Notice that this value is an array, which means you can provide more than one CSS file. 

If you look on the left-hand panel, you should see both of these files.

The executable portion of the component code is found inside the class definition. This one contains a single line of code, meaning it is not doing much. 

This is what you mean by a “separation of concerns.” The code, markup, and styles are all separated from one another. 

 Take a look at the markup, which is found in the template file, app.component.html. This file is pure HTML containing the content. 

```typescript
<hello name="{{ name }}"></hello>
<p>
  Start editing to see some magic happen :)
</p>
```

Notice the first line contains another custom HTML tag, <hello>. That is defined in hello.component.ts, which you will review shortly.

Inside of that tag is an attribute called name, set to the value {{ name }}. This is an Angular “one-way” binding expression. During the page rendering phase, Angular sees that expression, and knows to set the value of the name attribute to the run-time value of the variable name on the component. It would probably be less confusing if they used a different variable name. 

Return to the component code and change the name variable. I changed mine to look like this.

```typescript
export class AppComponent  {
  name = 'Mike';
}
```

Look at the result that appears in the right-hand pane. The value you provided should be displayed instead of the original value.
 
Open up the file hello.component.ts and look at its implementation. You first thing you may notice is that all of its markup and styling is defined in the same file. 

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h1>Hello {{name}}!</h1>`,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent  {
  @Input() name: string;
}
```

Instead of providing a templateUrl and styleUrls, both of them are provided directly in the file. It is worth pointing out that this is still a form of separation of concerns. The HTML markup is clearly separated from the styling and component code.

Personally, I would not recommend you do this, except in the simplest of components. That said, there are many proponents of keeping all of your component code in one file. Find your own balance; it is probably somewhere in between “always” and “never” doing this.

Inside the component code is a single line of code.

```typescript
  @Input() name: string;
```

The `@Input` decorator specifies that name is a string attribute that can be provided in the markup of any client that uses this component. 

## Component Reuse
The real power behind this is that you can reuse the component anywhere, simply replacing its name attribute, and it will render consistently. 

Back in app.component.html, make a few copies of the <hello> tag and provide different names. Something like this, perhaps.

```html
<hello name="{{ name }}"></hello>
<hello name="Greg"></hello>
<hello name="Jonathan"></hello>
<hello name="Neil"></hello>
<p>
  Start editing to see some magic happen :)
</p>
```

Now it looks like this, and I do not have be concerned with how the <hello> tag works behind the scenes. I can simply reuse it.
 
## ngFor
But what if you have a bunch of names? Change the name variable on the component and make it an array called names.

```typescript
export class AppComponent  {
  names = ['Mike', 'Greg', 'Jonathan', 'Neil'];
}
```

The cool thing about reusing components this way is that you do not have to change the hello component at all. You simply need to change the calling code to use `ngFor`, an Angular directive used to create multiple instances of the hello component based on the number of elements in the referenced array. 

You use an `ngFor` by providing it as an attribute to the element you want replicated. The value inside the quotes is the looping expression. It consists of the keyword let followed by the variable name to be used inside the element and any of its children, the keyword of, and the name of the array on the component to loop over.

```html
<hello *ngFor="let name of names" name="{{name}}"></hello>
```

The asterisk, which is required, is an indication to Angular that this directive will manipulate the DOM, or the page’s document object model, in some way.
## Attribute Binding
There is another Binding syntax that works with HTML attributes. If you want to set the value of an attribute to a value on your component, use square brackets around the attribute name. 

```html
<hello *ngFor="let name of names" [name]="name"></hello>
```

Here, `name`, in square brackets, refers to the HTML attribute of the custom component. The other `name`, in quotes, is the name of the variable in the ngFor expression. When you are binding to an HTML attribute, this is my preferred method because you can run just about any code you want inside of those quotes.

## HTML Event Binding
You can also bind to HTML events. Any event can become a trigger to execute a function on the component. The simplest way to illustrate that is to create a button and provide a click handler.

You do that by surrounding the event name (in this case, click) with parenthesis. Then inside the quotes, call the component function you want to execute.

You can pass parameters to the function, which is often the case when creating an event binding inside an *ngFor, passing the current looping variable to the event handler.
In this case, just call toggle(). 

```html
<button (click)="toggle()">Click Me</button>
```

Back inside the component, you need to implement the toggle function. Add this code inside the app component, right after the names array.

```typescript
isToggled = false;

toggle() {
  this.isToggled = !this.isToggled;
}
```

Now when you click the toggle button, the value of the isToggled variable will flip between true and false.

## ngIf 

The isToggled variable is useless until you do something with it. Add a new line inside the app component template file. 
In this case, add a paragraph tag, give it an ngIf directive, and set it to “isToggled.”

```html
<p *ngIf="isToggled">
  I am toggled on!!!
</p>
```

ngIf will conditionally render the HTML tag if the value inside the quotes evaluates to a truthy value. Notice that ngIf also requires an asterisk because it modifies the DOM. 
 
Now as you click the button, that paragraph will appear and disappear. 

# Two-way form bindings

## ngModel

```html
<label for="nameField">Membership ID</label> <input id="nameField" type="text" [(ngModel)]="name">
<p>
Your name is: {{name}}
</p>
```

## Disabled elements

```html
 <label for="nameField">Membership ID</label>
<input id="nameField" type="text"
[(ngModel)]="name">

<button (click)="name=''" [disabled]="!name">
Clear
</button>

<p>
Your name is: {{name}}
</p>
```

# Introduction to Observables

Promises were introduced early in this book. In this chapter, I will touch on them again, and then use that as a segue to Observables.

## Promises Revisited
The easiest way to think about promises is to imagine you want to place an order for some cool new consumer electronics. Maybe you order a new camera, a pair of speakers, and some purple socks. That’s right, some cool purple, electronic, socks. 
In many traditional programming languages, everything was synchronous. An operation had to complete before you could start the next one. 

Imagine how painful it would be if you had to wait for your camera to arrive. Then you could order your speakers. And only once you got your speakers could you order your socks. Your feet would freeze.

The modern web, however, is asynchronous. So are JavaScript and TypeScript. In an asynchronous operation, your program is mostly waiting for external events to occur.  Don’t confuse that with multitasking, though. 

Multitasking would mean your programming doing multiple things at once, so to speak. With asynchronous programming, you can order the camera, then order the speakers, and then order the socks. Each order is placed one at a time, you simply don’t need to wait for the item to be delivered. In fact, at the time you place each order, you have no idea how long each will take, what order they will arrive, or even whether or not your order will be delivered at all. 

A promise is something that will happen at some point in the future. Either the promise will be resolved, which means it was successfully delivered; or it will be rejected, often due to an error of some kind.

The typical web use of a promise is to retrieve a network resource, such as a web page, or data from a remote web service. 

Your app could request some data from multiple web services, receiving a promise for each. As those promises are resolved or rejected, your app can then take the appropriate action. 

You won’t know the order they return, or even need to know or care when the promises resolve.

## Observables
Observables are different from Promises in that an observable represents a stream of events. Rather than order cool things like cameras and socks, think of observables as more like text messages, stock prices, or sports scores. They can appear at any time, with no explicit action on your part. Granted, you could turn your phone off or simply refuse to look at it. Observables are like that too. You can ignore them. You can start and stop them. You can filter and throttle them. To do those things, you use subscriptions. 

## Subscriptions
A subscription is what you use to get the results of an observable. Not surprisingly, this is called subscribing to an observable. Your application can theoretically subscribe to an unlimited number of observables. It’s up to you what you do with the information you subscribe to. 

### Filtering Observables
You can filter the events to only a subset of those you’re interested in. Maybe you only care about the New England Patriots scores, for example.

```typescript
this.sub = this.scores()
.pipe(filter(score => score.team.name === 'Patriots'))
.subscribe(score => this.updateScore(score));
```
### Throttling Observables
Or you could throttle the events so you only get stock price updates once per hour. 

```typescript
this.sub = this.stockPrices()
.pipe(throttleTime(3600000))
.subscribe(price => this.updatePrice(price));
```

### Filtering and Throttling
You could also combine those concepts, and only get daily prices for your employer’s stock. It’s really up to you. 

```typescript
this.sub = this.stockPrices()
.pipe(throttleTime(3600000))
.pipe(filter(price => price.symbol === 'ACME'))
.subscribe(price => this.updatePrice(price));
```

### Unsubscribing Subscriptions

When you no longer care about an observable, you can (and should) unsubscribe. 

There is a lot more to all three concepts, but that covers the basics, and should be enough for us to move on.

```typescript
this.sub.unsubscribe();
```

# Angular HttpClient
Angular provides a high level service called the HttpClient, which we can use to make calls to web services.

## Sample API Endpoint
(Chuck Norris)

## HTTP GET
HttpClient has a simple function you can use to retrieve data from a remote web service. It’s a generic function,  so you can pass a type into it. It provides 

```typescript
import { HttpClient } from '@angular/common/http';

const obs$ = this.http.get<T>(url, httpOptions);

const sub = obs$.subscribe(x => {
  console.log(x);
});
```

## HTTP POST

```typescript
import { HttpClient } from '@angular/common/http’;

const obs$ = this.http.post<T>(url, body, httpOptions);
```

## Options

```typescript
httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    Authorization: 'BEARER x987hiouj3kmtrhlg0f9',
    'Content-Type': 'application/json'
  })
};
```

## Why Observables for HTTP?

Have you wondered why if we’re only getting a single value from the web service, why are we using observables, since those represent a stream of events over time? Wouldn’t a promise make more sense?

The easy answer is that Angular’s HttpClient functions return Observables, so that’s what we use. A longer answer will include things about how the RxJs library is far more robust, with complicated retry, filtering, error handling logic, plus a whole lot more. For our purposes, the code might be better off using promises, and where appropriate, we’ll do just that. 

# Angular Services

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
baseUrl = 'https://us-central1-my-notify-api.cloudfunctions.net/api';
options = {
  headers: new HttpHeaders({
    'Accept': 'application/json'
  })
};
```