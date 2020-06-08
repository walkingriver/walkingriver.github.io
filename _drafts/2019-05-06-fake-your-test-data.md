---
layout: post
title: Fake Your Test Data
date: '2019-05-06T05:15:00.002-04:00'
author: Michael D. Callaghan
tags: 
- testing 
- javascript
- mock
modified_time: '2019-05-061T15:05:48.265-04:00'
layout: post
feature: assets/img/
thumbnail: https://walkingriver.com/assets/img/
cover_image: https://walkingriver.com/assets/img/
canonical_url: https://walkingriver.com/fake-your-test-data/
published: false
---

I work on a lot of web applications. Sometimes I have a pre-defined set of services, and sometimes I don't. In the latter case, it is often because those services have not yet been implemented. In many of those cases, the services have not even been designed yet. Rather than try to rely on a design that is likely to change multiple times throughout the project, I prefer to focus on the UI. To help with that, I create a mock data service that is easy to change, and provides me with lots of realistic fake data. This post describes one such data service, which I built for my course on Building Progressive Web Apps with Ionic. 

<!--more-->

Quite frankly, given the choice, I prefer to write my web front end first. Knowing what the users of the application will see and how they will interact with it can be useful when it comes to defining the data services. It may also be that the data services and UI are being implemented simultaneously, and having a way to mock your data can allow those implementations to occur "de-coupled" from each other. Having consistent mock data can also help with unit and functional testing. Whatever your particular reason, you probably need to focus your time on your application, and less time building mock data. 

# The Data

The first thing I did was to create some TypeScript interfaces to represent my data. Using these interfaces allowed me to make changes to the shape of the data throughout the project, and have the TypeScript compiler warn me whenever a breaking change crept in (which happened often). 

The data represents emergency phone calls, details specific to the phone calls (caller name and address), acknowledgements to calls, and an object to wrap those phone calls in a web response.

The EmergencyEvent object itself consists of an identifier, the date and time it was created, the number dialed, and who placed the call.
```TypeScript
export interface EmergencyEvent {
  id: number;
  created: Date;
  caller: Caller;
  dialed: string;
}
```

```TypeScript
Next, a Caller contains the information needed to identify who placed the call. 

export interface Caller {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
}

export interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
}

export interface Acknowledgement {
  timestamp: Date;
  user: string;
  note: string;
}

export interface EventResponse {
  event: EmergencyEvent;
  links: Links;
}

export interface Links {
  self: string;
  next: string;
  acknowledgements: string;
}
```

# The Service

Next, I needed to define the service to be mocked. It had modest, but specific functionality to be delivered. Specifically, the service would provide a list of emergency phone calls received by a fictional emergency public safety office. To that end, I created a TypeScript class with the following public functions:

- getLatest
- getSince(specificDate)
- getById
- getAcknowledgements




```TypeScript
import * as faker from 'faker';
import { EmergencyEvent, Acknowledgement } from './interfaces';

export class EventsService {
  pageSize = 10;
  events: EmergencyEvent[] = [];

  constructor() {
    console.log('Constructor entered.');

    // This will ensure we always get the same results.
    faker.seed(24601);
    const evt = [];
    for (let index = 1; index <= 50; index++) {
      const e = this.generateEvent(index);
      e.created = faker.date.recent(30);
      evt.push(e);
    }

    // This will sort the events with the oldest 
    this.events = evt.sort((a, b) => a.created > b.created ? 1 : -1)
      .map((e, i) => {
        e.id = i;
        return e;
      });

      console.log('Generated a bunch of new events, hopefully in order')
      console.log('Events:', this.events);
  }

  getLatest(): EmergencyEvent {
    const max = this.events.reduce((a, b) => this.events[Math.max(a.id, b.id)]);
    return max;
  }

  getSince(since: Date): number[] {
    return this.events
      .filter(x => x.created > since)
      .sort((a, b) => a.created < b.created ? -1 : 1)
      .map(x => {
        return x.id;
      });
  }

  getById(id: number) {
    this.events[id] = this.events[id] || this.generateEvent(id);
    return this.events[id];
  }

  generateEvent(id: number) {
    const event: EmergencyEvent = {
      id: id,
      created: new Date(), // faker.date.recent(-2),
      dialed: '911',
      caller: {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phone: faker.phone.phoneNumber(),
        address: {
          street1: faker.address.streetAddress(),
          street2: faker.address.secondaryAddress(),
          city: faker.address.city(),
          state: faker.address.stateAbbr(),
          zip: faker.address.zipCode()
        }
      }
    };

    return event;
  }

  getAcknowledgements(id: number, since: Date): Acknowledgement[] {
    const max = faker.random.number({ min: 1, max: 7 });
    console.log('Making some fake acks', max);
    const result = [];
    for (let index = 0; index < max; index++) {
      result.push({
        timestamp: faker.date.between(since, new Date()),
        note: faker.lorem.sentence(),
        user: faker.internet.email()
      });
    }

    console.log(JSON.stringify(result));
    return result;
  }
}
```