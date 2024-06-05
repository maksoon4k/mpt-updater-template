"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssortUtils = void 0;
class AssortUtils {
    ref;
    itemsToSell = [];
    barterScheme = {};
    loyaltyLevel = {};
    constructor(ref) {
        this.ref = ref;
    }
    createSingleAssortItem(itemTpl, itemId = undefined) {
        const newItemToAdd = {
            _id: !itemId ? this.ref.hashUtil.generate() : itemId,
            _tpl: itemTpl,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: false,
                StackObjectsCount: 100
            }
        };
        this.itemsToSell.push(newItemToAdd);
        return this;
    }
    createComplexAssortItem(items) {
        items[0].parentId = "hideout";
        items[0].slotId = "hideout";
        if (!items[0].upd) {
            items[0].upd = {};
        }
        items[0].upd.UnlimitedCount = false;
        items[0].upd.StackObjectsCount = 100;
        this.itemsToSell.push(...items);
        return this;
    }
    addStackCount(stackCount) {
        this.itemsToSell[0].upd.StackObjectsCount = stackCount;
        return this;
    }
    addUnlimitedStackCount() {
        this.itemsToSell[0].upd.StackObjectsCount = 999999;
        this.itemsToSell[0].upd.UnlimitedCount = true;
        return this;
    }
    makeStackCountUnlimited() {
        this.itemsToSell[0].upd.StackObjectsCount = 999999;
        return this;
    }
    addBuyRestriction(maxBuyLimit) {
        this.itemsToSell[0].upd.BuyRestrictionMax = maxBuyLimit;
        this.itemsToSell[0].upd.BuyRestrictionCurrent = 0;
        return this;
    }
    addLoyaltyLevel(level) {
        this.loyaltyLevel[this.itemsToSell[0]._id] = level;
        return this;
    }
    addMoneyCost(currencyType, amount) {
        this.barterScheme[this.itemsToSell[0]._id] = [
            [
                {
                    count: amount,
                    _tpl: currencyType
                }
            ]
        ];
        return this;
    }
    addBarterCost(itemTpl, count) {
        const sellableItemId = this.itemsToSell[0]._id;
        if (Object.keys(this.barterScheme).length === 0) {
            this.barterScheme[sellableItemId] = [[
                    {
                        count: count,
                        _tpl: itemTpl
                    }
                ]];
        }
        else {
            const existingData = this.barterScheme[sellableItemId][0].find(x => x._tpl === itemTpl);
            if (existingData) {
                existingData.count += count;
            }
            else {
                this.barterScheme[sellableItemId][0].push({
                    count: count,
                    _tpl: itemTpl
                });
            }
        }
        return this;
    }
    export(data, blockDupes) {
        const itemBeingSoldId = this.itemsToSell[0]._id;
        const itemBeingSoldTpl = this.itemsToSell[0]._tpl;
        if (blockDupes) {
            if (data.assort.items.find(x => x._id === itemBeingSoldId)) {
                return;
            }
            if (data.assort.items.find(x => x._tpl === itemBeingSoldTpl)) {
                return;
            }
        }
        data.assort.items.push(...this.itemsToSell);
        data.assort.barter_scheme[itemBeingSoldId] = this.barterScheme[itemBeingSoldId];
        data.assort.loyal_level_items[itemBeingSoldId] = this.loyaltyLevel[itemBeingSoldId];
        this.itemsToSell = [];
        this.barterScheme = {};
        this.loyaltyLevel = {};
        return this;
    }
    pushFromTraderAssort(items, itemTpl, count, stackCount, level, data, blockDupes) {
        items[0].parentId = "hideout";
        items[0].slotId = "hideout";
        if (!items[0].upd) {
            items[0].upd = {};
        }
        items[0].upd.UnlimitedCount = false;
        items[0].upd.StackObjectsCount = 100;
        this.itemsToSell.push(...items);
        const sellableItemId = this.itemsToSell[0]._id;
        if (Object.keys(this.barterScheme).length === 0) {
            this.barterScheme[sellableItemId] = [[
                    {
                        count: count,
                        _tpl: itemTpl
                    }
                ]];
        }
        else {
            const existingData = this.barterScheme[sellableItemId][0].find(x => x._tpl === itemTpl);
            if (existingData) {
                existingData.count += count;
            }
            else {
                this.barterScheme[sellableItemId][0].push({
                    count: count,
                    _tpl: itemTpl
                });
            }
        }
        this.itemsToSell[0].upd.StackObjectsCount = stackCount;
        this.loyaltyLevel[this.itemsToSell[0]._id] = level;
        const itemBeingSoldId = this.itemsToSell[0]._id;
        const itemBeingSoldTpl = this.itemsToSell[0]._tpl;
        if (blockDupes) {
            if (data.assort.items.find(x => x._id === itemBeingSoldId)) {
                return;
            }
            if (data.assort.items.find(x => x._tpl === itemBeingSoldTpl)) {
                return;
            }
        }
        data.assort.items.push(...this.itemsToSell);
        data.assort.barter_scheme[itemBeingSoldId] = this.barterScheme[itemBeingSoldId];
        data.assort.loyal_level_items[itemBeingSoldId] = this.loyaltyLevel[itemBeingSoldId];
        this.itemsToSell = [];
        this.barterScheme = {};
        this.loyaltyLevel = {};
    }
}
exports.AssortUtils = AssortUtils;
//# sourceMappingURL=Methods.js.map