/*
 * @author David Menger
 */
'use strict';

const sinon = require('sinon');
const assert = require('assert');
const TraskNlpModel = require('../src/TraskNlpModel');

const TEST_INTENT_NAME = 'intentName';

const MOCK_INTENT = TEST_INTENT_NAME;

// const MOCK_INTENT = {
//     candidate: TEST_INTENT_NAME,
//     probability: 0.95
// };

const MOCK_ENTITY = {
    entity: 'prague',
    entityType: 'town'
};

const MOCK_RESPONSE = {
    intent: TEST_INTENT_NAME,
    intent_candidates: [MOCK_INTENT],
    entities: [MOCK_ENTITY]
};

describe('<TraskNlpModel>', () => {

    /** @type {TraskNlpModel} */
    let model;
    /** @type {sinon.SinonSpy} */
    let mockReq;

    beforeEach(() => {
        mockReq = sinon.spy((query) => {
            if (query.body.sentence === 'fail') {
                throw new Error('random error');
            }
            if (query.body.sentence === 'malformed') {
                return {};
            }

            return MOCK_RESPONSE;
        });

        model = new TraskNlpModel({
            serviceUrl: 'a',
            apiKey: 'b',
            subscribtionKey: 'a',
            model: 'c',
            // @ts-ignore
            request: mockReq
        });
    });

    describe('#resolve()', () => {

        it('should return resolved entity', async () => {
            const res = await model.resolve('random');

            assert.deepEqual(res, {
                intents: [{
                    intent: TEST_INTENT_NAME,
                    score: 0.95
                }],
                entities: [
                    // {
                    //     entity: 'town',
                    //     score: 0.95,
                    //     value: 'prague'
                    // }
                ]
            });
        });

        it('should return the array, when it fails', async () => {
            const res = await model.resolve('fail');
            assert.deepStrictEqual(res, { entities: [], intents: [] });
        });

        it('is ok with malformed response', async () => {
            const res = await model.resolve('malformed');
            assert.deepEqual(res, { entities: [], intents: [] });
            assert.strictEqual(mockReq.callCount, 1);
        });

        it('should return empty array when the text is empty', async () => {
            const res = await model.resolve('');
            assert.deepStrictEqual(res, { entities: [], intents: [] });
            assert.strictEqual(mockReq.callCount, 0);
        });

        it('should use default url, when not passed', async () => {
            model = new TraskNlpModel({
                apiKey: 'a',
                subscribtionKey: 'b',
                model: 'c',
                // @ts-ignore
                request: mockReq
            });

            await model.resolve('ha');

            assert.strictEqual(mockReq.firstCall.args[0].url, 'https://trasknlp.azure-api.net/intent');
        });

    });

});
