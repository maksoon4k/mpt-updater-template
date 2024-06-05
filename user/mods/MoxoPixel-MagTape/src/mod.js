"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MagTape {
    db;
    mydb;
    logger;
    jsonUtil;
    postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.jsonUtil = container.resolve("JsonUtil");
        const databaseServer = container.resolve("DatabaseServer");
        const databaseImporter = container.resolve("ImporterUtil");
        const modLoader = container.resolve("PreAkiModLoader");
        const modFolderName = "MoxoPixel-MagTape";
        const traders = {
            "painter": "PAINTERSHOP"
        };
        this.db = databaseServer.getTables();
        this.mydb = databaseImporter.loadRecursive(`${modLoader.getModPath(modFolderName)}database/`);
        for (const newItem in this.mydb.items) {
            this.cloneItem(this.mydb.items[newItem].clone, newItem);
            this.addCompatibilitiesAndConflicts(this.mydb.items[newItem].clone, newItem);
            const newItemLocales = this.mydb.items[newItem].locales;
            for (const lang in this.db.locales.global) {
                this.db.locales.global[lang][`${newItem} Name`] = newItemLocales.Name;
                this.db.locales.global[lang][`${newItem} ShortName`] = newItemLocales.Shortname;
                this.db.locales.global[lang][`${newItem} Description`] = newItemLocales.Description;
            }
        }
        for (const trader in traders)
            this.addTraderAssort(traders[trader]);
    }
    cloneItem(itemToClone, magTapeID) {
        if (this.mydb.items[magTapeID].enable == true) {
            let magTapeItemOut = this.jsonUtil.clone(this.db.templates.items[itemToClone]);
            magTapeItemOut._id = magTapeID;
            magTapeItemOut = this.compareAndReplace(magTapeItemOut, this.mydb.items[magTapeID]["items"]);
            this.db.templates.items[magTapeID] = magTapeItemOut;
            const handbookEntry = {
                "Id": magTapeID,
                "ParentId": this.mydb.items[magTapeID]["handbook"]["ParentId"],
                "Price": this.mydb.items[magTapeID]["handbook"]["Price"]
            };
            this.db.templates.handbook.Items.push(handbookEntry);
        }
    }
    compareAndReplace(originalItem, attributesToChange) {
        for (const key in attributesToChange) {
            if ((["boolean", "string", "number"].includes(typeof attributesToChange[key])) || Array.isArray(attributesToChange[key])) {
                if (key in originalItem)
                    originalItem[key] = attributesToChange[key];
                else
                    this.logger.error("Error finding the attribute: \"" + key + "\", default value is used instead.");
            }
            else
                originalItem[key] = this.compareAndReplace(originalItem[key], attributesToChange[key]);
        }
        return originalItem;
    }
    addCompatibilitiesAndConflicts(itemClone, magTapeID) {
        for (const item in this.db.templates.items) {
            if (item in this.mydb.items)
                continue;
            const slots = (typeof this.db.templates.items[item]._props.Slots === "undefined") ? [] : this.db.templates.items[item]._props.Slots;
            const chambers = (typeof this.db.templates.items[item]._props.Chambers === "undefined") ? [] : this.db.templates.items[item]._props.Chambers;
            const cartridges = (typeof this.db.templates.items[item]._props.Cartridges === "undefined") ? [] : this.db.templates.items[item]._props.Cartridges;
            const combined = slots.concat(chambers, cartridges);
            for (const entry of combined) {
                for (const id of entry._props.filters[0].Filter) {
                    if (id === itemClone)
                        entry._props.filters[0].Filter.push(magTapeID);
                }
            }
            const conflictingItems = (typeof this.db.templates.items[item]._props.ConflictingItems === "undefined") ? [] : this.db.templates.items[item]._props.ConflictingItems;
            for (const conflictID of conflictingItems)
                if (conflictID === itemClone)
                    conflictingItems.push(magTapeID);
        }
    }
    addTraderAssort(trader) {
        for (const item in this.mydb.traders[trader].assort.items) {
            this.db.traders[trader].assort.items.push(this.mydb.traders[trader].assort.items[item]);
        }
        for (const item in this.mydb.traders[trader].assort.barter_scheme) {
            this.db.traders[trader].assort.barter_scheme[item] = this.mydb.traders[trader].assort.barter_scheme[item];
        }
        for (const item in this.mydb.traders[trader].assort.loyal_level_items) {
            this.db.traders[trader].assort.loyal_level_items[item] = this.mydb.traders[trader].assort.loyal_level_items[item];
        }
    }
}
module.exports = { mod: new MagTape() };
//# sourceMappingURL=mod.js.map