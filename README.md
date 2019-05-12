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

-----------------

# API
## Classes

<dl>
<dt><a href="#TraskNlpModel">TraskNlpModel</a></dt>
<dd><p>AI Plugin Model</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Entity">Entity</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Intent">Intent</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Result">Result</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="TraskNlpModel"></a>

## TraskNlpModel
AI Plugin Model

**Kind**: global class  
<a name="new_TraskNlpModel_new"></a>

### new TraskNlpModel(options, [log])

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.subscribtionKey | <code>string</code> | the subscribtion key header |
| options.apiKey | <code>string</code> | the api key |
| options.model | <code>string</code> | model name (part of the url) |
| [options.cacheSize] | <code>number</code> |  |
| [options.serviceUrl] | <code>string</code> |  |
| [log] | <code>Object</code> | logging function |

<a name="Entity"></a>

## Entity : <code>Object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| entity | <code>string</code> | 
| value | <code>string</code> | 
| score | <code>number</code> | 

<a name="Intent"></a>

## Intent : <code>Object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| intent | <code>string</code> | 
| score | <code>number</code> | 
| [entities] | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 

<a name="Result"></a>

## Result : <code>Object</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| entities | [<code>Array.&lt;Entity&gt;</code>](#Entity) | 
| intents | [<code>Array.&lt;Intent&gt;</code>](#Intent) | 

