"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceStatus = exports.FileType = void 0;
var FileType;
(function (FileType) {
    FileType[FileType["IMAGE"] = 0] = "IMAGE";
    FileType[FileType["VIDEO"] = 1] = "VIDEO";
    FileType[FileType["AUDIO"] = 2] = "AUDIO";
    FileType[FileType["DOCUMENT"] = 3] = "DOCUMENT";
    FileType[FileType["MODEL_3D"] = 4] = "MODEL_3D";
    FileType[FileType["OTHER"] = 5] = "OTHER";
})(FileType || (exports.FileType = FileType = {}));
var MarketplaceStatus;
(function (MarketplaceStatus) {
    MarketplaceStatus[MarketplaceStatus["DRAFT"] = 0] = "DRAFT";
    MarketplaceStatus[MarketplaceStatus["PUBLISHED"] = 1] = "PUBLISHED";
    MarketplaceStatus[MarketplaceStatus["SOLD"] = 2] = "SOLD";
    MarketplaceStatus[MarketplaceStatus["ARCHIVED"] = 3] = "ARCHIVED";
})(MarketplaceStatus || (exports.MarketplaceStatus = MarketplaceStatus = {}));
