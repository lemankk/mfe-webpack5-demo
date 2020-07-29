const path = require("path");
exports.default = {
    appPackageJson: path.resolve(__dirname, "../package.json"),
    publicUrlOrPath: path.resolve(__dirname, "../public"),
};