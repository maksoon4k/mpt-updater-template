import { DependencyContainer } from "tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderAssort, ITraderBase } from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { Traders } from "@spt-aki/models/enums/Traders";
import * as baseJson from "../db/base.json";
import * as assortJson from "../db/assort.json";
import * as path from "path";

const fs = require('fs');
const modPath = path.normalize(path.join(__dirname, '..'));

class civicPainter implements IPreAkiLoadMod, IPostDBLoadMod {
    mod: string
    logger: ILogger
    private configServer: ConfigServer
    private ragfairConfig: IRagfairConfig

    constructor() {
        this.mod = "aMoxoPixel-Painter"
    }

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger")

        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader")
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter")
        const configServer = container.resolve<ConfigServer>("ConfigServer")
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
        
        this.registerProfileImage(preAkiModLoader, imageRouter)
        
        this.setupTraderUpdateTime(traderConfig)
        
        Traders["PAINTERSHOP"] = "PAINTERSHOP"
    }
    
    public postDBLoad(container: DependencyContainer): void {
        this.configServer = container.resolve("ConfigServer")
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes.RAGFAIR)

        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer")
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer")
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter")
        const traderConfig: ITraderConfig = configServer.getConfig(ConfigTypes.TRADER)
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil")
        const tables = databaseServer.getTables()

        this.addTraderToDb(baseJson, tables, jsonUtil)
        this.addTraderToLocales(tables, baseJson.name, "Ivan Samoylov", baseJson.nickname, baseJson.location, "Ivan Samoylov is a master craftsman renowned for his exceptional skill in creating exquisite weapon cosmetics. With an innate talent for blending artistry and functionality, he transforms ordinary weapons into mesmerizing works of art.")
        this.ragfairConfig.traders[baseJson._id] = true

        this.importQuests(tables)
        this.importQuestLocales(tables)
        this.routeQuestImages(imageRouter)
    }

    private registerProfileImage(preAkiModLoader: PreAkiModLoader, imageRouter: ImageRouter): void {
        const imageFilepath = `./${preAkiModLoader.getModPath(this.mod)}res`

        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/painter.jpg`)
    }

    private setupTraderUpdateTime(traderConfig: ITraderConfig): void {
        const traderRefreshRecord: UpdateTime = { traderId: baseJson._id, seconds: { min: 2000, max: 6600 } }
        
        traderConfig.updateTime.push(traderRefreshRecord)
    }
    
    private addTraderToDb(traderDetailsToAdd: any, tables: IDatabaseTables, jsonUtil: JsonUtil): void {
        tables.traders[traderDetailsToAdd._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)) as ITraderAssort,
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd)) as ITraderBase,
            questassort: {
                started: {},
                success: {
                    "MT_01007_AR_MAGPUL_30_BLUE": "painter_1",
                    "MT_01008_AR_MAGPUL_30_RED": "painter_1",
                    "MT_01009_AR_MAGPUL_30_YELLOW": "painter_1",
                    "MT_01010_AR_MAGPUL_30_WHITE": "painter_1",
                    "MT_01011_AK_MAGPUL_30_BLUE": "painter_1",
                    "MT_01012_AK_MAGPUL_30_RED": "painter_1",
                    "MT_01013_AK_MAGPUL_30_GREEN": "painter_1",
                    "MT_01014_AK_MAGPUL_30_YELLOW": "painter_1",
                    "MT_01015_AK_MAGPUL_30_WHITE": "painter_1",
                    "MT_01016_AK_6L31_BLUE": "painter_1",
                    "MT_01017_AK_6L31_RED": "painter_1",
                    "MT_01018_AK_6L31_GREEN": "painter_1",
                    "MT_01019_AK_6L31_YELLOW": "painter_1",
                    "MT_01020_AK_6L31_WHITE": "painter_1",
                    "PARENT_0101_BLACK_LINES_M4A1": "painter_2",
                    "PARENT_0102_BLACK_LINES_AK103": "painter_2",
                    "PARENT_0104_BLACK_LINES_MK47": "painter_2"
                },
                fail: {}
            }
        }
    }
    
    private addTraderToLocales(tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string) {
        const locales = Object.values(tables.locales.global) as Record<string, string>[]
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName
            locale[`${baseJson._id} FirstName`] = firstName
            locale[`${baseJson._id} Nickname`] = nickName
            locale[`${baseJson._id} Location`] = location
            locale[`${baseJson._id} Description`] = description
        }
    }

    public loadFiles(dirPath, extName, cb) {
        if (!fs.existsSync(dirPath)) return
        const dir = fs.readdirSync(dirPath, { withFileTypes: true })
        dir.forEach(item => {
            const itemPath = path.normalize(`${dirPath}/${item.name}`)
            if (item.isDirectory()) this.loadFiles(itemPath, extName, cb)
            else if (extName.includes(path.extname(item.name))) cb(itemPath)
        });
    }

    public importQuests(tables) {
        let questCount = 0

        this.loadFiles(`${modPath}/db/quests/`, [".json"], function(filePath) {
            const item = require(filePath)
            if (Object.keys(item).length < 1) return 
            for (const quest in item) {
                tables.templates.quests[quest] = item[quest]
                questCount++
            }
        })
    }

    public importQuestLocales(tables) {
        const serverLocales = ['ch','cz','en','es','es-mx','fr','ge','hu','it','jp','pl','po','ru','sk','tu']
        const addedLocales = {}

        for (const locale of serverLocales) {
            this.loadFiles(`${modPath}/db/locales/${locale}`, [".json"], function(filePath) {
                const localeFile = require(filePath)
                if (Object.keys(localeFile).length < 1) return
                for (const currentItem in localeFile) {
                    tables.locales.global[locale][currentItem] = localeFile[currentItem]
                    if (!Object.keys(addedLocales).includes(locale)) addedLocales[locale] = {}
                    addedLocales[locale][currentItem] = localeFile[currentItem]
                }
            })
        }

        for (const locale of serverLocales) {
            if (locale == "en") continue
            for (const englishItem in addedLocales["en"]) {
                if (locale in addedLocales) { 
                    if (englishItem in addedLocales[locale]) continue
                }
                if (tables.locales.global[locale] != undefined) tables.locales.global[locale][englishItem] = addedLocales["en"][englishItem]
            }
        }
    }

    public routeQuestImages(imageRouter) {
        let imageCount = 0

        this.loadFiles(`${modPath}/res/quests/`, [".png", ".jpg"], function(filePath) {
            imageRouter.addRoute(`/files/quest/icon/${path.basename(filePath, path.extname(filePath))}`, filePath);
            imageCount++
        })
    }
}

module.exports = { mod: new civicPainter() }