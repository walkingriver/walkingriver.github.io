---
layout: post
title: Diagnosing Random Angular Test Failures
date: '2021-01-14'
author: Michael D. Callaghan
tags: 
- Unit Tests
- Angular
- Web Development
layout: post
feature: https://walkingriver.com/assets/img/angular-jasmine-karma.png
thumbnail: https://walkingriver.com/assets/img/angular-jasmine-karma.png
cover_image: https://walkingriver.com/assets/img/angular-jasmine-karma.png
canonical_url: https://walkingriver.com/angular-test-failures/
published: true
---

Have you ever had an intermittent or random failure in your unit tests? I did, and I was pulling my hair out trying to figure out the problem. Below I will describe how I finally managed to find the offending tests and solve the problem.

<!--more-->

# Background
![Angular + Jasmine + Karma](/assets/img/angular-jasmine-karma.png)

I am using Angular 10 in this specific project, writing unit tests with Jasmine, and running them with Karma.

My karma-jasmine configuration when I began was completely empty, meaning I was using the defaults. Not understanding those defaults caused much of my problem. Out of the box, your unit tests are run in a random order. I was vaguely aware of this, but it had completely slipped my mind at the time. If you take nothing else away from my story, remember this: Whenever you experience intermittent or random test failures, you can almost be sure that one test is causing another to break. The trouble is figuring out which combination.

# After the First Failure

As soon as I saw my first failure, I naively assumed it was the most recent test I added. Naturally, I removed it. At that point, the failure went away. I spent the next half hour trying to rewrite the "offending" test to figure out how it caused a failure in an unrelated test. The fact that the new test and the failing test were unrelated should have been my first clue that something else was at work here.

# Start Disabling Tests

As I write this, my project has 153 unit tests. The failure was occurring in an `afterAll` function, which I did not even have. The error referred to a specific component, but not a specific test. I could not even determine which test to skip. Instead, I decided to start running a subset of tests by selectively disabling some of the other tests and test suites.

# Disable Random Test Ordering

By this point, I was reasonably sure the problem was one test causing a failure in another one. The trick now was to figure out which one. On a whim, I decided to turn off random ordering in the Jasmine configuration. As I said, I am running my tests with the Karma test runner. So, inside the karma.conf.js file, I simply needed to add some Jasmine-specific configuration to the `client` section.

Before, that section looked like this:

```javascript
client: {
  clearContext: false // leave Jasmine Spec Runner output visible in browser
},
```

To disable random test order, I added this:

```javascript
client: {
  clearContext: false, // leave Jasmine Spec Runner output visible in browser
  jasmine: {
    random: false
  }
},
```

This would guarantee that my tests would run "in order," whatever that means. It occurred to me that this probably would not reveal any new insights. I was right. All tests passed. The good news is that the test run was now repeatable. Every test run passed now.

Did it solve my problem? Nope, but at least I felt I was making progress.

# You Can Specify the Random Seed!

The next thing I did was to turn random ordering back on, but this time provide my own random seed. If you are not familiar with a seed, it is a number used to initialize (or "seed") the random number generator. The benefit of this approach is that using the same value to seed the random number generator will provide the identical sequence of random values on subsequent runs. Thus, once I found a seed that caused my test failure to show itself, I could continue using that seed during my investigation.

I started with the seed `1234`. Because I had no idea what value might cause the problem, it really did not matter. On the first run with that value, all the tests passed, so that was no help. I continued changing the seed value until my test failed. Fortunately, it only took me a couple of attempts. I ended up with a configuration like this:

```javascript
client: {
  clearContext: false, // leave Jasmine Spec Runner output visible in browser
  jasmine: {
    random: true,
    seed: '12345'
  }
},
```

# Start Isolating Tests

Now that I could reliably reproduce the problem, it was time to start isolating the failed test from the working ones.

On my first attempt, I simply ran only the failing test in that test suite, by changing `describe` to `fdescribe`. This block had only one `it` block, so I was only running a single test from this suite. The rest of the test suites continued to run as normal. I was not yet ready to turn them off.

As I expected would happen, the test passed. When run in isolation from the other tests in the test suite, it worked just fine.

As a sanity check, I disabled every other test in the project, and as expected, the remaining test passed.

Next, I began turning on one test at a time. I considered turning on half, and then the other half. However, this particular suite only had ten tests in it, so I simply started at the top and turned them on one by one. As luck would have it, the very first test I enabled caused the problematic test to fail.

Now the real investigation began. What code did the first test run that caused the second test to fail?

# Give Asynchronous Code a Closer Look

As I looked closer at the failing test, I noticed that it was testing a failure scenario. A passing test actually meant that an error occurred inside my component. This test used the `async/await` pattern to wait on the asynchronous service call it had to make.

I had seen this problem before, and almost certainly knew what had caused it. The function in many of my components that made asynchronous service calls were not returning the promise to the caller. Consider this block of code (not my actual code):

```typescript
// Component function
getSomeData() {
  // Service function
  return this.service.getData()
    .then( data => { ... }
    .catch( error => { ... })
}
```

In this code, the promise returned by `service.getData()` is being returned by the component's `getSomeData()` function to its caller. If you forget to do that, the testing code will have nothing to await. My component had many such functions, and I had been meticulously going through them all to make sure they returned the service call's promise. I immediately checked the particular function being exercised by the failing test. To my surprise, it was fine.

That, however, led me to another realization. The test itself was bad. It looked like this:

```typescript
it('should set an error if it throws', async() => {
  // service here is a test double, a mock of the real service
  service.getData.rejects({ message: 'test-error' });
  fixture.detectChanges();
  await component.getSomeData();
  expect(component.error).toBeTruthy();
}));
```

The testing code was using `async/await`, but had no `try/catch`! I decided that I would rewrite the test without async/await, instead using `catch`. The modified test looked something like this:

```typescript
it('should set an error if it throws', ()=> {
  // service here is a test double, a mock of the real service
  service.getData.rejects({ message: 'test-error' });
  fixture.detectChanges();
  component.getSomeData()
    .catch(err => {
      expect(component.error).toBeTruthy();
    });
});
```

At last, I was pretty sure I had found the problem. I eagerly enabled all units tests and reran the tests with the same seed I had been using. The problematic test failed again, with the exact same error!

# New Test Suite
At this point, I decided to start with a clean slate. I disabled all tests in that component's test suite. Then I used the Angular CLI to create a brand new component, complete with its unit test boilerplate. 

Once that was done, I painstakingly began copying tests one at a time from the old test suite into the new one. I started simply, copying just enough code to initialize the component. That test failed due to missing service doubles. Next, I copied those test doubles (mostly service mocks) into the new suite. 

With the test doubles in place, my component creation test passed. One down, nine to go.

The next test up was the failing one. It did something only other test in the suite does. It changed the behavior of one of my mock services. Could that be the piece I had been missing?

# Suspect Your Test Doubles
I deleted my test doubles and reentered them individually. While doing this, I noticed that two of my mock services were created as object literals directly in the test suite. This was odd, as I also had a mock service defined as a class in another file. I decided I should try to use that instead. 

The code used to look something like this:
```typescript
const service = {
  getData: () => Promise.resolve({data});
}

// This was provided to the component's testing module like this:
providers: [
  { provide: DataService, useValue: service }
]
```

I moved the `getData` call into my Mock Service and changed the provider to look like this:
```typescript
let service: DataService;

// This was provided to the component's testing module like this:
providers: [
  { provide: DataService, useClass: DataService }
]
```

I had left in the variable declaration so that I could redefine its behavior in the error path. But now I had a compiler error. This line in my failing test was no longer valid.
```typescript
  service.getData.rejects({ message: 'test-error' });
```

That is because service was now strongly-typed to be a DataService, and `getData` returned a promise. It had no function named `rejects`. The solution was to replace the `getData` function completely, but just for this test.

Recall that I said this test was inside its own `describe` block, so I added a `beforeEach` to it, where I could replace the behavior of the `getData` function to reject instead of resolve the promise. Now my test looked something like this:

```typescript
describe('getSomeData (error path)', () => {
  // Redefine service.getData here, outside the test itself.
  beforeEach(() => {
    service.getData = sinon.stub().rejects({ message: 'test-error' });
  });

it('should set an error if it throws', ()=> {
  // service here is a test double, a mock of the real service
  fixture.detectChanges();
  component.getSomeData()
    .catch(err => {
      expect(component.error).toBeTruthy();
    });
  });
});
```

Here I am using `sinon` to create the stub, but you can use a similar strategy with Jasmine's own functions. 

The `beforeEach` on the overall test suite itself creates a brand new instance of the mock service before each test. Then, in this test, its `getData` function is replaced with a new function that returns a rejected promise instead.

I was feeling pretty good about where this was heading. I enabled all the tests and reran them. All passed. Finally, I removed the seed value from the Jasmine configuration and let the tests run in a random order. The test has been passing ever since.

# Summary

I have been careful not to show any of the actual test code that caused my problem, but instead just enough code to get my point across. My goal was to discuss how to isolate the problems in your tests, rather than discuss testing strategy. To that end, I hope I have succeeded.

In short:
- Understand that tests run in no particular order, and that is ideally what you want.
- Turn off random execution to help find the culprit.
- If sequential execution does not help, try various random "seed" values until the tests are failing consistently.
- Isolate the failing test or test suite by using `fdescribe`, `fit`, `xdescribe`, and `xit` to turn tests on or off selectively.
- Pay close attention to asynchronous code and test doubles.
- Ensure your test doubles are typed correctly, especially your mock services.

I hope you found this summary to be worthwhile and useful. If you have any tricks or tips of your own when it comes to diagnosing unit tests, please feel free to share them with me.

# Angular Advocate
![Angular Advocate Book](https://walkingriver.com/assets/img/aa-3d-small.jpg)
If you are interested in more content like this, please consider my recently-released book, _Angular Advocate: How to Awaken the Champion Within and Become the Go-to Expert at Work_, available in a [Kindle Edition at Amazon](https://amzn.to/3p00l67) or [DRM-free on Gumroad](https://gum.co/angular-advocate).
