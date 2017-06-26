const accounting = require('accounting');

module.exports = {
    elements: {
        hashingPowerInput: element(by.css('#hashing-power')),
        powerConsumptionInput: element(by.id('power-consumption')),
        costInput: element(by.id('cost')),
        hashUnitDropdown: element(by.model('currentData.HashingUnit')),
        timeRow: element.all(by.css('.calculator-container')),
        conversValueRead: element(by.css('.calculated-for>.calculated-for-value'))
    },

    fillField: function(field, fieledValue){
        field.clear().sendKeys(fieledValue);
    },

    selectHashUnit: function(hashUnitValue){
        this.elements.hashUnitDropdown.click();
        element(by.cssContainingText('[ng-model="currentData.HashingUnit"]>option',hashUnitValue)).click();
    },

    _powerCostCulculation: function (powerConsumption, energyCost, timePeriod ) {
        return (powerConsumption * energyCost*timePeriod*24)/1000
    },

    _minerPerPeriodCulculation: function (timePeriod, hashingPower,hashUnitValue) {
        const difficulty = 711697198173.7566;
        const blockRewards = 12.5;
        let minerCulcVariations = function(value) {
            return (timePeriod * 24 / (difficulty * Math.pow(2,32) / (hashingPower * Math.pow(10,value)) / 60 / 60) * blockRewards)
        };
        switch(hashUnitValue) {
            case 'H/s':
                return minerCulcVariations(1);
                break;
            case 'KH/s':
                return minerCulcVariations(3);
                break;
            case 'MH/s':
                return minerCulcVariations(6);
                break;
            case 'GH/s':
                return minerCulcVariations(9);
                break;
            case 'TH/s':
                return minerCulcVariations(12);
                break;
            default:
                return minerCulcVariations(9);
                break;
        }
    },

    _rowAccordingTimePeriod:function(timePeroidInDays){
        let rowNumber;
        switch(timePeroidInDays) {
            case 1:
                return rowNumber = 0;
                break;
            case 7:
                return rowNumber = 1;
                break;
            case 30:
                return rowNumber = 2;
                break;
            case 365:
                return rowNumber = 3;
                break;
        }
    },

    _profitPerPeriod:function(minerPerPeriod, cost, conversationRate) {
        return conversationRate*minerPerPeriod - cost
    },

    calculation: function(timePeroidInDays, hashingPower, hashUnitValue, powerConsumption, energyCostPerKwh ){
        browser.get('https://www.cryptocompare.com/mining/calculator/btc');
        browser.ignoreSynchronization = true;
        this.fillField(this.elements.hashingPowerInput, hashingPower);
        this.selectHashUnit(hashUnitValue);
        this.fillField(this.elements.powerConsumptionInput, powerConsumption);
        this.fillField(this.elements.costInput, energyCostPerKwh);
        let rowNumber = this._rowAccordingTimePeriod(timePeroidInDays);
        let energyCostForPeriod = this._powerCostCulculation(powerConsumption,energyCostPerKwh,timePeroidInDays);
        let minerPerPeriod = this._minerPerPeriodCulculation(timePeroidInDays,hashingPower,hashUnitValue);
        expect(this.elements.timeRow.get(rowNumber).all(by.css('.calculator-col>.calculator-value')).get(2).getText()).
        toEqual('$ ' + accounting.formatMoney(energyCostForPeriod, ''));
        expect(this.elements.timeRow.get(rowNumber).all(by.css('.calculator-col>.calculator-value')).get(1).getText()).
        toEqual('Ƀ ' + accounting.formatMoney(minerPerPeriod,''));
        let timeRow = this.elements.timeRow;
        this.elements.conversValueRead.getText().then(function (result) {
             let resultArr = result.split(' ');
             let conversationRate = parseFloat(resultArr[4]);
             expect(timeRow.get(rowNumber).all(by.css('.calculator-col>.calculator-value')).get(0).getText()).
             toEqual('$ ' + accounting.formatMoney(((conversationRate*minerPerPeriod).toFixed(2)) - energyCostForPeriod,''));
        })
    }
}
