import { DependencyContainer }  from "tsyringe";
import { IPostDBLoadMod }       from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer }       from "@spt-aki/servers/DatabaseServer";
import { ImporterUtil }         from "@spt-aki/utils/ImporterUtil";
import { ILogger }              from "@spt-aki/models/spt/utils/ILogger";
import { ICoreDatabase }        from "@spt-aki/atlas/ICoreDatabase";
import { PreAkiModLoader }      from "@spt-aki/loaders/PreAkiModLoader";
import { IDatabaseTables }      from "@spt-aki/models/spt/server/IDatabaseTables";
import { JsonUtil }             from "@spt-aki/utils/JsonUtil"


class RedCore implements IPostDBLoadMod 
{
    private db:         IDatabaseTables;
    private mydb:       ICoreDatabase;
    private logger:     ILogger;
    private jsonUtil:   JsonUtil;

    public postDBLoad(container: DependencyContainer): void 
    {
        this.logger =               container.resolve<ILogger>("WinstonLogger");
        this.jsonUtil =             container.resolve<JsonUtil>("JsonUtil");

        const databaseServer =      container.resolve<DatabaseServer>("DatabaseServer");
        const databaseImporter =    container.resolve<ImporterUtil>("ImporterUtil");
        const modLoader =           container.resolve<PreAkiModLoader>("PreAkiModLoader");

        const modFolderName =   "MoxoPixel-RedCore";

        const traders = {
            "painter":     "PAINTERSHOP"
        };

        this.db = databaseServer.getTables();
        this.mydb = databaseImporter.loadRecursive(`${modLoader.getModPath(modFolderName)}database/`);

        for (const newItem in this.mydb.items)
        {
            this.cloneItem(this.mydb.items[newItem].clone, newItem);
            this.addCompatibilitiesAndConflicts(this.mydb.items[newItem].clone, newItem);
        
            const newItemLocales = this.mydb.items[newItem].locales;
            for (const lang in this.db.locales.global) 
            {
                this.db.locales.global[lang][`${newItem} Name`] = newItemLocales.Name;
                this.db.locales.global[lang][`${newItem} ShortName`] = newItemLocales.Shortname;
                this.db.locales.global[lang][`${newItem} Description`] = newItemLocales.Description;
            }
        }
        for (const trader in traders) this.addTraderAssort(traders[trader]);

        const dbMastering = this.db.globals.config.Mastering;
        for (const weapon in dbMastering)
        {

        }

        this.logger.info("------------------------");
        this.logger.info("Red Core Loaded");
    
    }

    private cloneItem(itemToClone: string, redCoreID: string): void
    {
        if ( this.mydb.items[redCoreID].enable == true )
        {
            let redCoreItemOut = this.jsonUtil.clone(this.db.templates.items[itemToClone]);

            redCoreItemOut._id = redCoreID;
            redCoreItemOut = this.compareAndReplace(redCoreItemOut, this.mydb.items[redCoreID]["items"]);

            const rcCompatibilities: object = (typeof this.mydb.items[redCoreID].rcCompatibilities == "undefined") ? {} : this.mydb.items[redCoreID].rcCompatibilities;
            const rcConflicts: Array<string> = (typeof this.mydb.items[redCoreID].rcConflicts == "undefined")      ? [] : this.mydb.items[redCoreID].rcConflicts;
            for (const modSlotName in rcCompatibilities)
            {
                for (const slot of redCoreItemOut._props.Slots)
                {
                    if ( slot._name === modSlotName ) for (const id of rcCompatibilities[modSlotName]) slot._props.filters[0].Filter.push(id);
                }
            }
            redCoreItemOut._props.ConflictingItems = redCoreItemOut._props.ConflictingItems.concat(rcConflicts);

            this.db.templates.items[redCoreID] = redCoreItemOut;

            const handbookEntry = {
                "Id": redCoreID,
                "ParentId": this.mydb.items[redCoreID]["handbook"]["ParentId"],
                "Price": this.mydb.items[redCoreID]["handbook"]["Price"]
            };

            this.db.templates.handbook.Items.push(handbookEntry);
        }
    }

    private compareAndReplace(originalItem, attributesToChange)
    {
        for (const key in attributesToChange)
        {
            if ( (["boolean", "string", "number"].includes(typeof attributesToChange[key])) || Array.isArray(attributesToChange[key]) )
            {
                if ( key in originalItem ) originalItem[key] = attributesToChange[key];
                else this.logger.error("Error finding the attribute: \"" + key + "\", default value is used instead.");
            } 
            else originalItem[key] = this.compareAndReplace(originalItem[key], attributesToChange[key]);
        }

        return originalItem;
    }

    private addCompatibilitiesAndConflicts(itemClone: string, redCoreID: string): void
    {
        for (const item in this.db.templates.items)
        {
            if ( item in this.mydb.items ) continue;
            
            const slots = (typeof this.db.templates.items[item]._props.Slots === "undefined")            ? [] : this.db.templates.items[item]._props.Slots;
            const chambers = (typeof this.db.templates.items[item]._props.Chambers === "undefined")      ? [] : this.db.templates.items[item]._props.Chambers;
            const cartridges = (typeof this.db.templates.items[item]._props.Cartridges === "undefined")  ? [] : this.db.templates.items[item]._props.Cartridges;
            const combined = slots.concat(chambers, cartridges)

            for (const entry of combined)
            {
                for (const id of entry._props.filters[0].Filter)
                {
                    if ( id === itemClone ) entry._props.filters[0].Filter.push(redCoreID);
                }
            }

            const conflictingItems = (typeof this.db.templates.items[item]._props.ConflictingItems === "undefined") ? [] : this.db.templates.items[item]._props.ConflictingItems;
            for (const conflictID of conflictingItems) if ( conflictID === itemClone ) conflictingItems.push(redCoreID);
        }
    }

    private addTraderAssort(trader: string): void 
    {
        for (const item in this.mydb.traders[trader].assort.items) 
        {
            this.db.traders[trader].assort.items.push(this.mydb.traders[trader].assort.items[item]);
        }

        for (const item in this.mydb.traders[trader].assort.barter_scheme) 
        {
            this.db.traders[trader].assort.barter_scheme[item] = this.mydb.traders[trader].assort.barter_scheme[item];
        }

        for (const item in this.mydb.traders[trader].assort.loyal_level_items) 
        {
            this.db.traders[trader].assort.loyal_level_items[item] = this.mydb.traders[trader].assort.loyal_level_items[item];
        }
    }
}

module.exports = { mod: new RedCore() }