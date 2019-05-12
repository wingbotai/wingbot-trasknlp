# Trask NLP API integration for Wingbot

Use the Trask NLP in wingbot chatbot
## Installing

```
npm i -S wingbot-trasknlp
```

## Usage

```javascript

const { TraskNlpModel } = require('wingbot-trasknlp');
const { ai } = require('wingbot');

const traskNlpModel = new TraskNlpModel({
    model: 'name-of-your-model',
    subscribtionKey: '<your subscribtion key>',
    apiKey: '<your api key>'
});

ai.register(traskNlpModel);
```
