"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const baseFeatures_1 = require("./BaseFeatures/baseFeatures");
const References_1 = require("./Utils/References");
const Methods_1 = require("./Utils/Methods");
const EventWeightingsConfig = __importStar(require("../config/EventWeightings.json"));
const modName = "RO Standalone";
const fs = require('fs');
class RaidOverhaulStandalone {
    ref = new References_1.References();
    assortUtils = new Methods_1.AssortUtils(this.ref);
    static pluginDepCheck() {
        const pluginRO = "rostandalone.dll";
        try {
            const pluginPath = fs.readdirSync("./BepInEx/plugins/ROStandalone").map(plugin => plugin.toLowerCase());
            return pluginPath.includes(pluginRO);
        }
        catch {
            return false;
        }
    }
    /**
    * @param container
    */
    preAkiLoad(container) {
        this.ref.preAkiLoad(container);
        const staticRouterModService = container.resolve("StaticRouterModService");
        staticRouterModService.registerStaticRouter("GetEventWeightings", [
            {
                url: "/ROStandaloneBackend/GetEventWeightings",
                action: (url, info, sessionId, output) => {
                    const EventWeightings = EventWeightingsConfig;
                    return JSON.stringify(EventWeightings);
                }
            }
        ], "");
    }
    /**
    * @param container
    */
    postDBLoad(container) {
        this.ref.postDBLoad(container);
        //Imports
        const modFeatures = new baseFeatures_1.ModFeatures(this.assortUtils, this.ref);
        //Random message on server on startup
        const messageArray = ["The hamsters can take a break now", "Time to get wrecked by Birdeye LOL", "Back to looking for cat pics", "I made sure to crank up your heart attack event chances", "If there's a bunch of red text it's 100% not my fault", "Good luck out there", "Nerd...."];
        const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
        //Dependancy Check
        if (!RaidOverhaulStandalone.pluginDepCheck()) {
            return this.ref.logger.error(`[${modName}] Error, client portion of Raid Overhaul Standalone is missing from BepInEx/plugins folder.\nPlease install correctly. ***bonk***`);
        }
        //Push all of the mods base features
        modFeatures.pushModFeatures();
        this.ref.logger.log(`[${modName}] has finished modifying your raids. ${randomMessage}.`, LogTextColor_1.LogTextColor.CYAN);
    }
}
//      \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/     \('_')/
module.exports = { mod: new RaidOverhaulStandalone() };
//# sourceMappingURL=ROcore.js.map