---
layout: post
title: A Few Days with Twilio Flex
date: '2020-02-19'
author: Michael D. Callaghan
tags: 
- twilio
- sms
- flex
layout: post
feature: /assets/img/twilio-flex.png
thumbnail: https://walkingriver.com/assets/img/twilio-flex.png
cover_image: https://walkingriver.com/assets/img/twilio-flex.png
canonical_url: https://walkingriver.com/twilio-flex/
published: true
---

Have you ever needed to create an application for customer engagements? Imagine building a call center application from scratch that needs to support phone calls, web chat, and SMS messages, interactive voice response, speech recognition, and more. If the thought of doing all of that makes you cringe, you might want to consider Flex from Twilio.

<!--more-->

# Twilio
When someone first suggested Twilio to me, my immediate response was, "That is the company that has a cool API to send and receive text messages, right?" Apparently my information is very out of date, as Twilio has grown far beyond that. 

## SMS
So yes, Twilio does still provide a wonderful API for sending and receiving texts, supporting just about every platform you can imagine. 

## Flex: The Programmable Contact Center Platform
Flex is their latest product. It is touted as a way for companies to take "complete control" of their customer experience. 

Flex lets you deliver a single user interface for call center agents, and provides a straightforward method of customizing it. You can develop and provide your own plugins, customizing just about every aspect of its look, feel, and functionality.

# Voice Support
Out of the box, Flex provides a 100% cloud-hosted solution, providing customers an easy way to reach you through the telephone. Calls can be routed to the next available agent, and agents have a quick and easy way to mark themselves as unavailable when necessary. 

# Web and SMS Chat
Flex also supports real-time SMS and web chat, enabling an agent to handle multiple chats simultaneously. The system displays the appropriate context depending on which chat is currently active. Chat transcripts are automatically saved for later review if needed.

# Interactive Voice Response
Both the voice and chat supports can be enhanced through Interactive Voice Response (IVR). This is the standard telephone "Press 1 for Sales, Press 2 for Support, etc." workflow that we are all familiar with. 

## Twilio Studio
Flex allows you the ability to build customized IVR workflows through an easy-to-use drag-and-drop interface called Twilio Studio. It provides a toolbox of widgets that can be configured to handle a variety of IVR Tasks:
* Speak an announcement.
* Provide the caller with a series of menu options.
* Call an external web service.

Widgets can "transition" to other widgets, based on values obtained during the widget's execution. Web service widgets can transition based on whether or not the response was successful or not. Other widgets can transition based on the user's input, or another widget's state.

Each widget maintains its own internal state as variables, which other widgets can access using the pattern `{widget-name}.{variable-name}`. 

Widgets that call web services automatically parse the web response into an object that can be access the same way. Web services are expected to return data formatted as JSON. 


## Weather App
I thought it would be fun trying to build a simple phone based weather system using the widgets available to me. I created a new IVR flow and was immediately presented with a canvas consisting of a number of widgets pre-wired to handle the phone call. 

![Twilio Studio](https://walkingriver.com/assets/img/twilio-studio.png)

1. My first widget simply speaks a greeting to the user and then moves on. 
2. Next, I ask the caller to enter a 5-digit US zip code.
3. If the zip code is not entered in a reasonable amount of time, the widget will ask again. After three failed attempts, it ends the call.
4. The zip code entered is sent at an API at openweathermap.org to retrieve the current weather conditions. 
5. If the web call fails, the user is read the error message and given the opportunity to try again.
6. If the web call succeeds, as I mentioned above, the JSON response is automatically parsed and exposed as a state object on that widget.
7. The next widget reads parts of the current conditions: city, temperature, wind speed, and outlook (sunny, cloudy, etc.). This is where I ran into trouble. The temperature is returned in Kelvin.
8. I inserted a new widget to convert the temperature from Kelvin to degrees Fahrenheit. The temperature value from the web service widget is sent to a custom Twilio Function (described next) where the conversion is accomplished.

## Twilio Functions
Twilio allows you to create functions to respond to Twilio Webhook Events like incoming phone calls or inbound SMS messages. You can also create functions to respond to other kinds of HTTP requests or for integration into Twilio Studio or Twilio Flex. This is what I did.

Functions are "serverless" in that you don't specify or provide a host in which they run. This is all handled for you by Twilio. Security, logging, and scaling are provided automatically. 

Functions are written in NodeJS using JavaScript. They are edited directly in a browser-based code editor. This is one of my only gripes. I want to keep my code, even simple functions, in source control. This way I can control how and when they get deployed. Other serverless platforms (Azure, AWS, Google, etc.) allow this, so I believe it is probably possible with Twilio. I did not investigate further for the purposes of my test app.

Here is my modest Kelvin to Fahrenheit conversion function:

```javascript
exports.handler = function(context, event, callback) {
    console.log(context);
    console.log(event);
    
  const f = Math.round(9.0/5.0 * +(event.k) - 459.67);
  
  let response = { temp: f };
  
  callback(null, response);
};
```

It is a short function, though it is about twice as long as it needs to be. The first line is provided by Twilio Functions. You simply fill in the logic inside the function body. As you can see, I log both the context and event parameters, just to see for myself what is in them. The `context` parameter contains the keys and values that you define, environment settings if you will. The `event` parameter contains the function request, including querystring parameters. The `callback` parameter is a function that your function _*must*_ call, passing your `response` object, when it is finished.

I passed the temperature in Kelvin as a query string parameter `k`, which I can access as `event.k`. That value is plugged into the formula to convert to °F, and the result placed into a response object. This response will be automatically serialized into a JSON string and then returned to the caller. I did not bother with error detection. JavaScript is pretty forgiving in this case. Even if `k` is omitted, or provided as a non-numeric value, the expression `+(event.k)` simply returns 0.

# Flex Plugins
Flex plugins allow developers to create standalone panels that will live inside of the Flex desktop. Each plugin is independent from the other, but sharing a common state. This enables the plugins to access information in other plugins, and also interact with the reset of the Flex ecosystem. Plugins can be written in a variety of languages. Examples and documentation exist for many. For my test, I selected JavaScript (actually, TypeScript) and Node.

## Node
Flex Plugin JavaScript development requires a minimum of Node 8 and npm 5. 

## Setup
The developer setup for building a JavaScript plugin was simple and easy. I issued the following commands in my macOS terminal.

```bash
npm init flex-plugin plugin-park-hours \
  --install --typescript

cd plugin-park-hours
npm start
```

The first command initializes a new Flex plugin project directly through its NPM package. The fourth parameter, `plugin-park-hours` is the plugin name. All Flex plugins must begin with the word `plugin`. The `--install` parameter indicates that it should automatically run `npm install` after the project is initialized. The final parameter, `--typescript`, tells the system that I want to use TypeScript instead of JavaScript.

The next two lines start the plugin, which by default is a small panel at the top of the Flex desktop that simply displays a message with a close button.

## React
Plugins are implemented as React components. That was not good enough for me. I wanted some attractive web components. I have been spending a lot of time lately [experimenting with Ionic-React](https://walkingriver.com/ionic-react/){:target="_blank"}, so I added `npm install @ionic/react` to the plugin project, and instantly had all of Ionic at my disposal.

Next, I deleted the sample React code that came with the plugin project, and replaced it with some code that would call a web service to retrieve the current day's park hours at the Walt Disney World Resort (sorry, I cannot share that code). The web response is then parsed and converted into four `<IonCol>` elements, one for each park, and displayed across the top of the Flex desktop. 

I can share that the web service calls were made with the `react-axios` npm package, which wraps the popular Axios library in React components. The top level plugin component looks like this:

```jsx
const Sample = (props: Props) => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <SampleComponentStyles>
      <IonToolbar color="dark">
        <IonTitle>
          Today's Park Hours
        </IonTitle>
      </IonToolbar>
      {parkHours()}
    </SampleComponentStyles>
  );
};
```

The web call to retrieve the park hours ended up looking like this:

```jsx
  function retrieve() {
    const url = 'https://XXXXXXXXXXXXXXXX/api/park-hours';

    return <Get url={url}>
      {(error, response, isLoading, makeRequest, axios) => {
        if (error) {
          return <pre>{JSON.stringify(error)}</pre>
        } else if (isLoading) {
          return <div>Looking up Today's Park Hours... Please wait.</div>
        } else if (response) {
          return parkHours(response.data.data);
        } else {
          return <div>Coming soon...</div>
        }
      }}
    </Get>
  }
```

The `parkHours()` function accepts the JSON response and returns some Ionic markup to display the information in an attractive format.

All in all it was a pretty simple thing to set up and get working. I was impressed by its power, performance, and functionality. 

# AutoPilot (Speech Recognition)
Though I did not spend any time with AutoPilot, I want to mention it, as it is an important part of wht Twilio has to offer for any call center application. Twilio's marketing says taht AutoPilot lets you "Build conversational IVRs and bots that work across web and mobile chat, SMS, WhatsApp, and your contact center." It is an AI/ML platform that can be trained with your data. It will automatically detect a number of intents and data types, providing you a head start in creating your own conversational applications. You can have AutoPilot kick off actions whenever it recognizes what the caller wants, and handoff the call to live agents at just the right moment.

AutoPilot scripts can even be automatically sent to Google and Alexa with no additional coding.

# Conclusion
I have barely touched the surface on everything Twilio Flex can do. I spent about two days playing with it on and off, and can honestly say I am impressed with its capabilities. In that brief amount of time I was able to build two Flex applications that integrated with two distinct web services. If you run a call center, and are looking for an all-inclusive cloud-based solution, consider taking Twilio Flex for a test drive.

If you are interested in a [free trial, sign up here (referral link)](www.twilio.com/referral/XsTuME). Please note that I have no connection to Twilio or Flex. I was asked to play around with it for a few days and write up my thoughts.
