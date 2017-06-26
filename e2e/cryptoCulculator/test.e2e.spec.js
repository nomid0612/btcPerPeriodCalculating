const cryptoCulc = require('./cryptoCulc');

describe('Crypto Caclulator ', () => {

    it('should verify correct counting per month', () => {
        cryptoCulc.calculation(30, 100, 'TH/s', 1000, 1);
    });

});
