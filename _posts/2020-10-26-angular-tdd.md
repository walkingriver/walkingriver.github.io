---
layout: post
title: Test-Driven Development in Angular
date: '2020-10-26'
author: Michael D. Callaghan
tags: 
- TypeScript
- Angular
- Web Development
layout: post
feature: https://walkingriver.com/assets/img/angular-logo.png
thumbnail: https://walkingriver.com/assets/img/angular-logo.png
cover_image: https://walkingriver.com/assets/img/angular-logo.png
canonical_url: https://walkingriver.com/angular-tdd/
published: true
---

I tried something "new" this afternoon. I built an Angular service in a true TDD fashion. I wrote the tests first, discovering the service interface along the way. This is how it went. I invite you to follow along.

<!--more-->

# Background

I am not a fan of writing unit tests for Angular apps. The tooling I am using (Jasmine and Karma) feel like afterthoughts. They work and they have gotten much better over the past few years, but they still seem like they were written to bolt onto Angular, rather than being built as part of the ecosystem.

Then I started thinking that maybe the problem is with me. Maybe I despise writing tests because I have not truly adopted test-driven-development in my Angular apps. I used to use TDD all the time with .NET and C#. 

So today I decided to go back to that philosophy and build a modest service using strict TDD principles. This is how it went.

# The Service

The service itself is simple enough. I want to build a means of setting and retrieving two different unique IDs my app can use when making service calls. The first is a "conversation ID" that will be set as an HTTP header for all network calls for a specific user for a given session. It will not change until the application user manually refreshes the screen, closes the browser, or logs out and back in.

The second is the "correlation ID." This will also get sent with each HTTP call, but it changes with every request. 

Not only will these IDs be set as custom HTTP headers on all web requests, they will be logged with all such requests and responses. They can then be used to correlate several layers of service requests and responses back to the user and high-level function that initiated them.

The name of my service is simply `correlation`. I created it with this Angular CLI command:

```bash
npx ng g service services/correlation/Correlation

CREATE src/app/services/correlation/correlation.service.spec.ts (382 bytes)
CREATE src/app/services/correlation/correlation.service.ts (140 bytes)
```

This creates two files in their own folder at `./src/app/services/correlation`. I got a nearly-empty service file and a test (spec) file with one test. 

As I usually do, pre-pending `npx` causes the system to use the locally-installed Angular CLI. 

# The Tests and API

There are three primary things I need the service to do for me. 
1. Give me the same conversation ID whenever I ask, unless one does not exist. In that case, it needs to give me a new one and return it.
1. Give me a fresh correlation ID every time I request one. I should never get the same ID twice.
1. Provide a way for me to force a fresh conversation ID.

These rules allowed me to come up with the following tests. Again, I am using Jasmine as my testing framework. I know a lot of people these days are using Jest, but the concepts should be the same regardless of what you use.

```typescript
import { TestBed } from '@angular/core/testing';

import { CorrelationService } from './correlation.service';

describe('CorrelationService', () => {
  let service: CorrelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrelationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resetConversationId', () => {
    it('should return different values on subsequent calls', () => {
      const firstId = service.resetConversationId();
      const secondId = service.resetConversationId();
      expect(firstId).not.toEqual(secondId);
    });

  });

  describe('getConversationId', () => {
    it('should return identical values on subsequent calls', () => {
      service.resetConversationId();
      const firstId = service.getConversationId();
      const secondId = service.getConversationId();
      expect(firstId).toEqual(secondId);
    });

  });

  describe('getCorrelationId', () => {
    it('should return different values on subsequent calls', () => {
      const firstId = service.getCorrelationId();
      const secondId = service.getCorrelationId();
      expect(firstId).not.toEqual(secondId);
    });
  });
});
```

Even if you are not intimately familiar with Angular testing in Jasmine, I think these tests are easily understood. 

Naturally, though, none of these tests will run. In fact, they will not even compile. The functions on the service do not yet exist.

# Auto-generated Service Code

Fortunately, VS Code will do the heavy lifting for me. All I have to do is put my edit cursor on one of the function names, click the yellow light-bulb (for Auto Fix), and choose `Add all missing members.`

![VS Code adds missing service functionality](/assets/img/vs-code-add-missing.png)

The code it builds is not ideal and will still require some editing, but at this point the tests will compile.

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CorrelationService {
  resetConversationId() {
    throw new Error('Method not implemented.');
  }
  getConversationId() {
    throw new Error('Method not implemented.');
  }
  getCorrelationId() {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
```

# Make Them Run (and Fail)

Now I have code that compiles, implemented in such a way that all three tests will fail with an expected exception. The first thing I need to do is remove the exceptions. My class now looks like this.

```typescript
export class CorrelationService {
  resetConversationId() {
  }
  getConversationId() {
  }
  getCorrelationId() {
  }

  constructor() { }
}
```

I am afraid one of those tests will now pass, but  should not. Each function call in the test code evaluates to `undefined`. This causes the test `should return identical values on subsequent calls` to pass, because `undefined` equals `undefined`.

I will have to edit the tests. I have two choices. I can add three more tests to ensure that no function returns `undefined` or I can add a check for `undefined` in the test that is checking for equality. 

Some purists believe that every test should have a single assertion/expectation. I tend to be more of a pragmatist. If you are testing one high level "thing," then it is fine to have multiple expectations in a single test.

The new test now looks like this, and fails as expected. 

```typescript
describe('getConversationId', () => {
  it('should return identical values on subsequent calls', () => {
    service.resetConversationId();
    const firstId = service.getConversationId();
    const secondId = service.getConversationId();
    expect(firstId).toBeDefined(); // New code
    expect(firstId).toEqual(secondId);
  });
});
```

Note I am only checking on the first result to be defined. If the first call is defined and the second is not, the second expectation will then fail. I will let you decide which approach makes sense for your project.

# Make Them Pass

According to TDD principles, the next step is to write the least amount of code that will cause the tests to pass. In theory, I should not have to touch the tests again. In practice, I probably will. This is a path of discovery, which I am writing as I go. Thus, you are learning right along with me.

```typescript
resetConversationId() {
  return 'mike';
}
getConversationId() {
  return 'mike';
}
getCorrelationId() {
  return 'mike';
}
```

Technically, this will make the middle test pass, but not the others. It is time to think about how the service is _supposed to_ work. 

## UUID
The business rules call for some sort of semi-unique identifier string. I plan to use a GUID or some variant thereof. 

After a few seconds (ok, a minute or so) of research, I found the [UUID npm package](https://www.npmjs.com/package/uuid){:target="_blank"}. I will it use to generate both my conversation and correlation IDs.

Once the package is installed in my project, the CorrelationService now looks like this.

```typescript
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CorrelationService {
  resetConversationId() {
    return uuidv4();
  }
  getConversationId() {
    return uuidv4();
  }
  getCorrelationId() {
    return uuidv4();
  }

  constructor() { }
}
```

Now the tests pass or fail as expected. 

# Make It Right
This code looks pretty good, almost complete. There are two things I think are missing. 

The first is obvious: Subsequent calls to `getConversationId` need to return the same value. This means I need a place to store the value. There is also the scenario of the ID's initial value. How do we handle that?

I will tackle the second scenario first by modifying `getConversationId` to return the stored value, and also by modifying `resetConversationId` to set the stored value. This will cause the tests to fail, but that is why we write them in the first place. Right?

My modified service looks like this: 

```typescript
export class CorrelationService {
  conversationId: string;

  resetConversationId() {
    this.conversationId = uuidv4();

    return this.conversationId;
  }

  getConversationId() {
    return this.conversationId;
  }

  getCorrelationId() {
    return uuidv4();
  }

  constructor() { }
}
```

All the tests pass, because I had the foresight to call `resetConversationId` in the test expecting equality. In reality, this was not a good idea. My motive was good, but I do not believe a user should be forced to call `resetConversationId` before calling `getConversationId`. That should be up to the code.

So, now I want to remove the call to `resetConversationId` from the test, which will cause that test to fail. 

To enable that code to pass again, I need to modify the service to ensure there is a value before returning it.

```typescript
getConversationId() {
  return this.conversationId || this.resetConversationId();
}
```

Now all my tests pass, the service does the modest job it is meant to do, and my test coverage looks good. 

# The Final Test

Here is the final set of tests.

```typescript
import { TestBed } from '@angular/core/testing';

import { CorrelationService } from './correlation.service';

fdescribe('CorrelationService', () => {
  let service: CorrelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrelationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resetConversationId', () => {
    it('should return different values on subsequent calls', () => {
      const firstId = service.resetConversationId();
      const secondId = service.resetConversationId();
      expect(firstId).not.toEqual(secondId);
    });
  });

  describe('getConversationId', () => {
    it('should return identical values on subsequent calls', () => {
      const firstId = service.getConversationId();
      const secondId = service.getConversationId();
      expect(firstId).toBeDefined();
      expect(firstId).toEqual(secondId);
    });
  });

  describe('getCorrelationId', () => {
    it('should return different values on subsequent calls', () => {
      const firstId = service.getCorrelationId();
      const secondId = service.getCorrelationId();
      expect(firstId).not.toEqual(secondId);
    });
  });
});
```

# The Final Service

Here is the entire service.

```typescript
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CorrelationService {
  conversationId: string;

  resetConversationId() {
    this.conversationId = uuidv4();

    return this.conversationId;
  }

  getConversationId() {
    return this.conversationId || this.resetConversationId();
  }

  getCorrelationId() {
    return uuidv4();
  }

  constructor() { }
}
```

I probably could also dispense with the empty constructor, but something in the back of my mind is preventing me from deleting it.

# Conclusion

From start to finish, this experiment took me just over two hours to complete (2:30 - 4:45 PM). The tests were easy to write because the service itself did not exist. By describing the tests as I expected them to work, the service API practically wrote itself. 

I am not convinced that a more complicated service or a UI component will be as easy to write in this manner, but over all I am pleased with the result.

I will probably continue to develop the project this way, and can honestly recommend that everyone should give it a try some time. You may end being pleasantly surprised.
