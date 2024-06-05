"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const WTTInstanceManager_1 = require("./WTTInstanceManager");
class HeadVoiceSelector {
    Instance = new WTTInstanceManager_1.WTTInstanceManager();
    version;
    modName = "WTT-HeadVoiceSelector";
    debug = false;
    preAkiLoad(container) {
        this.Instance.preAkiLoad(container, this.modName);
        this.Instance.debug = this.debug;
        this.registerWTTChangeHeadRoute();
        this.registerWTTChangeVoiceRoute();
        this.Instance.logger.log(`[${this.Instance.modName}] Routes successfully loaded!`, LogTextColor_1.LogTextColor.GREEN);
    }
    postDBLoad(container) {
        this.Instance.postDBLoad(container);
    }
    registerWTTChangeHeadRoute() {
        this.Instance.staticRouter.registerStaticRouter("WTTChangeHead", [
            {
                url: "/WTT/WTTChangeHead",
                action: (url, info, sessionId) => {
                    if (this.Instance.debug) {
                        console.log(info);
                    }
                    try {
                        const pmcSaveProfile = this.Instance.saveServer.getProfile(sessionId).characters.pmc;
                        pmcSaveProfile.Customization.Head = info.Data;
                        this.Instance.saveServer.saveProfile(sessionId);
                        this.Instance.logger.log(`[${this.Instance.modName}] Profile changes saved successfully.`, LogTextColor_1.LogTextColor.GREEN);
                        return JSON.stringify({ success: true });
                    }
                    catch (err) {
                        this.Instance.logger.log(`[${this.Instance.modName}] Error saving profile. ${err}`, LogTextColor_1.LogTextColor.RED);
                        return JSON.stringify({ success: false });
                    }
                }
            }
        ], "");
    }
    registerWTTChangeVoiceRoute() {
        this.Instance.staticRouter.registerStaticRouter("WTTChangeVoice", [
            {
                url: "/WTT/WTTChangeVoice",
                action: (url, info, sessionId) => {
                    if (this.Instance.debug) {
                        console.log(info);
                    }
                    try {
                        const pmcSaveProfile = this.Instance.saveServer.getProfile(sessionId).characters.pmc;
                        if (this.debug) {
                            this.Instance.logger.log(`[${this.Instance.modName}] Voice Name: ${info.Data}`, LogTextColor_1.LogTextColor.GREEN);
                            this.Instance.logger.log(`[${this.Instance.modName}] PMC Voice before profile changes: ${pmcSaveProfile.Info.Voice}`, LogTextColor_1.LogTextColor.GREEN);
                        }
                        pmcSaveProfile.Info.Voice = info.Data;
                        if (this.debug) {
                            this.Instance.logger.log(`[${this.Instance.modName}] PMC Voice after profile changes: ${pmcSaveProfile.Info.Voice}`, LogTextColor_1.LogTextColor.GREEN);
                        }
                        this.Instance.saveServer.saveProfile(sessionId);
                        this.Instance.logger.log(`[${this.Instance.modName}] Profile changes saved successfully.`, LogTextColor_1.LogTextColor.GREEN);
                        return JSON.stringify({ success: true });
                    }
                    catch (err) {
                        this.Instance.logger.log(`[${this.Instance.modName}] Error saving profile. ${err}`, LogTextColor_1.LogTextColor.RED);
                        return JSON.stringify({ success: false });
                    }
                }
            }
        ], "");
    }
}
module.exports = { mod: new HeadVoiceSelector() };
//# sourceMappingURL=mod.js.map