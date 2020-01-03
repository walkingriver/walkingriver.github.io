---
layout: post
title: Stop Testing My Code!
author: Michael Callaghan
tags:
- Software Development
- Testing
- TDD
- Angular
- JavaScript
feature: assets/img/javascript-func.png
thumbnail: https://walkingriver.com/assets/img/javascript-func.png
cover_image: https://walkingriver.com/assets/img/javascript-func.png
canonical_url: https://walkingriver.com/stop-testing-my-code/
date: '2019-12-05'
published: true
---
Everyone agrees that Test Driven Development (TDD) is a good thing, right? Right? If you agree that tests are important, you probably write a lot of tests. You might even have a code coverage tool that helps you know how much of your code is tested. Great so far. But here is my question. Are you testing the right code? Are you testing your code, or mine? 
<!--more-->

## Test your own code 

I have been doing a lot of code reviews lately, and there is one overwhelming pattern I see repeated. There is a lot of testing being done of code that is not part of the system under test (SUT). In other words, the unit test writers are spending too much time writing tests for code that is outside of their control. 

Consider the following scenario. Your app makes calls to a back-end web service to retrieve customer data. You need to log each request and response, but you also need to ensure that any private information is stripped from the log. For your first pass, you decide to create a function that looks something like this:

```javascript
function getCustomer(customerId) {
  return httpService.get('/customers/' + customerId)
    .then(function(response){
      if (response.statusCode === 200) {
        var scrubbed = scrub(response);
        logger.log(scrubbed);
        return response;
      } else {
        logger.error(response)
      }
    });
}
```

## How do you test that function?

There are a number of problems with that function, which make it very difficult to test. As I am fond of telling anyone who will listen: if your code is hard to test, it is probably an indication of a design problem. Let us take a look at why this function is hard to test.

1. It relies on an HTTP Service (`httpService`).
1. It relies on a logger.
1. It makes an assumption that the response object contains a status code.
1. It passes the raw HTTP response to the scrub function.
1. It returns a promise.
1. It simply does too much.

### It relies on an HTTP Service and logger
To test this function as written, you would at least need to mock the httpService and logger. There are plenty of ways to do that, but I argue that it is unnecessary at best, and counter-productive at worst. 

### It passes the raw HTTP response to the scrub function.
This is related to the prior one. It is also pretty easy to fix. Why does the scrub function need to know anything about HTTP responses? Consider insulating all of your HTTP responses from the functions that use the data. Instead of passing the raw response, extract the pertinent data from the response, and pass that to the scrub function.

### It makes an assumption that the response object contains a status code.
Do not make your functions any smarter than they have to be. This tiny function is already much larger than it should be, and testing it appropriately requires more effort than is warranted. If we break the function into its constituent parts, testing the application logic will become much simpler.

### It returns a promise.
This one really isn't too bad. Modern JavaScript testing frameworks make it far simpler to test promises than it used to be. However, it is far simpler to test the asynchronous and synchronous functions in isolation.

### It does too much
The `getCustomer` function does not adhere to the Single Responsibility Principle. Yes, it gets the customer from a back-end service. Then it scrubs the private data from the service's response, which is obviously a good thing in today's privacy minded society. Scrubbing the data is a synchronous call, and by itself should be easily testable. Then it returns the original unscrubbed response to the caller, whom we can assume needs this data.

## Refactor Time
Let us rewrite the function into its constituent parts, and see how we might create more testable code. 

```javascript
function getCustomer(customerId) {
  return httpService.get('/customers/' + customerId)
    .then(processResponse);
}

function processResponse(response) {
    if (response.statusCode === 200) {
      return handleSuccess(response.data)
    } else {
      return handleError(response.err)
    }
}

function handleSuccess(data) {
  logger.log(scrub(data));
  return data;
}

function handleError(error) {
  logger.error(error);
  return {};
}

function scrub(data) {
  // Remove Private Information (PII) from data
  ...
  return newData;
}
```

### What have we done?
First of all, getCustomer is still the entry point into this particular piece of functionality. Any calling client need not be concerned with these changes, as the public interface hasn't changed.

You might be thinking that this is still hard to test, and you will still end up mocking the httpService and logger to get to 100% coverage. However, *100% Test coverage should not be your goal.* Instead, your goal should be to test _your_ code. Testing someone else's code is counter productive. Don't do it.

### What tests do we need?
I submit that there is no need to write a test for getCustomer. All it does is makes an HTTP call and delegates the result to processResponse. Do you need to test that the HTTP service works? I do not see why. Save that for testing the error conditions you are likely to receive, to ensure they are handled appropriately.

### The processResponse function
So let us start with processResponse.

processResponse still assumes four things: 

1. The response object being passed to it has a .statusCode property.
1. That a value of 200 means success and anything else is an error. 
1. A valid response object has a .data property.
1. An invalid response object has a .error property.

If you are just testing this function, in isolation, there a few  strategies I recommend employing. 

Ideally, I would write two tests (after all, there are two code paths). The first would pass a request object with a status code
of 200. The other would pass it without that status code. 

Next, I would replace at test time the handleError and handleSuccess functions with a shim that I can spy on from the test. That way, I am truly only testing the error checking logic. I do not care what those two functions do: I only care that the right one is called.

### handleError and handleSuccess functions
These are also easily testable in isolation. Handle success scrubs and logs the data, Those two functions again would be shimmed from the unit test itself, and my test would simply verify that they were indeed called. Then the function returns the unmodified data object. So my test would pass in a dummy object I could inspect afterwards to ensure that it was returned unaltered. 

Likewise, testing handleError just needs to ensure that the logger's error function is called. 

In both of these functions' tests, if logger is an external service that gets injected, it would be an ideal candidate to create a mock logger at test time. It is also fairly easy to mock something with a small API footprint (In this case, logger only has log and error functions exposed). We can mock the service, replacing those two functions with a spy, and sure they are called a the appropriate time. 

### The scrub Function
Ultimately, the piece of business we really care about in this block of code is the scrub function. Writing a test for this one has become almost trivial. It is a side-effect-free function that takes a single object as input, and returns a new object as output.

## Conclusion

Unit testing code does noy need to be hard. If you spend some time thinking about what your tests need to accomplish, you can often
find ways to refactor the code to make it more testable, and provide tests that are more meaningful.

The ability to mock existing services is a tool that is worth having. And as you can see, I found a place where mocking made testing easier rather than harder. 

Before you start mocking everything, consider what it is you are trying to test. Spend some time separating your code from existing
code written by others. Then test just your code and call it a day. Your family and coworkers will thank you, because you may end up
being a more pleasant person to have around. 

By the way, did you notice I don't have to test the promise anymore? 

