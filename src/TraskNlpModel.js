/*
 * @author David Menger
 */
'use strict';

const { CachedModel } = require('wingbot');
const request = require('request-promise-native');
const assert = require('assert');

const SERVICE_URL = 'https://trasknlp.azure-api.net';

/**
 * @typedef {Object} Entity
 * @param {string} entity
 * @param {string} value
 * @param {number} score
 */

/**
 * @typedef {Object} Intent
 * @param {string} intent
 * @param {number} score
 * @param {Entity[]} [entities]
 */

/**
 * @typedef {Object} Result
 * @param {Entity[]} entities
 * @param {Intent[]} intents
 */

/**
 * @typedef {Object} TraskEntity
 * @private
 * @param {string} entity
 * @param {string} entityType
 */

/**
 * @typedef {Object} TraskIntent
 * @private
 * @param {string} candidate
 * @param {number} probability
 */

/**
 * {
  "id": 0,
  "sentence": "string",
  "intent": "string",
  "intent_candidates": [
    {
      "candidate": "string",
      "probability": 0.0
    }
  ],
  "entities": [
    {
      "entity": "string",
      "entityType": "string"
    }
  ]
}
 */

/**
 * @typedef {Object} TraskResponse
 * @private
 * @param {string} sentence
 * @param {string} intent
 * @param {TraskIntent[]} intent_candidates
 * @param {TraskEntity[]} entities
 */

/**
 * @class AI Plugin Model
 */
class TraskNlpModel extends CachedModel {

    /**
     * @param {Object} options
     * @param {string} options.subscribtionKey - the subscribtion key header
     * @param {string} options.apiKey - the api key
     * @param {string} options.model - model name (part of the url)
     * @param {number} [options.cacheSize]
     * @param {string} [options.serviceUrl]
     * @param {{ warn: Function }} [log] - logging function
     */
    constructor (options, log = console) {
        super(options, log);

        assert.equal(typeof options.model, 'string', 'The model option has to be string');
        assert.equal(typeof options.subscribtionKey, 'string', 'The subscribtionKey option has to be string');
        assert.equal(typeof options.apiKey, 'string', 'The apiKey option has to be string');
        // @ts-ignore
        this._request = options.request || request;
        this._subscribtionKey = options.subscribtionKey;
        this._apiKey = options.apiKey;

        this._serviceUrl = options.serviceUrl || SERVICE_URL;
        this._model = options.model;
    }

    /**
     * Resolve the intent from text
     *
     * @param {string} text
     * @returns {Promise<Result>}
     * @private
     */
    async _queryModel (text) {
        const trim = (text || '').trim();

        if (trim.length === 0) {
            return {
                entities: [],
                intents: []
            };
        }

        const body = {
            sentence: trim,
            model_name: this._model,
            conversationID: 0
        };

        try {
            /** @type {TraskResponse} */
            const response = await this._request({
                url: `${this._serviceUrl}/intent`,
                method: 'POST',
                body,
                json: true,
                timeout: 20000,
                headers: {
                    'Api-Key': this._apiKey,
                    'Ocp-Apim-Subscription-Key': this._subscribtionKey
                }
            });

            // const { intent_candidates = [], entities = [] } = response;

            // const intents = intent_candidates
            //     .map(({ candidate, probability }) => ({
            //         intent: candidate, score: probability
            //     }));

            const { intent = null } = response;

            const intents = [];

            if (intent && intent !== '__NO_INTENT_FOUND__') {
                intents.push({
                    intent,
                    score: 0.95
                });
            }

            return {
                // entities: entities.map(({ entity, entityType }) => ({
                //     entity: entityType,
                //     value: entity,
                //     score: 0.95
                // })),
                entities: [],
                intents
            };

        } catch (e) {
            this._log.warn('AI query failed', e);
            return {
                entities: [],
                intents: []
            };
        }
    }

}

module.exports = TraskNlpModel;
