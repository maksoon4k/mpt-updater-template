"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GreenCore {
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
        const modFolderName = "MoxoPixel-GreenCore";
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
        const dbMastering = this.db.globals.config.Mastering;
        for (const weapon in dbMastering) {
            if (dbMastering[weapon].Name == "MDR")
                dbMastering[weapon].Templates.push("gc_1_MDR_556");
            if (dbMastering[weapon].Name == "MDR")
                dbMastering[weapon].Templates.push("gc_2_MDR_762");
            if (dbMastering[weapon].Name == "M4")
                dbMastering[weapon].Templates.push("gc_3_M4A1_green");
        }
        this.logger.info("------------------------");
        this.logger.info("Green Core Loaded");
    }
    cloneItem(itemToClone, greenCoreID) {
        if (this.mydb.items[greenCoreID].enable == true) {
            let greenCoreItemOut = this.jsonUtil.clone(this.db.templates.items[itemToClone]);
            greenCoreItemOut._id = greenCoreID;
            greenCoreItemOut = this.compareAndReplace(greenCoreItemOut, this.mydb.items[greenCoreID]["items"]);
            const gcCompatibilities = (typeof this.mydb.items[greenCoreID].gcCompatibilities == "undefined") ? {} : this.mydb.items[greenCoreID].gcCompatibilities;
            const gcConflicts = (typeof this.mydb.items[greenCoreID].gcConflicts == "undefined") ? [] : this.mydb.items[greenCoreID].gcConflicts;
            for (const modSlotName in gcCompatibilities) {
                for (const slot of greenCoreItemOut._props.Slots) {
                    if (slot._name === modSlotName)
                        for (const id of gcCompatibilities[modSlotName])
                            slot._props.filters[0].Filter.push(id);
                }
            }
            greenCoreItemOut._props.ConflictingItems = greenCoreItemOut._props.ConflictingItems.concat(gcConflicts);
            this.db.templates.items[greenCoreID] = greenCoreItemOut;
            const handbookEntry = {
                "Id": greenCoreID,
                "ParentId": this.mydb.items[greenCoreID]["handbook"]["ParentId"],
                "Price": this.mydb.items[greenCoreID]["handbook"]["Price"]
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
    addCompatibilitiesAndConflicts(itemClone, greenCoreID) {
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
                        entry._props.filters[0].Filter.push(greenCoreID);
                }
            }
            const conflictingItems = (typeof this.db.templates.items[item]._props.ConflictingItems === "undefined") ? [] : this.db.templates.items[item]._props.ConflictingItems;
            for (const conflictID of conflictingItems)
                if (conflictID === itemClone)
                    conflictingItems.push(greenCoreID);
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
module.exports = { mod: new GreenCore() };
//# sourceMappingURL=mod.js.map